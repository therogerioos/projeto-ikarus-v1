package com.ikarus.auth_api.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ikarus.auth_api.dto.TrocaSenhaDTO;
import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.repository.UserRepository;
import com.ikarus.auth_api.security.JwtTokenProvider;
import com.ikarus.auth_api.service.DispositivoService;
import com.ikarus.auth_api.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/center-security")
public class GestorDeAcessoController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DispositivoService dispositivoService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    record LoginRequest(String username, String password) {}

    record LoginUserRequest(String username, String password, String hostname, String uuid, String hashMaquina) {}

    @PostMapping("/trocar-senha")
    public ResponseEntity<?> trocarSenha(@RequestBody TrocaSenhaDTO dto) {
        try {
            userService.trocarSenha(dto);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Senha alterada com sucesso.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login-admin")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest request, HttpServletResponse response) {
        Optional<User> userOpt = userRepository.findByUsername(request.username());

        if (userOpt.isEmpty()) {
            Map<String, String> responseNaoEncontrado = new HashMap<>();
            responseNaoEncontrado.put("error", "Usuário não encontrado");
            return ResponseEntity.status(401).body(responseNaoEncontrado);
        }

        User user = userOpt.get();

        if (user.getRole() != com.ikarus.auth_api.model.enums.Role.ADMIN) {
            Map<String, String> responseSemPermissao = new HashMap<>();
            responseSemPermissao.put("error", "Perfil sem permissão de acesso.");
            return ResponseEntity.status(403).body(responseSemPermissao);
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            Map<String, String> responseIncorreta = new HashMap<>();
            responseIncorreta.put("error", "Senha incorreta.");
            return ResponseEntity.status(401).body(responseIncorreta);
        }

        if (user.isProvisionalPassword()) {

            String resetToken = jwtTokenProvider.generateResetToken(user.getUsername(), 10); // 10 minutos

            Cookie resetCookie = new Cookie("jwt_token", resetToken);
            resetCookie.setHttpOnly(true);
            resetCookie.setSecure(true); // true em produção
            resetCookie.setPath("/");
            resetCookie.setMaxAge(10 * 60); // 10 minutos

            response.addCookie(resetCookie);

            Map<String, Object> body = new HashMap<>();
            body.put("message", "Direcionando para troca de senha");
            body.put("redirect", "change-password");
            return ResponseEntity.ok(body);
        }

        // Gerar token JWT
        String token = jwtTokenProvider.generateToken(user.getUsername(), user.getRole());

        // Criar cookie HTTP Only
        Cookie cookie = new Cookie("jwt_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // true em produção com HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(30 * 60); // 30 minutos

        response.addCookie(cookie);

        response.setHeader("Set-Cookie", String.format(
            "jwt_token=%s; Max-Age=%d; Path=/; Secure; HttpOnly; SameSite=None",
            token, 30 * 60
        ));

        Map<String, Object> body = new HashMap<>();
        body.put("message", "Login efetuado com sucesso");

        return ResponseEntity.ok(body);

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/logout-admin")
    public ResponseEntity<?> logoutAdmin(HttpServletResponse response) {
        // Remove cookie JWT
        Cookie cookie = new Cookie("jwt_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok("Logout efetuado com sucesso");
    }

    @PostMapping("/login-user")
    public ResponseEntity<?> loginUser(@RequestBody LoginUserRequest request, HttpServletResponse response) {
        Optional<User> userOpt = userRepository.findByUsername(request.username());

        if (userOpt.isEmpty()) {
            Map<String, String> resposta = new HashMap<>();
            resposta.put("error", "Usuário não encontrado");
            return ResponseEntity.status(401).body(resposta);
        }

        User user = userOpt.get();

        if (user.getRole() != com.ikarus.auth_api.model.enums.Role.USER) {
            Map<String, String> resposta = new HashMap<>();
            resposta.put("error", "Perfil sem permissão de acesso");
            return ResponseEntity.status(403).body(resposta);
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            Map<String, String> resposta = new HashMap<>();
            resposta.put("error", "Senha incorreta");
            return ResponseEntity.status(401).body(resposta);
        }

        // Verifica e registra o dispositivo
        boolean autorizado = dispositivoService.validarOuRegistrar(request.username(), request.hostname(), request.uuid(), request.hashMaquina());
        if (!autorizado) {
            Map<String, String> resposta = new HashMap<>();
            resposta.put("error", "Dispositivo não autorizado, procure o administrador do sistema.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
        }

        if (user.isProvisionalPassword()) {

            String resetToken = jwtTokenProvider.generateToken(user.getUsername(), user.getRole());

            Cookie resetCookie = new Cookie("jwt_token", resetToken);
            resetCookie.setHttpOnly(true);
            resetCookie.setSecure(true); // true em produção
            resetCookie.setPath("/");
            resetCookie.setMaxAge(10 * 60); // 10 minutos

            //response.addCookie(resetCookie);
            response.setHeader(
                            "Set-Cookie",
                            String.format("jwt_token=%s; Max-Age=%d; Path=/; Secure; HttpOnly; SameSite=None",
                            resetToken, 10 * 60)
                                );

            Map<String, Object> body = new HashMap<>();
            body.put("message", "Direcionando para troca de senha");
            body.put("redirect", "change-password");
            body.put("token", resetToken);
            return ResponseEntity.ok(body);
        }

        // Gerar token JWT
        String token = jwtTokenProvider.generateToken(user.getUsername(), user.getRole());

        // Criar cookie HTTP Only
        Cookie cookie = new Cookie("jwt_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // true em produção com HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(30 * 60); // 30 minutos

        response.setHeader(
                "Set-Cookie",
                String.format("jwt_token=%s; Max-Age=%d; Path=/; Secure; HttpOnly; SameSite=None",
                token, 30 * 60)
        );

        // Retornar token no corpo JSON (para front Tauri)
        Map<String, Object> body = new HashMap<>();
        body.put("message", "Login efetuado com sucesso");
        body.put("token", token);

        return ResponseEntity.ok(body);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/logout-user")
    public ResponseEntity<?> logoutUser(HttpServletResponse response) {
        // Remove cookie JWT
        Cookie cookie = new Cookie("jwt_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        Map<String, String> body = new HashMap<>();
        body.put("message", "Logout efetuado com sucesso");
        return ResponseEntity.ok(body);
    }
    
}

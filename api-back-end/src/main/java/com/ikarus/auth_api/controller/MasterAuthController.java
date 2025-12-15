package com.ikarus.auth_api.controller;

import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.repository.UserRepository;
import com.ikarus.auth_api.security.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/login-master")
public class MasterAuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    record LoginRequest(String username, String password) {}

    @PostMapping("/login")
    public ResponseEntity<?> loginMaster(@RequestBody LoginRequest request, HttpServletResponse response) {
        Optional<User> userOpt = userRepository.findByUsername(request.username());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Usuário não encontrado");
        }

        User user = userOpt.get();

        if (user.getRole() != com.ikarus.auth_api.model.enums.Role.MASTER) {
            return ResponseEntity.status(403).body("Usuário sem permissão Master");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            return ResponseEntity.status(401).body("Senha incorreta");
        }

        // Gerar token JWT
        String token = jwtTokenProvider.generateToken(user.getUsername(), user.getRole());

        // Criar cookie HTTP Only
        Cookie cookie = new Cookie("jwt_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // em produção use HTTPS, senão pode desabilitar
        cookie.setPath("/");
        cookie.setMaxAge(30 * 60); // 30 minutos

        response.addCookie(cookie);

        return ResponseEntity.ok("Login Master efetuado com sucesso");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutMaster(HttpServletResponse response) {
        // Remove cookie JWT
        Cookie cookie = new Cookie("jwt_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok("Logout Master efetuado com sucesso");
    }
}

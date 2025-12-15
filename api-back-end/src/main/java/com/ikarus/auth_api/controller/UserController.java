package com.ikarus.auth_api.controller;

import com.ikarus.auth_api.dto.ResetSenhaDTO;
import com.ikarus.auth_api.dto.UserCadastroDTO.UserCadastroDTOFull;
import com.ikarus.auth_api.dto.UserPublicDTO.UserPublicSimple;
import com.ikarus.auth_api.dto.UserPublicDTO.UserPublicFull;
import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.model.enums.Role;
import com.ikarus.auth_api.service.UserService;
import jakarta.validation.constraints.NotNull;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/usuarios")
public class UserController {

    @Autowired
    private UserService userService;

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/me")
    public ResponseEntity<UserPublicSimple> me() {
        User userLogado = userService.getUsuarioAutenticado();
        UserPublicSimple user = userService.meProfile(userLogado.getUsername());
        return ResponseEntity.ok(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/criar-perfil-user")
    public ResponseEntity<?> criarPerfilUser(@RequestBody UserCadastroDTOFull userDto) {
        User adminLogado = userService.getUsuarioAutenticado();
        User createdUser = userService.createUser(userDto, adminLogado);
        return ResponseEntity.ok("Perfil de usuário criado com sucesso: " + createdUser.getUsername());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deletar-perfil-user/{id}")
    public ResponseEntity<?> deletePerfilUser(@PathVariable Long id) {
        User adminLogado = userService.getUsuarioAutenticado();
        userService.deleteUser(id, Role.USER, adminLogado);
        return ResponseEntity.ok("Perfil de usuário deletado com sucesso.");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/resetar-senha-user")
    public ResponseEntity<?> resetarSenhaUser(@RequestBody ResetSenhaDTO dto) {
        userService.resetarSenha(dto.getUsername());
        return ResponseEntity.ok("Senha provisória redefinida com sucesso.");
    }

    @PreAuthorize("hasAnyRole('MASTER', 'MANAGER', 'ADMIN')")
    @GetMapping("/listar-perfis")
    public ResponseEntity<List<UserPublicFull>> listarPerfisUsuario() {
        User adminLogado = userService.getUsuarioAutenticado();
        return ResponseEntity.ok(userService.listarPerfisUsuario(Role.USER, adminLogado));
    } 

    @PreAuthorize("hasAnyRole('MASTER', 'ADMIN')")
    @PostMapping("/atualizar/{id}")
    public ResponseEntity<?> atualizaUsuario(@PathVariable Long id, @RequestBody UserCadastroDTOFull usuarioAtualizado) {
        try {
            userService.atualizaUsuario(id, usuarioAtualizado);
            return ResponseEntity.ok("Usuário atualizado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DTO para o corpo da requisição de atribuição
    record AtribuicaoAdminRequest(@NotNull Long userId, @NotNull Long adminId) {}

    @PreAuthorize("hasAnyRole('MASTER', 'MANAGER')")
    @PostMapping("/atribuir-admin")
    public ResponseEntity<?> atribuirAdmin(@RequestBody AtribuicaoAdminRequest request) {
        try {
            User managerLogado = userService.getUsuarioAutenticado();
            userService.atribuirAdminParaUsuario(request.userId(), request.adminId(), managerLogado);
            return ResponseEntity.ok(Map.of("message", "Usuário atribuído ao administrador com sucesso."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DTO para o corpo da requisição de desatribuição
    record DesatribuicaoRequest(@NotNull Long userId) {}

    @PreAuthorize("hasAnyRole('MASTER', 'MANAGER')")
    @PostMapping("/desatribuir-admin")
    public ResponseEntity<?> desatribuirAdmin(@RequestBody DesatribuicaoRequest request) {
        try {
            User masterLogado = userService.getUsuarioAutenticado();
            userService.desatribuirAdminDeUsuario(request.userId(), masterLogado);
            return ResponseEntity.ok(Map.of("message", "Administrador desatribuído do usuário com sucesso."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


}

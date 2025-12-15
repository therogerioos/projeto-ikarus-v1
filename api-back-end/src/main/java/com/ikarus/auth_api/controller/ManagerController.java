package com.ikarus.auth_api.controller;

import com.ikarus.auth_api.dto.ResetSenhaDTO;
import com.ikarus.auth_api.dto.AdministradorDTO.AdministradorDTOFull;
import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.model.enums.Role;
import com.ikarus.auth_api.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/manager")
@PreAuthorize("hasAnyRole('MANAGER', 'MASTER')")
public class ManagerController {

    private final UserService userService;

    public ManagerController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/criar-admin")
    public ResponseEntity<?> criarAdministrador(@RequestBody AdministradorDTOFull dto) {
        try {
            User managerLogado = userService.getUsuarioAutenticado();
            userService.createAdmin(dto, managerLogado);
            return ResponseEntity.ok("Administrador criado com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/deletar-admin/{id}")
    public ResponseEntity<?> deletePerfilAdmin(@PathVariable Long id) {
        try {
            User gestorLogado = userService.getUsuarioAutenticado();
            userService.deleteUser(id, Role.ADMIN, gestorLogado);
            return ResponseEntity.ok("Perfil de administrador deletado com sucesso.");
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resetar-senha-admin")
    public ResponseEntity<?> resetarSenhaAdmin(@RequestBody ResetSenhaDTO dto) {
        // Adicionar lógica para garantir que o manager só pode resetar senhas de admins da sua org
        userService.resetarSenhaAdmin(dto.getUsername());
        return ResponseEntity.ok("Senha provisória redefinida com sucesso.");
    }

    // Endpoints para atualizar admin, atribuir/desatribuir usuários, etc., podem ser movidos/criados aqui.
}
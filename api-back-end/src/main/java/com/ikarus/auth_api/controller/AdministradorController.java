package com.ikarus.auth_api.controller;

import com.ikarus.auth_api.dto.AdministradorDTO.AdministradorDTOFull;
import com.ikarus.auth_api.dto.FolhaPontoDTO;
import com.ikarus.auth_api.dto.RegistroPontoDTOBuilder.RegistroPontoAdminDTO;
import com.ikarus.auth_api.dto.RegistroPontoDTOBuilder.RegistroPontoAusenteDTO;
import com.ikarus.auth_api.dto.UserPublicDTO.UserPublicAdmin;
import com.ikarus.auth_api.dto.UserPublicDTO.UserPublicIdName;
import com.ikarus.auth_api.dto.UserPublicDTO.UserPublicSimple;
import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.service.RegistroPontoService;
import com.ikarus.auth_api.service.UserService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/administradores")
public class AdministradorController {

    private final UserService userService; 
    private final RegistroPontoService registroPontoService;

    public AdministradorController(UserService userService, RegistroPontoService registroPontoService) {
        this.userService = userService;
        this.registroPontoService = registroPontoService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/me")
    public ResponseEntity<UserPublicAdmin> me() {
        User userLogado = userService.getUsuarioAutenticado();
        UserPublicAdmin user = userService.meProfileAdmin(userLogado.getUsername());
        return ResponseEntity.ok(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/funcionarios/logados")
    public ResponseEntity<List<UserPublicSimple>> getFuncionariosLogadosHoje(@AuthenticationPrincipal User userLogado) {
        LocalDate hoje = LocalDate.now();
        List<UserPublicSimple> result = userService.getFuncionariosLogadosHoje(userLogado, hoje);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/funcionarios/list-name-id")
    public ResponseEntity<List<UserPublicIdName>> getFuncionariosIdAndName(@AuthenticationPrincipal User adminLogado) {
        List<UserPublicIdName> result = userService.getFuncionariosIdAndName(adminLogado);
        return ResponseEntity.ok(result);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/funcionarios/folha-ponto/adicionar")
    public ResponseEntity<?> adicionarFolhaPontoFuncionario(
        @AuthenticationPrincipal User adminLogado,
        @RequestBody RegistroPontoAdminDTO dto) {
        try {
            registroPontoService.adicionarPontoFuncionario(adminLogado.getUsername(), dto);
            return ResponseEntity.ok(Map.of("message", "Ponto adicionado com sucesso."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/funcionarios/folha-ponto/adicionar-turno-ausente")
    public ResponseEntity<?> adicionarFolhaPontoAusenteFuncionario(
        @AuthenticationPrincipal User adminLogado,
        @RequestBody RegistroPontoAusenteDTO dto) {
        try {
            registroPontoService.adicionarPontoAusenteFuncionario(adminLogado.getUsername(), dto);
            return ResponseEntity.ok(Map.of("message", "Ponto de ausência adicionado com sucesso."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }

    }


    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/funcionarios/folha-ponto/atualizar/{id}")
    public ResponseEntity<?> atualizarFolhaPontoFuncionario(
        @AuthenticationPrincipal User adminLogado,
        @PathVariable Long id,
        @RequestBody RegistroPontoAdminDTO dto) {
        try {
            registroPontoService.patchPontoFuncionario(adminLogado.getUsername(), id, dto);
            return ResponseEntity.ok(Map.of("message", "Ponto atualizado com sucesso."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/funcionarios/folha-ponto/atualizar-ponto-ausente/{id}")
    public ResponseEntity<?> atualizarFolhaPontoAusenteFuncionario(
        @AuthenticationPrincipal User adminLogado,
        @PathVariable Long id,
        @RequestBody RegistroPontoAusenteDTO dto) {
        try {
            registroPontoService.patchPontoAusenteFuncionario(adminLogado.getUsername(), id, dto);
            return ResponseEntity.ok(Map.of("message", "Ponto atualizado com sucesso."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PreAuthorize("hasRole('MASTER')")
    @PostMapping("/atribuir-organizacao/{id}")
    public ResponseEntity<?> atribuirOrganizacao(@PathVariable Long id, @RequestBody AdministradorDTOFull dto) {
        try {
            userService.atribuirOrganizacaoAoAdmin(id, dto);
            return ResponseEntity.ok(Map.of("message", "Organização atribuída ao perfil administrador com sucesso"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/folha-ponto-user/{adminId}/{userId}/{mes}/{ano}")
    public ResponseEntity<?> getFolhaPontoUser(
        @PathVariable Long adminId,
        @PathVariable Long userId,
        @PathVariable int mes,
        @PathVariable int ano,
        Authentication authentication) {
        try {
            User userLogado = (User) authentication.getPrincipal();
            if (!userLogado.getId().equals(adminId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Funcionário não pertence a hierarquia do administrador solicitado.");
            }

            List<FolhaPontoDTO> folha = registroPontoService.buscarFolhaPonto(userId, mes, ano);
            return ResponseEntity.ok(folha);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

}

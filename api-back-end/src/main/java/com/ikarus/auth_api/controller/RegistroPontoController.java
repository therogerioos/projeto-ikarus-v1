package com.ikarus.auth_api.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.ikarus.auth_api.dto.FolhaPontoDTO;
import com.ikarus.auth_api.dto.RegistroPontoDTOBuilder.RegistroPontoDTO;
import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.service.RegistroPontoService;

@RestController
@PreAuthorize("hasRole('USER')")
@RequestMapping("/api/ponto")
public class RegistroPontoController {

    private final RegistroPontoService service;

    public RegistroPontoController(RegistroPontoService service) {
        this.service = service;
    }

    @PostMapping("/iniciar-turno")
    public ResponseEntity<?> iniciarTurno(@AuthenticationPrincipal User userLogado) {
        try {
            service.iniciarTurno(userLogado);
            Map<String, Object> body = new HashMap<>();
            body.put("message", "Início do turno realizado com sucesso!");
            return ResponseEntity.ok(body);
        } catch (IllegalStateException e) {
            return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(Collections.singletonMap("Erro:", e.getMessage()));
        }
    }

    @PostMapping("/iniciar-pausa")
    public ResponseEntity<?> iniciarPausa(@AuthenticationPrincipal User userLogado) {
        try {
            service.iniciarPausa(userLogado);
            Map<String, Object> body = new HashMap<>();
            body.put("message", "Início da pausa realizada com sucesso!");
            return ResponseEntity.ok(body);
        } catch (IllegalStateException e) {
            return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(Collections.singletonMap("Erro:", e.getMessage()));
        }
    }

    @PostMapping("/finalizar-pausa")
    public ResponseEntity<?> finalizarPausa(@AuthenticationPrincipal User userLogado) {
        try {
            service.finalizarPausa(userLogado);
            Map<String, Object> body = new HashMap<>();
            body.put("message", "Finalização da pausa realizada com sucesso!");
            return ResponseEntity.ok(body);
        } catch (Exception e) {
            return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(Collections.singletonMap("Erro:", e.getMessage()));
        }
    }

    @PostMapping("/finalizar-turno")
    public ResponseEntity<?> finalizarTurno(@AuthenticationPrincipal User userLogado) {
        try {
            service.finalizarTurno(userLogado);
            Map<String, Object> body = new HashMap<>();
            body.put("message", "Finalização do turno realizada com sucesso!");
            return ResponseEntity.ok(body);
        } catch (Exception e) {
            return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(Collections.singletonMap("Erro:", e.getMessage()));
        }
    }

    @GetMapping("/me-register")
    public ResponseEntity<List<RegistroPontoDTO>> meRegister(@AuthenticationPrincipal User userLogado) {
        RegistroPontoDTO registro = service.obterRegistroDoDiaAtual(userLogado);
        return ResponseEntity.ok(List.of(registro));
    }

    @GetMapping("/folha-ponto-user/{userId}/{mes}/{ano}")
    public ResponseEntity<?> getFolhaPonto(
        @PathVariable Long userId,
        @PathVariable int mes,
        @PathVariable int ano,
        Authentication authentication) {
        try {
            User userLogado = (User) authentication.getPrincipal();
            if (!userLogado.getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Perfil não pertence ao usuário solicitado");
            }

            List<FolhaPontoDTO> folha = service.buscarFolhaPonto(userId, mes, ano);
            return ResponseEntity.ok(folha);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

}


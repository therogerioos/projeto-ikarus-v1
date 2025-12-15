package com.ikarus.auth_api.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ikarus.auth_api.dto.EscalaDTO.EscalaPersonalizadaDTO;
import com.ikarus.auth_api.dto.EscalaDTO.EscalaSimplesDTO;
import com.ikarus.auth_api.service.EscalaService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/escalas")
public class EscalaController {

    @Autowired
    private EscalaService escalaService;

    @PostMapping("/criar-escala-simples")
    public ResponseEntity<?> criandoEscalaSimples(@RequestBody EscalaSimplesDTO escalaSimples) {
        try {
            escalaService.criarEscalaSimples(escalaSimples);
            Map<String, Object> body = new HashMap<>();
            body.put("message", "Escala simples criada com sucesso!");
            return ResponseEntity.ok(body);
        } catch (RuntimeException e) {
            Map<String, Object> body = new HashMap<>();
            body.put("error", "Erro ao criar escala simples.");
            return ResponseEntity.badRequest().body(body);
        }
    }

    @PostMapping("/criar-escala-personalizada")
    public ResponseEntity<?> criandoEscalaPersonalizada(@RequestBody EscalaPersonalizadaDTO escalaPersonal) {
         try {
            escalaService.criarEscalaPersonalizada(escalaPersonal);
            Map<String, Object> body = new HashMap<>();
            body.put("message", "Escala personalizada criada com sucesso!");
            return ResponseEntity.ok(body);
         } catch (RuntimeException e) {
            Map<String, Object> body = new HashMap<>();
            body.put("error", "Erro ao criar escala personalizada.");
            return ResponseEntity.badRequest().body(body);
         }
    }
    
    

}

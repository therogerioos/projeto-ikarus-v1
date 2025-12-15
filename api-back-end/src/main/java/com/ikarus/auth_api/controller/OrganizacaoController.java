package com.ikarus.auth_api.controller;

import com.ikarus.auth_api.dto.OrganizacaoDTO;
import com.ikarus.auth_api.model.Organizacao;
import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.model.enums.Role;
import com.ikarus.auth_api.service.OrganizacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/organizacoes")
public class OrganizacaoController {

    @Autowired
    private OrganizacaoService organizacaoService;

    @PreAuthorize("hasRole('MASTER')")
    @PostMapping("/criar-perfil")
    public ResponseEntity<?> criarOrganizacao(@RequestBody Organizacao organizacao) {
        try {
            Organizacao criada = organizacaoService.criarOrganizacao(organizacao);
            return ResponseEntity.ok("Organização criada com sucesso: " + criada.getNome());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('MASTER')")
    @GetMapping("/listar-perfis")
    public ResponseEntity<List<Organizacao>> listarOrganizacoes() {
        return ResponseEntity.ok(organizacaoService.listarOrganizacoes());
    }

    @PreAuthorize("hasAnyRole('MASTER', 'ADMIN')")
    @GetMapping("/buscar-perfil/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id, Authentication authentication) {
        try {
            User userLogado = (User) authentication.getPrincipal();

            if (!userLogado.getRole().equals(Role.MASTER) && 
                !userLogado.getOrganizacaoId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Perfil não pertence à organização solicitada");
            }

            Organizacao org = organizacaoService.buscarPorId(id);
            
            if (userLogado.getRole().equals(Role.MASTER)) {
                return ResponseEntity.ok(new OrganizacaoDTO.Full(org));
            } else if (userLogado.getRole().equals(Role.ADMIN)) {
                return ResponseEntity.ok(new OrganizacaoDTO.Simple(org));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sem permissão para visualizar dados da organização");
            }

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('MASTER')")
    @PostMapping("/atualizar/{id}")
    public ResponseEntity<?> atualizarOrganizacao(@PathVariable Long id, @RequestBody Organizacao orgAtualizada) {
        try {
            organizacaoService.atualizarOrganizacao(id, orgAtualizada);
            return ResponseEntity.ok("Organização atualizada com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('MASTER')")
    @PostMapping("/financeiro/{id}")
    public ResponseEntity<?> atualizarOrganizacaoFinanceiro(@PathVariable Long id, @RequestBody Organizacao orgAtualizada) {
        try {
            organizacaoService.atualizarOrganizacaoFinanceiro(id, orgAtualizada);
            return ResponseEntity.ok("Dados financeiros da organização atualizados com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('MASTER')")
    @PostMapping("/pausar/{id}")
    public ResponseEntity<?> pausarOrganizacao(@PathVariable Long id) {
        try {
            organizacaoService.pausarOrganizacao(id);
            return ResponseEntity.ok("Organização pausada com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('MASTER')")
    @PostMapping("/ativar/{id}")
    public ResponseEntity<?> ativarOrganizacao(@PathVariable Long id) {
        try {
            organizacaoService.ativarOrganizacao(id);
            return ResponseEntity.ok("Organização ativada com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}

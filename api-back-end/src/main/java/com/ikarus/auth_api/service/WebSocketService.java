package com.ikarus.auth_api.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ikarus.auth_api.model.RegistroPonto;
import com.ikarus.auth_api.model.User;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    private final UserService userService;

    public WebSocketService(SimpMessagingTemplate messagingTemplate, UserService userService) {
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
    }

    public User getProfileAdmin(User user) {
        return userService.buscarCadastroPorUserId(user.getId()).getAdmin();
    }

    public void enviarAtualizacaoPonto(User user, RegistroPonto registro) {
        // Constrói o payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", user.getId());
        payload.put("username", user.getUsername());
        payload.put("nome", user.getNome());
        payload.put("inicioTurno", registro.getInicioTurno());
        payload.put("fimTurno", registro.getFimTurno());
        payload.put("inicioPausa", registro.getInicioPausa());
        payload.put("fimPausa", registro.getFimPausa());
        
        // Verifica se o usuário tem um gerente atribuído
        User manager = getProfileAdmin(user);
        if (manager != null) {
            // Define o tópico de destino como um tópico privado para o ID do gerente
            String destination = "/topic/admin/" + manager.getId();
    
            System.out.println("Enviando atualização para: " + destination + " | Payload: " + payload);
            messagingTemplate.convertAndSend(destination, payload);
        }

        // Envia também para o tópico geral da organização (útil para MASTER ou visões gerais)
        if (user.getOrganizacaoId() != null) {
            String orgDestination = "/topic/organizacao/" + user.getOrganizacaoId();
            System.out.println("Enviando atualização para: " + orgDestination + " | Payload: " + payload);
            messagingTemplate.convertAndSend(orgDestination, payload);
        }
    }
}

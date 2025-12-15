package com.ikarus.auth_api.model;

import java.time.LocalDateTime;

import com.ikarus.auth_api.model.enums.StatusDispositivoEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "dispositivos")
public class Dispositivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "hostname")
    private String hostname;

    @Column(name = "uuid")
    private String uuid;

    @Column(name = "hash_maquina")
    private String hashMaquina;

    @Enumerated(EnumType.STRING)
    private StatusDispositivoEnum status;

    @Column(name = "justificativa")
    private String justificativa;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @PrePersist
    protected void onCreate() {
        this.criadoEm = LocalDateTime.now();
        this.atualizadoEm = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }
    
}

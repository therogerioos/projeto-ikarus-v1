package com.ikarus.auth_api.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.*;

import com.ikarus.auth_api.model.enums.StatusPonto;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "registro_ponto", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "data"})
})
public class RegistroPonto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data", nullable = false)
    private LocalDate data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "inicio_turno")
    private LocalDateTime inicioTurno;

    @Column(name = "inicio_pausa")
    private LocalDateTime inicioPausa;

    @Column(name = "fim_pausa")
    private LocalDateTime fimPausa;

    @Column(name = "fim_turno")
    private LocalDateTime fimTurno;

    @Enumerated(EnumType.STRING)
    private StatusPonto status = StatusPonto.APONTAMENTO;

    @Column(columnDefinition = "TEXT")
    private String justificativa;

    @Column(name = "criado_por_admin")
    private boolean criadoPorAdmin = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

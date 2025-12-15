package com.ikarus.auth_api.model;

import java.time.LocalTime;

import com.ikarus.auth_api.model.enums.StatusEscala;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "escala_simples")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EscalaSimples {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private StatusEscala statusDoModulo = StatusEscala.ATIVO;

    private LocalTime horaInicioTurno;
    private LocalTime horaFimTurno;
    private LocalTime horaInicioPausa;
    private LocalTime horaFimPausa;
    
}

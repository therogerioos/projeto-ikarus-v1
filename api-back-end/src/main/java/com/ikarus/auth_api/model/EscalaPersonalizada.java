package com.ikarus.auth_api.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ikarus.auth_api.model.enums.LegendaEscalaEnum;
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
@Table(name = "escala_personalizada")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EscalaPersonalizada {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private StatusEscala statusDoModulo = StatusEscala.ATIVO;

    private LegendaEscalaEnum legendaEscala;

    private LocalDate dataEscala;
    private LocalDateTime dataHoraInicioTurno;
    private LocalDateTime dataHoraFimTurno;
    private LocalDateTime dataHoraInicioPausa;
    private LocalDateTime dataHoraFimPausa;

}

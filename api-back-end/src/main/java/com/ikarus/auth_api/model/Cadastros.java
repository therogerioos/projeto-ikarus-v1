package com.ikarus.auth_api.model;

import java.time.LocalDate;
import java.time.LocalTime;

import com.ikarus.auth_api.model.enums.StatusCadastro;
import com.ikarus.auth_api.model.enums.TipoEscalaEnum;

import jakarta.persistence.*;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cadastros", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "username"})
})

public class Cadastros {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "funcao")
    private String funcao;

    @Column(name = "matricula")
    private String matricula;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(name = "data_admissao")
    private LocalDate dataAdmissao;

    @Column(name = "data_demissao")
    private LocalDate dataDemissao;

    @Column(name = "number_ctps")
    private String numberCtps;

    @Column(name = "serie_ctps")
    private String serieCtps;

    @Enumerated(EnumType.STRING)
    private StatusCadastro status;

    @Column(name = "flag_escala", nullable = false)
    private boolean flagEscala;

    @Column(name = "carga_horaria")
    private LocalTime cargaHoraria;

    @Column(name = "hora_inicio_turno")
    private LocalTime horaInicioTurno;

    @Column(name = "hora_fim_turno")
    private LocalTime horaFimTurno;

    @Column(name = "hora_inicio_pausa")
    private LocalTime horaInicioPausa;

    @Column(name = "hora_fim_pausa")
    private LocalTime horaFimPausa;

    @Column(name = "interjornada")
    private LocalTime interjornada;

    @Column(name = "limite_horas_extras")
    private LocalTime limiteHorasExtras;

    @Column(name = "tempo_pausa")
    private LocalTime tempoPausa;

    @Enumerated(EnumType.STRING)
    private TipoEscalaEnum tipoEscala;

    @ManyToOne
    @JoinColumn(name = "admin_id", referencedColumnName = "id")
    private User admin;

    @ManyToOne
    @JoinColumn(name = "manager_id", referencedColumnName = "id")
    private User manager;

    @ManyToOne
    @JoinColumn(name = "organizacao_id", referencedColumnName = "id")
    private Organizacao organizacao;
  
}

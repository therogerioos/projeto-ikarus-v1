package com.ikarus.auth_api.model;

import com.ikarus.auth_api.model.enums.PlanoEnum;
import com.ikarus.auth_api.model.enums.StatusPagamentoEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "organizacoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanoEnum plano;

    @Column(name = "limite_usuarios", nullable = false)
    private int limiteUsuarios;

    @Column(name = "limite_administradores", nullable = false)
    private int limiteAdministradores;

    @Builder.Default
    @Column(nullable = false)
    private boolean ativo = true;

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "data_ultimo_pagamento")
    private LocalDateTime dataUltimoPagamento;

    @Column(name = "data_proxima_cobranca")
    private LocalDateTime dataProximaCobranca;

    @Enumerated(EnumType.STRING)
    private StatusPagamentoEnum statusPagamento;

    @Column(name = "org_pausada_por_inadimplencia", nullable = false)
    private boolean orgPausadaPorInadimplencia;

    @Column(name = "email_financeiro")
    private String emailFinanceiro;

    // ✅ Método utilitário para validação de status da organização
    public boolean isOrganizacaoAtivaEAdimplente() {
        return ativo &&
               !orgPausadaPorInadimplencia &&
               statusPagamento == StatusPagamentoEnum.PAGO;
    }
}

package com.ikarus.auth_api.dto;

import com.ikarus.auth_api.model.Organizacao;
import com.ikarus.auth_api.model.enums.PlanoEnum;
import com.ikarus.auth_api.model.enums.StatusPagamentoEnum;
import java.time.LocalDateTime;

public class OrganizacaoDTO {

    public static class Full {
        private Long id;
        private String nome;
        private PlanoEnum plano;
        private int limiteUsuarios;
        private int limiteAdministradores;
        private boolean ativo;
        private LocalDateTime dataCriacao;
        private LocalDateTime dataUltimoPagamento;
        private LocalDateTime dataProximaCobranca;
        private StatusPagamentoEnum statusPagamento;
        private boolean orgPausadaPorInadimplencia;
        private String emailFinanceiro;

        public Full() {}

        public Full(Organizacao org) {
            this.id = org.getId();
            this.nome = org.getNome();
            this.plano = org.getPlano();
            this.limiteUsuarios = org.getLimiteUsuarios();
            this.limiteAdministradores = org.getLimiteAdministradores();
            this.ativo = org.isAtivo();
            this.dataCriacao = org.getDataCriacao();
            this.dataUltimoPagamento = org.getDataUltimoPagamento();
            this.dataProximaCobranca = org.getDataProximaCobranca();
            this.statusPagamento = org.getStatusPagamento();
            this.orgPausadaPorInadimplencia = org.isOrgPausadaPorInadimplencia();
            this.emailFinanceiro = org.getEmailFinanceiro();
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }

        public PlanoEnum getPlano() { return plano; }
        public void setPlano(PlanoEnum plano) { this.plano = plano; }

        public int getLimiteUsuarios() { return limiteUsuarios; }
        public void setLimiteUsuarios(int limiteUsuarios) { this.limiteUsuarios = limiteUsuarios; }

        public int getLimiteAdministradores() { return limiteAdministradores; }
        public void setLimiteAdministradores(int limiteAdministradores) { this.limiteAdministradores = limiteAdministradores; }

        public boolean isAtivo() { return ativo; }
        public void setAtivo(boolean ativo) { this.ativo = ativo; }

        public LocalDateTime getDataCriacao() { return dataCriacao; }
        public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

        public LocalDateTime getDataUltimoPagamento() { return dataUltimoPagamento; }
        public void setDataUltimoPagamento(LocalDateTime dataUltimoPagamento) { this.dataUltimoPagamento = dataUltimoPagamento; }

        public LocalDateTime getDataProximaCobranca() { return dataProximaCobranca; }
        public void setDataProximaCobranca(LocalDateTime dataProximaCobranca) { this.dataProximaCobranca = dataProximaCobranca; }

        public StatusPagamentoEnum getStatusPagamento() { return statusPagamento; }
        public void setStatusPagamento(StatusPagamentoEnum statusPagamento) { this.statusPagamento = statusPagamento; }

        public boolean isOrgPausadaPorInadimplencia() { return orgPausadaPorInadimplencia; }
        public void setOrgPausadaPorInadimplencia(boolean orgPausadaPorInadimplencia) { this.orgPausadaPorInadimplencia = orgPausadaPorInadimplencia; }

        public String getEmailFinanceiro() { return emailFinanceiro; }
        public void setEmailFinanceiro(String emailFinanceiro) { this.emailFinanceiro = emailFinanceiro; }
    }

    public static class Simple {
        private Long id;
        private String nome;

        public Simple() {}

        public Simple(Organizacao org) {
            this.id = org.getId();
            this.nome = org.getNome();
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
    }
}

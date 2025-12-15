package com.ikarus.auth_api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.ikarus.auth_api.model.enums.StatusCadastro;
import com.ikarus.auth_api.model.enums.TipoEscalaEnum;

public class UserPublicDTO {
    public static class UserPublicFull {
            private Long id;
            private String matricula;
            private String username;
            private String nome;
            private String role;
            private String funcao;
            private StatusCadastro status;
            private Long organizacaoId;
            private boolean provisionalPassword;
            private String temporaryPassword;
            private boolean flagEscala;
            private TipoEscalaEnum tipoEscala;
            private LocalDate dataNascimento;
            private LocalDate dataAdmissao;
            private LocalDate dataDemissao;
            private String numberCtps;
            private String serieCtps;
            private LocalTime interjornada;
            private LocalTime limiteHorasExtras;
            private LocalTime tempoPausa;
            private LocalTime cargaHoraria;
            private LocalTime horaInicioTurno;
            private LocalTime horaFimTurno;
            private LocalTime horaInicioPausa;
            private LocalTime horaFimPausa;
            private String organizacaoNome;

            // Construtores
            public UserPublicFull() {}

            public UserPublicFull(Long id, String matricula, String username, String nome, String role, String funcao, StatusCadastro status, Long organizacaoId, boolean provisionalPassword, String temporaryPassword, boolean flagEscala, TipoEscalaEnum tipoEscala, LocalDate dataNascimento, LocalDate dataAdmissao, LocalDate dataDemissao, String numberCtps, String serieCtps, LocalTime interjornada, LocalTime limiteHorasExtras, LocalTime tempoPausa, LocalTime cargaHoraria, LocalTime horaInicioTurno, LocalTime horaFimTurno, LocalTime horaInicioPausa, LocalTime horaFimPausa, String organizacaoNome) {
                this.id = id;
                this.matricula = matricula;
                this.username = username;
                this.nome = nome;
                this.role = role;
                this.funcao = funcao;
                this.status = status;
                this.organizacaoId = organizacaoId;
                this.provisionalPassword = provisionalPassword;
                this.temporaryPassword = temporaryPassword;
                this.flagEscala = flagEscala;
                this.tipoEscala = tipoEscala;
                this.dataNascimento = dataNascimento;
                this.dataAdmissao = dataAdmissao;
                this.dataDemissao = dataDemissao;
                this.numberCtps = numberCtps;
                this.serieCtps = serieCtps;
                this.interjornada = interjornada;
                this.limiteHorasExtras = limiteHorasExtras;
                this.tempoPausa = tempoPausa;
                this.cargaHoraria = cargaHoraria;
                this.horaInicioTurno = horaInicioTurno;
                this.horaFimTurno = horaFimTurno;
                this.horaInicioPausa = horaInicioPausa;
                this.horaFimPausa = horaFimPausa;
                this.organizacaoNome = organizacaoNome;
            }

            // Getters e Setters

            public Long getId() {
                return id;
            }

            public void setId(Long id) {
                this.id = id;
            }

            public String getMatricula() {
                return matricula;
            }

            public void setMatricula(String matricula) {
                this.matricula = matricula;
            }


            public String getUsername() {
                return username;
            }

            public void setUsername(String username) {
                this.username = username;
            }

            public String getNome() {
                return nome;
            }

            public void setNome(String nome) {
                this.nome = nome;
            }

            public String getRole() {
                return role;
            }

            public void setRole(String role) {
                this.role = role;
            }

            public String getFuncao() {
                return funcao;
            }

            public void setFuncao(String funcao) {
                this.funcao = funcao;
            }

            public StatusCadastro getStatus() {
                return status;
            }

            public void setStatus(StatusCadastro status) {
                this.status = status;
            }

            public Long getOrganizacaoId() {
                return organizacaoId;
            }

            public void setOrganizacaoId(Long organizacaoId) {
                this.organizacaoId = organizacaoId;
            }

            public boolean isProvisionalPassword() {
                return provisionalPassword;
            }

            public void setProvisionalPassword(boolean provisionalPassword) {
                this.provisionalPassword = provisionalPassword;
            }

            public String getTemporaryPassword() {
                return temporaryPassword;
            }

            public void setTemporaryPassword(String temporaryPassword) {
                this.temporaryPassword = temporaryPassword;
            }

            public boolean isFlagEscala() {
                return flagEscala;
            }

            public void setFlagEscala(boolean flagEscala) {
                this.flagEscala = flagEscala;
            }

            public TipoEscalaEnum getTipoEscala() {
                return tipoEscala;
            }

            public void setTipoEscala(TipoEscalaEnum tipoEscala) {
                this.tipoEscala = tipoEscala;
            }

            public LocalDate getDataNascimento() {
                return dataNascimento;
            }

            public void setDataNascimento(LocalDate dataNascimento) {
                this.dataNascimento = dataNascimento;
            }

            public LocalDate getDataAdmissao() {
                return dataAdmissao;
            }

            public void setDataAdmissao(LocalDate dataAdmissao) {
                this.dataAdmissao = dataAdmissao;
            }

            public LocalDate getDataDemissao() {
                return dataDemissao;
            }

            public void setDataDemissao(LocalDate dataDemissao) {
                this.dataDemissao = dataDemissao;
            }

            public String getNumberCtps() {
                return numberCtps;
            }

            public void setNumberCtps(String numberCtps) {
                this.numberCtps = numberCtps;
            }

            public String getSerieCtps() {
                return serieCtps;
            }

            public void setSerieCtps(String serieCtps) {
                this.serieCtps = serieCtps;
            }

            public LocalTime getHoraInicioTurno() {
                return horaInicioTurno;
            }

            public void setHoraInicioTurno(LocalTime horaInicioTurno) {
                this.horaInicioTurno = horaInicioTurno;
            }

            public LocalTime getHoraFimTurno() {
                return horaFimTurno;
            }

            public void setHoraFimTurno(LocalTime horaFimTurno) {
                this.horaFimTurno = horaFimTurno;
            }

            public LocalTime getHoraInicioPausa() {
                return horaInicioPausa;
            }

            public void setHoraInicioPausa(LocalTime horaInicioPausa) {
                this.horaInicioPausa = horaInicioPausa;
            }

            public LocalTime getHoraFimPausa() {
                return horaFimPausa;
            }

            public void setHoraFimPausa(LocalTime horaFimPausa) {
                this.horaFimPausa = horaFimPausa;
            }

            public LocalTime getCargaHoraria() {
                return cargaHoraria;
            }

            public void setCargaHoraria(LocalTime cargaHoraria) {
                this.cargaHoraria = cargaHoraria;
            }

            public LocalTime getTempoPausa() {
                return tempoPausa;
            }

            public void setTempoPausa(LocalTime tempoPausa) {
                this.tempoPausa = tempoPausa;
            }

            public LocalTime getInterjornada() {
                return interjornada;
            }

            public void setInterjornada(LocalTime interjornada) {
                this.interjornada = interjornada;
            }

            public LocalTime getLimiteHorasExtras() {
                return limiteHorasExtras;
            }

            public void setLimiteHorasExtras(LocalTime limiteHorasExtras) {
                this.limiteHorasExtras = limiteHorasExtras;
            }

            public String getOrganizacaoNome() {
                return organizacaoNome; 
            }

            public void setOrganizacaoNome(String organizacaoNome) { 
                this.organizacaoNome = organizacaoNome; 
            }

    }

    public static class UserPublicSimple {
            private Long id;
            private String username;
            private String nome;
            private String role;
            private StatusCadastro status;
            private LocalDateTime horaInicioTurno;
            private LocalDateTime horaFimTurno;
            private LocalDateTime horaInicioPausa;
            private LocalDateTime horaFimPausa;

            // Construtores
            public UserPublicSimple() {}

            public UserPublicSimple(Long id, String username, String nome, String role, StatusCadastro status, LocalDateTime horaInicioTurno, LocalDateTime horaFimTurno, LocalDateTime horaInicioPausa, LocalDateTime horaFimPausa) {
                this.id = id;
                this.username = username;
                this.nome = nome;
                this.role = role;
                this.status = status;
                this.horaInicioTurno = horaInicioTurno;
                this.horaFimTurno = horaFimTurno;
                this.horaInicioPausa = horaInicioPausa;
                this.horaFimPausa = horaFimPausa;
            }

            // Getters e Setters

            public Long getId() {
                return id;
            }

            public void setId(Long id) {
                this.id = id;
            }

            public String getUsername() {
                return username;
            }

            public void setUsername(String username) {
                this.username = username;
            }

            public String getNome() {
                return nome;
            }

            public void setNome(String nome) {
                this.nome = nome;
            }

            public String getRole() {
                return role;
            }

            public void setRole(String role) {
                this.role = role;
            }

            public StatusCadastro getStatus() {
                return status;
            }

            public void setStatus(StatusCadastro status) {
                this.status = status;
            }

            public LocalDateTime getHoraInicioTurno() {
                return horaInicioTurno;
            }

            public void setHoraInicioTurno(LocalDateTime horaInicioTurno) {
                this.horaInicioTurno = horaInicioTurno;
            }

            public LocalDateTime getHoraFimTurno() {
                return horaFimTurno;
            }

            public void setHoraFimTurno(LocalDateTime horaFimTurno) {
                this.horaFimTurno = horaFimTurno;
            }

            public LocalDateTime getHoraInicioPausa() {
                return horaInicioPausa;
            }

            public void setHoraInicioPausa(LocalDateTime horaInicioPausa) {
                this.horaInicioPausa = horaInicioPausa;
            }

            public LocalDateTime getHoraFimPausa() {
                return horaFimPausa;
            }

            public void setHoraFimPausa(LocalDateTime horaFimPausa) {
                this.horaFimPausa = horaFimPausa;
            }

    }

    public static class UserPublicIdName {
            private Long id;
            private String nome;

            // Construtores
            public UserPublicIdName() {}

            public UserPublicIdName(Long id, String nome) {
                this.id = id;
                this.nome = nome;
            }

            // Getters e Setters

            public Long getId() {
                return id;
            }

            public void setId(Long id) {
                this.id = id;
            }

            public String getNome() {
                return nome;
            }

            public void setNome(String nome) {
                this.nome = nome;
            }

    }

    public static class UserPublicAdmin {
            private Long id;
            private String username;
            private Long organizacaoId;
            private String nome;
            private String role;
            private StatusCadastro status;
            private Long admin;
            private Long manager;
            private String mensagem;

            // Construtores
            public UserPublicAdmin() {}

            public UserPublicAdmin(Long id, String username, Long organizacaoId, String nome, String role, StatusCadastro status, Long admin, Long manager, String mensagem) {
                this.id = id;
                this.username = username;
                this.organizacaoId = organizacaoId;
                this.nome = nome;
                this.role = role;
                this.status = status;
                this.admin = admin;
                this.manager = manager;
                this.mensagem = mensagem;
            }

            // Getters e Setters

            public Long getId() {
                return id;
            }

            public void setId(Long id) {
                this.id = id;
            }

            public String getUsername() {
                return username;
            }

            public void setUsername(String username) {
                this.username = username;
            }
            
            public Long getOrganizacaoId() {
                return organizacaoId;
            }

            public void setOrganizacaoId(Long organizacaoId) {
                this.organizacaoId = organizacaoId;
            }

            public String getNome() {
                return nome;
            }

            public void setNome(String nome) {
                this.nome = nome;
            }

            public String getRole() {
                return role;
            }

            public void setRole(String role) {
                this.role = role;
            }

            public StatusCadastro getStatus() {
                return status;
            }

            public void setStatus(StatusCadastro status) {
                this.status = status;
            }

            public Long getAdmin() {
                return admin;
            }

            public void setAdmin(Long admin) {
                this.admin = admin;
            }

            public Long getManager() {
                return manager;
            }

            public void setManager(Long manager) {
                this.manager = manager;
            }

            public String getMensagem() {
                return mensagem;
            }

            public void setMensagem(String mensagem) {
                this.mensagem = mensagem;
            }

    }    


}


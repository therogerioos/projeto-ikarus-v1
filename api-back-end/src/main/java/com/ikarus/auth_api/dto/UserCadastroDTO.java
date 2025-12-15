package com.ikarus.auth_api.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.ikarus.auth_api.model.enums.Role;
import com.ikarus.auth_api.model.enums.StatusCadastro;
import com.ikarus.auth_api.model.enums.StatusUsuario;
import com.ikarus.auth_api.model.enums.TipoEscalaEnum;

public class UserCadastroDTO {
    public static class UserCadastroDTOFull {
        private Long id;
        private String username;
        private String nome;
        private StatusUsuario statusUser;
        private StatusCadastro statusCadastro;
        private Long organizacaoId;
        private Role role;
        private boolean provisionalPassword;
        private String temporaryPassword;
        private String funcao;
        private String matricula;
        private LocalDate dataNascimento;
        private LocalDate dataAdmissao;
        private LocalDate dataDemissao;
        private String numberCtps;
        private String serieCtps;
        private boolean flagEscala;
        private TipoEscalaEnum tipoEscala;
        private LocalTime cargaHoraria;
        private LocalTime tempoPausa;
        private LocalTime interjornada;
        private LocalTime limiteHorasExtras;
        private LocalTime horaInicioTurno;
        private LocalTime horaFimTurno;
        private LocalTime horaInicioPausa;
        private LocalTime horaFimPausa;
        private Long adminId;
        private Long managerId;

        public UserCadastroDTOFull() {}

        public UserCadastroDTOFull(Long id, String username, String name, StatusUsuario statusUser, StatusCadastro statusCadastro, Long organizacaoId, Role role, boolean provisionalPassword, String temporaryPassword, String funcao, String matricula, LocalDate dataNascimento, LocalDate dataAdmissao, LocalDate dataDemissao, String numberCtps, String serieCtps, boolean flagEscala, TipoEscalaEnum tipoEscala, LocalTime cargaHoraria, LocalTime tempoPausa, LocalTime interjornada, LocalTime limiteHorasExtras, LocalTime horaInicioTurno, LocalTime horaFimTurno, LocalTime horaInicioPausa, LocalTime horaFimPausa, Long adminId, Long managerId) {
            this.id = id;
            this.username = username;
            this.nome = name;
            this.statusUser = statusUser;
            this.statusCadastro = statusCadastro;
            this.organizacaoId = organizacaoId;
            this.role = role;
            this.provisionalPassword = provisionalPassword;
            this.temporaryPassword = temporaryPassword;
            this.funcao = funcao;
            this.matricula = matricula;
            this.dataNascimento = dataNascimento;
            this.dataAdmissao = dataAdmissao;
            this.dataDemissao = dataDemissao;
            this.numberCtps = numberCtps;
            this.serieCtps = serieCtps;
            this.flagEscala = flagEscala;
            this.tipoEscala = tipoEscala;
            this.cargaHoraria = cargaHoraria;
            this.tempoPausa = tempoPausa;
            this.interjornada = interjornada;
            this.limiteHorasExtras = limiteHorasExtras;
            this.horaInicioTurno = horaInicioTurno;
            this.horaFimTurno = horaFimTurno;
            this.horaInicioPausa = horaInicioPausa;
            this.horaFimPausa = horaFimPausa;
            this.adminId = adminId;
            this.managerId = managerId;
        }

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

        public StatusUsuario getStatusUser() {
            return statusUser;
        }

        public void setStatusUser(StatusUsuario statusUser) {
            this.statusUser = statusUser;
        }

        public StatusCadastro getStatusCadastro() {
            return statusCadastro;
        }

        public void setStatusCadastro(StatusCadastro statusCadastro) {
            this.statusCadastro = statusCadastro;
        }

        public Long getOrganizacaoId() {
            return organizacaoId;
        }

        public void setOrganizacaoId(Long organizacaoId) {
            this.organizacaoId = organizacaoId;
        }

        public Role getRole() {
            return role;
        }

        public void setRole(Role role) {
            this.role = role;
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

        public String getFuncao() {
            return funcao;
        }

        public void setFuncao(String funcao) {
            this.funcao = funcao;
        }

        public String getMatricula() {
            return matricula;
        }

        public void setMatricula(String matricula) {
            this.matricula = matricula;
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

        public Long getAdminId() {
            return adminId;
        }

        public void setAdminId(Long adminId) {
            this.adminId = adminId;
        }

        public Long getManagerId() {
            return managerId;
        }

        public void setManagerId(Long managerId) {
            this.managerId = managerId;
        }

    }
    
}

package com.ikarus.auth_api.dto;

import com.ikarus.auth_api.model.Cadastros;
import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.model.enums.TipoEscalaEnum;

public class AdministradorDTO {
    public static class AdministradorDTOFull {
        private String username;
        private String nome;
        private String status;
        private Long organizacaoId;
        private boolean flagEscala;
        private TipoEscalaEnum tipoEscala;
        private Long adminId;
        private Long managerId;

        public AdministradorDTOFull() {}

        public AdministradorDTOFull(User user, Cadastros cadastro) {
            this.username = user.getUsername();
            this.nome = user.getNome();
            this.status = user.getStatus().name(); // ou .toString()
            this.organizacaoId = (user.getOrganizacao() != null) ? user.getOrganizacao().getId() : null;
            this.flagEscala = cadastro.isFlagEscala();
            this.tipoEscala = cadastro.getTipoEscala();
            this.adminId = cadastro.getAdmin().getId();
            this.managerId = cadastro.getManager().getId();
        }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome;}

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Long getOrganizacaoId() { return organizacaoId; }
        public void setOrganizacaoId(Long organizacaoId) { this.organizacaoId = organizacaoId; }

        public boolean isFlagEscala() { return flagEscala; }
        public void setFlagEscala(boolean flagEscala) { this.flagEscala = flagEscala; }

        public TipoEscalaEnum getTipoEscala() { return tipoEscala; }
        public void setTipoEscala(TipoEscalaEnum tipoEscala) { this.tipoEscala = tipoEscala; }

        public Long getAdminId() { return adminId; }
        public void setAdminId(Long adminId) { this.adminId = adminId; }

        public Long getManagerId() { return managerId; }
        public void setManagerId(Long managerId) { this.managerId = managerId; }
    }

    public static class AdministradorDTOSimple {
        private String username;
        private String nome;
        private String status;
        private Long organizacaoId;


        public AdministradorDTOSimple() {}

        public AdministradorDTOSimple(User user) {
            this.username = user.getUsername();
            this.nome = user.getNome();
            this.status = user.getStatus().name();
            this.organizacaoId = (user.getOrganizacao() != null) ? user.getOrganizacao().getId() : null;
        }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Long getOrganizacaoId() { return organizacaoId; }
        public void setOrganizacaoId(Long organizacaoId) { this.organizacaoId = organizacaoId; }
    }
}

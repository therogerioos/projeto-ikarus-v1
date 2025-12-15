package com.ikarus.auth_api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ikarus.auth_api.model.enums.StatusPonto;

public class RegistroPontoDTOBuilder {

    public static class RegistroPontoDTO {
        private LocalDateTime inicioTurno;
        private LocalDateTime inicioPausa;
        private LocalDateTime fimPausa;
        private LocalDateTime fimTurno;

        public RegistroPontoDTO() {}

        public RegistroPontoDTO(LocalDateTime inicioTurno, LocalDateTime inicioPausa, LocalDateTime fimPausa, LocalDateTime fimTurno) {
            this.inicioTurno = inicioTurno;
            this.inicioPausa = inicioPausa;
            this.fimPausa = fimPausa;
            this.fimTurno = fimTurno;
        }

        // getters e setters
        public LocalDateTime getInicioTurno() { 
            return inicioTurno; 
        }

        public void setInicioTurno(LocalDateTime inicioTurno) { 
            this.inicioTurno = inicioTurno; 
        }

        public LocalDateTime getInicioPausa() { 
            return inicioPausa; 
        }

        public void setInicioPausa(LocalDateTime inicioPausa) { 
            this.inicioPausa = inicioPausa; 
        }

        public LocalDateTime getFimPausa() { 
            return fimPausa; 
        }

        public void setFimPausa(LocalDateTime fimPausa) { 
            this.fimPausa = fimPausa; 
        }

        public LocalDateTime getFimTurno() { 
            return fimTurno; 
        }

        public void setFimTurno(LocalDateTime fimTurno) { 
            this.fimTurno = fimTurno; 
        }

    }


    public static class RegistroPontoAdminDTO {
        private Long userId;
        private LocalDate data;
        private LocalDateTime inicioTurno;
        private LocalDateTime fimTurno;
        private LocalDateTime inicioPausa;
        private LocalDateTime fimPausa;
        private StatusPonto status;

        public RegistroPontoAdminDTO() {}

        public RegistroPontoAdminDTO(Long userId, LocalDate data, LocalDateTime inicioTurno, LocalDateTime fimTurno, LocalDateTime inicioPausa, LocalDateTime fimPausa, StatusPonto status) {
            this.userId = userId;
            this.data = data;
            this.inicioTurno = inicioTurno;
            this.fimTurno = fimTurno;
            this.inicioPausa = inicioPausa;
            this.fimPausa = fimPausa;
            this.status = status;
        }

        // getters e setters
        public Long getUserId() { 
            return userId; 
        }

        public void setUserId(Long userId) { 
            this.userId = userId; 
        }

        public LocalDate getData() { 
            return data; 
        }

        public void setData(LocalDate data) { 
            this.data = data; 
        }

        public LocalDateTime getInicioTurno() { 
            return inicioTurno; 
        }

        public void setInicioTurno(LocalDateTime inicioTurno) { 
            this.inicioTurno = inicioTurno; 
        }

        public LocalDateTime getFimTurno() { 
            return fimTurno; 
        }

        public void setFimTurno(LocalDateTime fimTurno) { 
            this.fimTurno = fimTurno; 
        }

        public LocalDateTime getInicioPausa() { 
            return inicioPausa; 
        }

        public void setInicioPausa(LocalDateTime inicioPausa) { 
            this.inicioPausa = inicioPausa; 
        }

        public LocalDateTime getFimPausa() { 
            return fimPausa; 
        }

        public void setFimPausa(LocalDateTime fimPausa) { 
            this.fimPausa = fimPausa; 
        }

        public StatusPonto getStatus() { 
            return status; 
        }

        public void setStatus(StatusPonto status) { 
            this.status = status; 
        }
    }

    public static class RegistroPontoAusenteDTO {
        private Long userId;
        private LocalDate data;
        private StatusPonto status;

        public RegistroPontoAusenteDTO() {}

        public RegistroPontoAusenteDTO(Long userId, LocalDate data, StatusPonto status) {
            this.userId = userId;
            this.data = data;
            this.status = status;
        }

        // getters e setters
        public Long getUserId() { 
            return userId; 
        }

        public void setUserId(Long userId) { 
            this.userId = userId; 
        }

        public LocalDate getData() { 
            return data; 
        }

        public void setData(LocalDate data) { 
            this.data = data; 
        }

        public StatusPonto getStatus() { 
            return status; 
        }

        public void setStatus(StatusPonto status) { 
            this.status = status; 
        }
    }


}

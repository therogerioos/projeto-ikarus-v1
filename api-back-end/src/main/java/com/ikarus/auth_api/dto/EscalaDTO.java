package com.ikarus.auth_api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.ikarus.auth_api.model.EscalaPersonalizada;
import com.ikarus.auth_api.model.EscalaSimples;
import com.ikarus.auth_api.model.enums.LegendaEscalaEnum;
import com.ikarus.auth_api.model.enums.StatusEscala;

public class EscalaDTO {

    public static class EscalaSimplesDTO {

        private Long id;
        private Long userId;
        private StatusEscala statusDoModulo;
        private LocalTime horaInicioTurno;
        private LocalTime horaFimTurno;
        private LocalTime horaInicioPausa;
        private LocalTime horaFimPausa;

        public EscalaSimplesDTO() {}

        public EscalaSimplesDTO(EscalaSimples simples) {
            this.id = simples.getId();
            this.userId = simples.getUser().getId();
            this.statusDoModulo = simples.getStatusDoModulo();
            this.horaInicioTurno = simples.getHoraInicioTurno();
            this.horaFimTurno = simples.getHoraFimTurno();
            this.horaInicioPausa = simples.getHoraInicioPausa();
            this.horaFimPausa = simples.getHoraFimPausa();
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public StatusEscala getStatusDoModulo() {
            return statusDoModulo;
        }

        public void setStatusDoModulo(StatusEscala statusDoModulo) {
            this.statusDoModulo = statusDoModulo;
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

    }

    public static class EscalaPersonalizadaDTO {

        private Long id;
        private Long userId;
        private StatusEscala statusDoModulo;
        private LocalDate dataEscala;
        private LegendaEscalaEnum legendaEscala;
        private LocalDateTime dataHoraInicioTurno;
        private LocalDateTime dataHoraFimTurno;
        private LocalDateTime dataHoraInicioPausa;
        private LocalDateTime dataHoraFimPausa;

        public EscalaPersonalizadaDTO() {}

        public EscalaPersonalizadaDTO(EscalaPersonalizada personal) {
            this.id = personal.getId();
            this.userId = personal.getUser().getId();
            this.statusDoModulo = personal.getStatusDoModulo();
            this.dataEscala = personal.getDataEscala();
            this.legendaEscala = personal.getLegendaEscala();
            this.dataHoraInicioTurno = personal.getDataHoraInicioTurno();
            this.dataHoraFimTurno = personal.getDataHoraFimTurno();
            this.dataHoraInicioPausa = personal.getDataHoraInicioPausa();
            this.dataHoraFimPausa = personal.getDataHoraFimPausa();
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public StatusEscala getStatusEscala() {
            return statusDoModulo;
        }

        public void setStatusEscala(StatusEscala statusDoModulo) {
            this.statusDoModulo = statusDoModulo;
        }

        public LocalDate getDataEscala() {
            return dataEscala;
        }

        public void setDataEscala(LocalDate dataEscala) {
            this.dataEscala = dataEscala;
        }

        public LegendaEscalaEnum getLegendaEscala() {
            return legendaEscala;
        }

        public void setLegendaEscala(LegendaEscalaEnum legendaEscala) {
            this.legendaEscala = legendaEscala;
        }

        public LocalDateTime getDataHoraInicioTurno() {
            return dataHoraInicioTurno;
        }

        public void setDataHoraInicioTurno(LocalDateTime dataHoraInicioTurno) {
            this.dataHoraInicioTurno = dataHoraInicioTurno;
        }

        public LocalDateTime getDataHoraFimTurno() {
            return dataHoraFimTurno;
        }

        public void setDataHoraFimTurno(LocalDateTime dataHoraFimTurno) {
            this.dataHoraFimTurno = dataHoraFimTurno;
        }

        public LocalDateTime getDataHoraInicioPausa() {
            return dataHoraInicioPausa;
        }

        public void setDataHoraInicioPausa(LocalDateTime dataHoraInicioPausa) {
            this.dataHoraInicioPausa = dataHoraInicioPausa;
        }

        public LocalDateTime getDataHoraFimPausa() {
            return dataHoraFimPausa;
        }

        public void setDataHoraFimPausa(LocalDateTime dataHoraFimPausa) {
            this.dataHoraFimPausa = dataHoraFimPausa;
        }

    }
    
}

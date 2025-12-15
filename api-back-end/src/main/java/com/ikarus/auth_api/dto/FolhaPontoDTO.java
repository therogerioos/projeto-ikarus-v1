package com.ikarus.auth_api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class FolhaPontoDTO {

    // atributos
    private Long id;
    private LocalDate data;
    private LocalDateTime inicioTurno;
    private LocalDateTime inicioPausa;
    private LocalDateTime fimPausa;
    private LocalDateTime fimTurno;
    private String status;
    private String justificativa;
    private Long tempoLogado;
    private Long tempoPausa;
    private Long atraso;
    private Long horaExtra;

    // construtores

    public FolhaPontoDTO() {}

    public FolhaPontoDTO(Long id, LocalDate data, LocalDateTime inicioTurno, LocalDateTime inicioPausa, LocalDateTime fimPausa, LocalDateTime fimTurno, String status, String justificativa, Long tempoLogado, Long tempoPausa, Long atraso, Long horaExtra) {
        this.id = id;
        this.data = data;
        this.inicioTurno = inicioTurno;
        this.inicioPausa = inicioPausa;
        this.fimPausa = fimPausa;
        this.fimTurno = fimTurno;
        this.status = status;
        this.justificativa = justificativa;
        this.tempoLogado = tempoLogado;
        this.tempoPausa = tempoPausa;
        this.atraso = atraso;
        this.horaExtra = horaExtra;
    }

    // getters e setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getJustificativa() {
        return justificativa;
    }

    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }


    public Long getTempoLogado() {
        return tempoLogado;
    }

    public void setTempoLogado(Long tempoLogado) {
        this.tempoLogado = tempoLogado;
    }

    public Long getTempoPausa() {
        return tempoPausa;
    }

    public void setTempoPausa(Long tempoPausa) {
        this.tempoPausa = tempoPausa;
    }

    public Long getAtraso() {
        return atraso;
    }

    public void setAtraso(Long atraso) {
        this.atraso = atraso;
    }

    public Long getHoraExtra() {
        return horaExtra;
    }

    public void setHoraExtra(Long horaExtra) {
        this.horaExtra = horaExtra;
    }

}


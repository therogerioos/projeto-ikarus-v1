package com.ikarus.auth_api.domain;

import java.time.LocalDateTime;

public class EscalaInfo {
    private LocalDateTime inicioTurno;
    private LocalDateTime fimTurno;
    private LocalDateTime inicioPausa;
    private LocalDateTime fimPausa;

    public EscalaInfo(LocalDateTime inicioTurno, LocalDateTime fimTurno, LocalDateTime inicioPausa, LocalDateTime fimPausa) {
        this.inicioTurno = inicioTurno;
        this.fimTurno = fimTurno;
        this.inicioPausa = inicioPausa;
        this.fimPausa = fimPausa;
    }

    public LocalDateTime getInicioTurno() { return inicioTurno; }
    public LocalDateTime getFimTurno() { return fimTurno; }
    public LocalDateTime getInicioPausa() { return inicioPausa; }
    public LocalDateTime getFimPausa() { return fimPausa; }
}


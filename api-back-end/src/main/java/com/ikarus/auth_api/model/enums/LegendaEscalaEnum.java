package com.ikarus.auth_api.model.enums;

public enum LegendaEscalaEnum {
    ESCALADO,
    FOLGA,
    FERIADO,
    FERIAS,
    LICENÇA,
    ATESTADO,
    AFASTAMENTO,
    DEMITIDO;

    public boolean isFolgaOuFeriasOuLicencaOuDemitido() {
        return this == FOLGA
            || this == FERIADO
            || this == FERIAS
            || this == LICENÇA
            || this == AFASTAMENTO
            || this == DEMITIDO;
    }
}

package com.ikarus.auth_api.domain;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ikarus.auth_api.model.Cadastros;
import com.ikarus.auth_api.model.EscalaPersonalizada;
import com.ikarus.auth_api.model.EscalaSimples;
import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.repository.CadastroRepository;
import com.ikarus.auth_api.repository.EscalaPersonalRepository;
import com.ikarus.auth_api.repository.EscalaSimplesRepository;

@Component
public class EscalaHelper {

    @Autowired
    private EscalaPersonalRepository escalaPersonalizadaRepository;

    @Autowired
    private EscalaSimplesRepository escalaSimplesRepository;

    @Autowired
    private CadastroRepository cadastroRepository;

    public EscalaInfo obterEscalaDoDia(User user, LocalDateTime agora) {
        Cadastros cadastro = cadastroRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Cadastro não encontrado para o usuário: " + user.getId()));

        switch (cadastro.getTipoEscala()) {
            case PERSONALIZADA:
                return buscarEscalaPersonalizada(user, agora);
            case SIMPLES:
                return buscarEscalaSimples(user, agora);
            case LIVRE:
            default:
                return new EscalaInfo(null, null, null, null);
        }
    }

    private EscalaInfo buscarEscalaPersonalizada(User user, LocalDateTime agora) {
        Optional<EscalaPersonalizada> escalaOpt =
            escalaPersonalizadaRepository.findByUserAndDataEscala(user, agora.toLocalDate());

        if (escalaOpt.isPresent()) {
            EscalaPersonalizada escala = escalaOpt.get();

            if (escala.getLegendaEscala().isFolgaOuFeriasOuLicencaOuDemitido()) {
                return null;
            }

            return new EscalaInfo(
                escala.getDataHoraInicioTurno(),
                escala.getDataHoraFimTurno(),
                escala.getDataHoraInicioPausa(),
                escala.getDataHoraFimPausa()
            );
        } else {
            return horariosDoUsuario(user, agora);
        }
    }

    private EscalaInfo buscarEscalaSimples(User user, LocalDateTime agora) {
        Optional<EscalaSimples> escalaOpt = escalaSimplesRepository.findByUser(user);

        if (escalaOpt.isPresent()) {
            EscalaSimples escala = escalaOpt.get();
            LocalDateTime inicioTurno = LocalDateTime.of(agora.toLocalDate(), escala.getHoraInicioTurno());
            LocalDateTime fimTurno = LocalDateTime.of(agora.toLocalDate(), escala.getHoraFimTurno());
            LocalDateTime inicioPausa = LocalDateTime.of(agora.toLocalDate(), escala.getHoraInicioPausa());
            LocalDateTime fimPausa = LocalDateTime.of(agora.toLocalDate(), escala.getHoraFimPausa());

            if (!fimTurno.isAfter(inicioTurno)) {
                fimTurno = fimTurno.plusDays(1);
            }

            return new EscalaInfo(inicioTurno, fimTurno, inicioPausa, fimPausa);
        } else {
            return horariosDoUsuario(user, agora);
        }
    }

    private EscalaInfo horariosDoUsuario(User user, LocalDateTime agora) {
            Cadastros cadastro = cadastroRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Horários não definidos ao usuário"));

            LocalDateTime inicioTurno = LocalDateTime.of(agora.toLocalDate(), cadastro.getHoraInicioTurno());
            LocalDateTime fimTurno = LocalDateTime.of(agora.toLocalDate(), cadastro.getHoraFimTurno());
            LocalDateTime inicioPausa = LocalDateTime.of(agora.toLocalDate(), cadastro.getHoraInicioPausa());
            LocalDateTime fimPausa = LocalDateTime.of(agora.toLocalDate(), cadastro.getHoraFimPausa());

        if (!fimTurno.isAfter(inicioTurno)) {
            fimTurno = fimTurno.plusDays(1);
        }

        return new EscalaInfo(inicioTurno, fimTurno, inicioPausa, fimPausa);
    }
}


package com.ikarus.auth_api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ikarus.auth_api.dto.EscalaDTO.EscalaPersonalizadaDTO;
import com.ikarus.auth_api.dto.EscalaDTO.EscalaSimplesDTO;
import com.ikarus.auth_api.model.EscalaPersonalizada;
import com.ikarus.auth_api.model.EscalaSimples;
import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.model.enums.StatusEscala;
import com.ikarus.auth_api.repository.EscalaPersonalRepository;
import com.ikarus.auth_api.repository.EscalaSimplesRepository;
import com.ikarus.auth_api.repository.UserRepository;

@Service
public class EscalaService {

    @Autowired
    private EscalaPersonalRepository escalaPersonalRepository;

    @Autowired
    private EscalaSimplesRepository escalaSimplesRepository;

    @Autowired
    private UserRepository userRepository;

    public EscalaSimples criarEscalaSimples(EscalaSimplesDTO escalaSimples) {
        if (escalaSimplesRepository.existsByUserId(escalaSimples.getUserId())) {
            throw new IllegalArgumentException("Escala já existe para o usuário");
        }

        User user = userRepository.findById(escalaSimples.getUserId())
        .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        EscalaSimples novaEscala = new EscalaSimples();
        novaEscala.setUser(user);
        novaEscala.setStatusDoModulo(StatusEscala.ATIVO);
        novaEscala.setHoraInicioTurno(escalaSimples.getHoraInicioTurno());
        novaEscala.setHoraFimTurno(escalaSimples.getHoraFimTurno());
        novaEscala.setHoraInicioPausa(escalaSimples.getHoraInicioPausa());
        novaEscala.setHoraFimPausa(escalaSimples.getHoraFimPausa());

        return escalaSimplesRepository.save(novaEscala);
    }

    public EscalaPersonalizada criarEscalaPersonalizada(EscalaPersonalizadaDTO escalaPersonal) {
        if (escalaPersonalRepository.existsByUserId(escalaPersonal.getUserId())) {
            throw new IllegalArgumentException("Escala personalizada já existe para o usuário");
        }

        User user = userRepository.findById(escalaPersonal.getUserId())
        .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        EscalaPersonalizada novaEscala = new EscalaPersonalizada(); 
        novaEscala.setUser(user);
        novaEscala.setStatusDoModulo(StatusEscala.ATIVO);
        novaEscala.setLegendaEscala(escalaPersonal.getLegendaEscala());
        novaEscala.setDataEscala(escalaPersonal.getDataEscala());
        novaEscala.setDataHoraInicioTurno(escalaPersonal.getDataHoraInicioTurno());
        novaEscala.setDataHoraInicioPausa(escalaPersonal.getDataHoraInicioPausa());
        novaEscala.setDataHoraFimPausa(escalaPersonal.getDataHoraFimPausa());
        novaEscala.setDataHoraFimTurno(escalaPersonal.getDataHoraFimTurno());

        return escalaPersonalRepository.save(novaEscala);
    }

}

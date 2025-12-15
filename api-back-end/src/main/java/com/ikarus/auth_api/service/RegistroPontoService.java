package com.ikarus.auth_api.service;

import com.ikarus.auth_api.dto.FolhaPontoDTO;
import com.ikarus.auth_api.dto.RegistroPontoDTOBuilder.RegistroPontoDTO;
import com.ikarus.auth_api.dto.RegistroPontoDTOBuilder.RegistroPontoAdminDTO;
import com.ikarus.auth_api.dto.RegistroPontoDTOBuilder.RegistroPontoAusenteDTO;
import com.ikarus.auth_api.model.Cadastros;
import com.ikarus.auth_api.model.EscalaPersonalizada;
import com.ikarus.auth_api.model.RegistroPonto;
import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.model.enums.StatusPonto;
import com.ikarus.auth_api.repository.CadastroRepository;
import com.ikarus.auth_api.repository.EscalaPersonalRepository;
import com.ikarus.auth_api.repository.RegistroPontoRepository;
import com.ikarus.auth_api.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RegistroPontoService {

    private final RegistroPontoRepository registroPontoRepository;

    private final UserRepository userRepository;

    private final EscalaPersonalRepository escalaPersonalizadaRepository;

    private final CadastroRepository cadastroRepository;

    private final WebSocketService webSocketService;

    public RegistroPontoService(RegistroPontoRepository repository, UserRepository userRepository, EscalaPersonalRepository escalaPersonalizadaRepository, CadastroRepository cadastroRepository, WebSocketService webSocketService) {
        this.registroPontoRepository = repository;
        this.userRepository = userRepository;
        this.escalaPersonalizadaRepository = escalaPersonalizadaRepository;
        this.cadastroRepository = cadastroRepository;
        this.webSocketService = webSocketService;
    }

    public RegistroPonto iniciarTurno(User user) {

        Cadastros cadastro = cadastroRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Cadastro não encontrado para o usuário: " + user.getId()));

        LocalDateTime agora = LocalDateTime.now();

        switch (cadastro.getTipoEscala()) {
            case LIVRE:
                return iniciarTurnoLivre(user, agora);

            case SIMPLES:
                validarEscalaSimples(user, agora);
                return iniciarTurnoLivre(user, agora);

            case PERSONALIZADA:
                validarEscalaPersonalizada(user, agora);
                return iniciarTurnoLivre(user, agora);

            default:
                throw new IllegalStateException("Modo de escala inválido.");
        }
    }

    private void validarEscalaSimples(User user, LocalDateTime agora) {

        Cadastros cadastro = cadastroRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Cadastro não encontrado para o usuário: " + user.getId()));

        RegistroPonto ultimoTurno = registroPontoRepository
            .findTop1ByUserAndStatusInOrderByInicioTurnoDesc(
                user,
                List.of(StatusPonto.APONTAMENTO, StatusPonto.PRESENTE)
            )
            .orElse(null);

        if (ultimoTurno != null) {
            // Respeitar limite de jornada
            Duration total = Duration.ofHours(cadastro.getCargaHoraria().getHour())
                .plusMinutes(cadastro.getCargaHoraria().getMinute())
                .plusHours(cadastro.getTempoPausa().getHour())
                .plusMinutes(cadastro.getTempoPausa().getMinute())
                .plusHours(cadastro.getLimiteHorasExtras().getHour())
                .plusMinutes(cadastro.getLimiteHorasExtras().getMinute());

            LocalDateTime fimPermitido = ultimoTurno.getInicioTurno().plus(total);

            if (agora.isBefore(fimPermitido) && ultimoTurno.getFimTurno() == null) {
                throw new IllegalStateException("Ainda existe turno aberto.");
            }

            // Respeitar interjornada
            if (ultimoTurno.getFimTurno() != null) {
                Duration interjornada = Duration.ofHours(cadastro.getInterjornada().getHour())
                    .plusMinutes(cadastro.getInterjornada().getMinute());

                LocalDateTime proximoPermitido = ultimoTurno.getFimTurno().plus(interjornada);
                if (agora.isBefore(proximoPermitido)) {
                    throw new IllegalStateException("Interjornada não respeitada. Só pode abrir a partir de " + proximoPermitido);
                }
            }
        }
    }


    private void validarEscalaPersonalizada(User user, LocalDateTime agora) {

        Cadastros cadastro = cadastroRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Cadastro não encontrado para o usuário: " + user.getId()));

        Optional<EscalaPersonalizada> escalaOpt = escalaPersonalizadaRepository
            .findByUserAndDataEscala(user, agora.toLocalDate());

        LocalDateTime inicioTurno;
        LocalDateTime fimTurno;

        if (escalaOpt.isPresent()) {
            EscalaPersonalizada escala = escalaOpt.get();

            // Bloqueia se legenda for folga, férias, licença ou demitido
            if (escala.getLegendaEscala().isFolgaOuFeriasOuLicencaOuDemitido()) {
                throw new IllegalStateException("Usuário não está escalado para hoje.");
            }

            inicioTurno = escala.getDataHoraInicioTurno();
            fimTurno = escala.getDataHoraFimTurno();

        } else {
            
            inicioTurno = LocalDateTime.of(agora.toLocalDate(), cadastro.getHoraInicioTurno());
            fimTurno = LocalDateTime.of(agora.toLocalDate(), cadastro.getHoraFimTurno());

            if (cadastro.getHoraFimTurno().isBefore(cadastro.getHoraInicioTurno()) || cadastro.getHoraFimTurno().equals(cadastro.getHoraInicioTurno())) {
                    fimTurno = fimTurno.plusDays(1);
                }

        }

        // Valida início antecipado
        if (agora.isBefore(inicioTurno.minusMinutes(5))) {
            throw new IllegalStateException("Ainda não está no horário de entrada.");
        }

        // Valida limite após fim do turno
        Duration total = Duration.ofHours(cadastro.getLimiteHorasExtras().getHour())
                .plusMinutes(cadastro.getLimiteHorasExtras().getMinute());
        LocalDateTime fimPermitido = fimTurno.plus(total);
        if (agora.isAfter(fimPermitido)) {
            throw new IllegalStateException("Fora do horário permitido para iniciar turno.");
        }

        // Respeitar interjornada
        RegistroPonto ultimoTurno = registroPontoRepository
            .findTop1ByUserOrderByInicioTurnoDesc(user)
            .orElse(null);

        if (ultimoTurno != null && ultimoTurno.getFimTurno() != null) {
            Duration totalInter = Duration.ofHours(cadastro.getInterjornada().getHour())
                .plusMinutes(cadastro.getInterjornada().getMinute());
            LocalDateTime proximoPermitido = ultimoTurno.getFimTurno().plus(totalInter);
            if (agora.isBefore(proximoPermitido)) {
                throw new IllegalStateException("Interjornada não respeitada.");
            }
        }
    }



    public RegistroPonto iniciarTurnoLivre(User user, LocalDateTime dataHora) {
        LocalDate hoje = LocalDate.now();

        List<RegistroPonto> registrosPendentes = registroPontoRepository
            .findByUserAndDataBeforeAndStatusInAndFimTurnoIsNull(
                user,
                hoje,
                List.of(StatusPonto.APONTAMENTO, StatusPonto.PRESENTE)
            );

        if (!registrosPendentes.isEmpty()) {
            for (RegistroPonto registro : registrosPendentes) {
                registro.setStatus(StatusPonto.AUTO_FECHAMENTO);
                registro.setJustificativa("Necessário ajustar o registro de ponto manualmente.");
            }
            registroPontoRepository.saveAll(registrosPendentes);
        }

        Optional<RegistroPonto> pontoOpt = registroPontoRepository.findByUserAndData(user, hoje);
        
        if (pontoOpt.isPresent()) {
            RegistroPonto ponto = pontoOpt.get();
        if (ponto.getInicioTurno() != null) {
            throw new IllegalStateException("Turno já iniciado hoje.");
        }
            ponto.setInicioTurno(LocalDateTime.now());

            RegistroPonto salvo = registroPontoRepository.save(ponto);

            webSocketService.enviarAtualizacaoPonto(user, salvo);

            return salvo;

        } else {
            RegistroPonto novo = new RegistroPonto();
            novo.setUser(user);
            novo.setData(hoje);
            novo.setInicioTurno(LocalDateTime.now());

            RegistroPonto salvo = registroPontoRepository.save(novo);

            webSocketService.enviarAtualizacaoPonto(user, salvo);

            return salvo;
        }
    }

    public RegistroPonto adicionarPontoFuncionario(String adminUsername, RegistroPontoAdminDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        RegistroPonto ponto = new RegistroPonto();
        ponto.setUser(user);
        ponto.setData(dto.getInicioTurno().toLocalDate());
        ponto.setInicioTurno(dto.getInicioTurno());
        ponto.setFimTurno(dto.getFimTurno());
        ponto.setInicioPausa(dto.getInicioPausa());
        ponto.setFimPausa(dto.getFimPausa());
        ponto.setStatus(dto.getStatus());
        ponto.setCriadoPorAdmin(true);
        ponto.setJustificativa("Ponto criado por " + adminUsername);

        return registroPontoRepository.save(ponto);
    }

    public RegistroPonto adicionarPontoAusenteFuncionario(String adminUsername, RegistroPontoAusenteDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));


        if (dto.getStatus() == StatusPonto.DEMITIDO || dto.getStatus() == StatusPonto.FERIAS || dto.getStatus() == StatusPonto.FOLGA || dto.getStatus() == StatusPonto.ATESTADO) {
            RegistroPonto ponto = new RegistroPonto();
            ponto.setUser(user);
            ponto.setData(dto.getData());
            ponto.setInicioTurno(null);
            ponto.setFimTurno(null);
            ponto.setInicioPausa(null);
            ponto.setFimPausa(null);
            ponto.setStatus(dto.getStatus());
            ponto.setCriadoPorAdmin(true);
            ponto.setJustificativa("Ponto criado por " + adminUsername);

            return registroPontoRepository.save(ponto);

        } else {
            throw new IllegalArgumentException("Ação inválida para ponto ausente.");
        }


    }

    public RegistroPonto patchPontoFuncionario(String adminUsername, Long id, RegistroPontoAdminDTO dto) {
        RegistroPonto ponto = registroPontoRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Registro de ponto não encontrado"));

        if (dto.getInicioTurno() != null) {
            ponto.setInicioTurno(dto.getInicioTurno());
            ponto.setData(dto.getInicioTurno().toLocalDate());
        }
        if (dto.getFimTurno() != null) ponto.setFimTurno(dto.getFimTurno());
        if (dto.getInicioPausa() != null) ponto.setInicioPausa(dto.getInicioPausa());
        if (dto.getFimPausa() != null) ponto.setFimPausa(dto.getFimPausa());
        if (dto.getStatus() != null) ponto.setStatus(dto.getStatus());

        ponto.setCriadoPorAdmin(true);
        ponto.setJustificativa("Ponto atualizado por " + adminUsername);

        return registroPontoRepository.save(ponto);

    }

    
    public RegistroPonto patchPontoAusenteFuncionario(String adminUsername, Long id, RegistroPontoAusenteDTO dto) {
        RegistroPonto ponto = registroPontoRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Registro de ponto não encontrado"));
        
        if (dto.getStatus() == StatusPonto.DEMITIDO || dto.getStatus() == StatusPonto.FERIAS || dto.getStatus() == StatusPonto.FOLGA) {
            ponto.setData(dto.getData());
            ponto.setInicioTurno(null);
            ponto.setFimTurno(null);
            ponto.setInicioPausa(null);
            ponto.setFimPausa(null);
            ponto.setStatus(dto.getStatus());
            ponto.setCriadoPorAdmin(true);
            ponto.setJustificativa("Ponto criado por " + adminUsername);

            return registroPontoRepository.save(ponto);

        } else {
            throw new IllegalArgumentException("Ação inválida para ponto ausente.");
        }
    }





    public RegistroPonto iniciarPausa(User user) {
        RegistroPonto ponto = obterRegistroDoDia(user);
        if (ponto.getInicioTurno() == null) {
            throw new IllegalStateException("Turno ainda não iniciado.");
        }

        Duration desdeInicio = Duration.between(ponto.getInicioTurno(), LocalDateTime.now());
        if (desdeInicio.toMinutes() < 60) {
            throw new IllegalStateException("A pausa só pode ser iniciada após 1 hora de trabalho.");
        }

        if (ponto.getInicioPausa() != null) {
            throw new IllegalStateException("Pausa já iniciada.");
        }

        ponto.setInicioPausa(LocalDateTime.now());
        
        RegistroPonto salvo = registroPontoRepository.save(ponto);

        webSocketService.enviarAtualizacaoPonto(user, salvo);

        return salvo;
    }

    public RegistroPonto finalizarPausa(User user) {
        RegistroPonto ponto = obterRegistroDoDia(user);

        if (ponto.getInicioPausa() == null) {
            throw new IllegalStateException("Pausa ainda não iniciada.");
        }

        if (ponto.getFimPausa() != null) {
            throw new IllegalStateException("Pausa já finalizada.");
        }

        ponto.setFimPausa(LocalDateTime.now());

        RegistroPonto salvo = registroPontoRepository.save(ponto);

        webSocketService.enviarAtualizacaoPonto(user, salvo);

        return salvo;
    }

    public RegistroPonto finalizarTurno(User user) {
        RegistroPonto ponto = obterRegistroDoDia(user);

        if (ponto.getInicioPausa() == null) {
            throw new IllegalStateException("Pausa ainda não iniciada.");
        }

        if (ponto.getFimPausa() == null) {
            throw new IllegalStateException("Pausa ainda não finalizada.");
        }

        if (ponto.getInicioTurno() == null || ponto.getFimTurno() != null) {
            throw new IllegalStateException("Turno não iniciado ou já finalizado.");
        }

        ponto.setFimTurno(LocalDateTime.now());
        
        RegistroPonto salvo = registroPontoRepository.save(ponto);

        webSocketService.enviarAtualizacaoPonto(user, salvo);

        return salvo;
    }

    public RegistroPontoDTO obterRegistroDoDiaAtual(User user) {
        LocalDate hoje = LocalDate.now(); 
        Optional<RegistroPonto> registroOpt = registroPontoRepository.findByUserAndData(user, hoje);

        if (registroOpt.isPresent()) {
            RegistroPonto registro = registroOpt.get();
            return new RegistroPontoDTO(
                registro.getInicioTurno(),
                registro.getInicioPausa(),
                registro.getFimPausa(),
                registro.getFimTurno()
            );
        }

        return new RegistroPontoDTO(null, null, null, null);
    }




    private RegistroPonto obterRegistroDoDia(User user) {
        return registroPontoRepository.findByUserAndData(user, LocalDate.now())
                .orElseThrow(() -> new IllegalStateException("Nenhum registro encontrado para hoje."));
    }


    public List<FolhaPontoDTO> buscarFolhaPonto(Long userId, int mes, int ano) {
        YearMonth ym = YearMonth.of(ano, mes + 1);
        LocalDate inicioMes = ym.atDay(1);
        LocalDate fimMes = ym.atEndOfMonth();
        LocalDate hoje = LocalDate.now();

        // Busca registros no banco
        List<RegistroPonto> registros = registroPontoRepository
            .findByUserIdAndDataBetween(userId, inicioMes, fimMes);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Cadastros cadastro = cadastroRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Cadastro não encontrado para o usuário: " + user.getId()));

        // Mapeia por data para acesso rápido
        Map<LocalDate, RegistroPonto> mapRegistros = registros.stream()
            .collect(Collectors.toMap(RegistroPonto::getData, r -> r));

        List<FolhaPontoDTO> resultado = new ArrayList<>();

        for (LocalDate dia = inicioMes; !dia.isAfter(fimMes); dia = dia.plusDays(1)) {
            FolhaPontoDTO dto = new FolhaPontoDTO();
            dto.setData(dia);

            RegistroPonto registro = mapRegistros.get(dia);

            if (registro != null) {
                dto.setId(registro.getId());
                dto.setInicioTurno(registro.getInicioTurno());
                dto.setInicioPausa(registro.getInicioPausa());
                dto.setFimPausa(registro.getFimPausa());
                dto.setFimTurno(registro.getFimTurno());
                dto.setStatus(registro.getStatus().name());
                dto.setJustificativa(registro.getJustificativa());
                dto.setTempoLogado(calcularTempoLogado(
                    registro.getInicioTurno(),
                    registro.getFimTurno(),
                    registro.getInicioPausa(),
                    registro.getFimPausa()
                ));
                dto.setTempoPausa(calcularTempoPausa(
                    registro.getInicioPausa(),
                    registro.getFimPausa()
                ));
                if (cadastro.isFlagEscala()) {
                    dto.setAtraso(calcularAtraso(dto.getTempoLogado(), cadastro.getCargaHoraria()));
                    dto.setHoraExtra(calcularHoraExtra(dto.getTempoLogado(), cadastro.getCargaHoraria()));
                } else {
                    dto.setAtraso(null);
                    dto.setHoraExtra(null);
                }

            } else {
                if (dia.isBefore(hoje)) {
                    dto.setStatus("FALTA");
                } else if (dia.isEqual(hoje)) {
                    dto.setStatus(null);
                } else {
                    dto.setStatus(null);
                }
                dto.setTempoLogado(null);
            }

            resultado.add(dto);
        }

        return resultado;
    }

    private Long calcularTempoLogado(LocalDateTime inicioTurno, LocalDateTime fimTurno,
                                     LocalDateTime inicioPausa, LocalDateTime fimPausa) {
        if (inicioTurno == null || fimTurno == null) {
            return null;
        }

        inicioPausa = inicioPausa.withNano(0);
        fimPausa = fimPausa.withNano(0);
        inicioTurno = inicioTurno.withNano(0);
        fimTurno = fimTurno.withNano(0);
        long segundos = Duration.between(inicioTurno, fimTurno).getSeconds();

        if (inicioPausa != null && fimPausa != null) {
            segundos -= Duration.between(inicioPausa, fimPausa).getSeconds();
        }

        return segundos;
    }

    private Long calcularTempoPausa(LocalDateTime inicioPausa, LocalDateTime fimPausa) {
        if (inicioPausa == null || fimPausa == null) {
            return null;
        }

        inicioPausa = inicioPausa.withNano(0);
        fimPausa = fimPausa.withNano(0);
        long segundos = Duration.between(inicioPausa, fimPausa).getSeconds();
        return segundos;
    }

    private Long calcularAtraso(Long tempoLogadoSegundos, LocalTime cargaHoraria) {
        if (tempoLogadoSegundos == null || cargaHoraria == null) {
            return null;
        }

        long cargaSegundos = cargaHoraria.toSecondOfDay();

        long atraso = cargaSegundos - tempoLogadoSegundos;

        return atraso > 0 ? atraso : 0;
    }

    private Long calcularHoraExtra(Long tempoLogadoSegundos, LocalTime cargaHoraria) {
        if (tempoLogadoSegundos == null || cargaHoraria == null) {
            return null;
        }

        long cargaSegundos = cargaHoraria.toSecondOfDay();

        long horaExtra = tempoLogadoSegundos - cargaSegundos;

        return horaExtra > 0 ? horaExtra : 0;
    }
 

}





package com.ikarus.auth_api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ikarus.auth_api.model.Dispositivo;
import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.model.enums.StatusDispositivoEnum;
import com.ikarus.auth_api.repository.DispositivoRepository;
import com.ikarus.auth_api.repository.UserRepository;

@Service
public class DispositivoService {
    
    @Autowired
    private DispositivoRepository dispositivoRepository;

    @Autowired
    private UserRepository userRepository;

    public boolean validarOuRegistrar(String username, String hostname, String uuid, String hash) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();

        // 1. Verifica se já existe um dispositivo com esse hash para este usuário
        Optional<Dispositivo> existente = dispositivoRepository.findByHashMaquinaAndUsername(hash, username);

        if (existente.isPresent()) {
            Dispositivo dispositivo = existente.get();
            if (dispositivo.getStatus() == StatusDispositivoEnum.AUTORIZADO) {
                return true;
            } else {
                return false; // dispositivo existe mas não autorizado
            }
        }

        // 2. Verifica se esse hash já foi cadastrado para outro usuário ativo
        List<Dispositivo> duplicados = dispositivoRepository.findByHashMaquinaAndUsernameNot(hash, username)
            .stream()
            .filter(d -> d.getUser().isActive()) // Verifica se o usuário do outro dispositivo está ativo
            .toList();

        if (!duplicados.isEmpty()) {
            salvarNovoDispositivo(user, username, hostname, uuid, hash,
                    StatusDispositivoEnum.PENDENTE,
                    "Violação de segurança - duplicidade de acesso");
            return false;
        }

        // 3. Verifica se o usuário já possui outro dispositivo cadastrado
        List<Dispositivo> dispositivosUsuario = dispositivoRepository.findByUsername(username);

        if (!dispositivosUsuario.isEmpty()) {
            salvarNovoDispositivo(user, username, hostname, uuid, hash,
                    StatusDispositivoEnum.PENDENTE,
                    "Perfil de usuário com mais de uma máquina cadastrada");
            return false;
        }

        // 4. Primeira vez do usuário e hash novo => autorizamos
        salvarNovoDispositivo(user, username, hostname, uuid, hash,
                StatusDispositivoEnum.AUTORIZADO,
                null);
        return true;
    }

    private void salvarNovoDispositivo(User user, String username, String hostname, String uuid, String hash,
                                       StatusDispositivoEnum status, String justificativa) {
        Dispositivo d = new Dispositivo();
        d.setUser(user);
        d.setUsername(username);
        d.setHostname(hostname);
        d.setUuid(uuid);
        d.setHashMaquina(hash);
        d.setStatus(status);
        d.setJustificativa(justificativa);
        dispositivoRepository.save(d);
    }
}

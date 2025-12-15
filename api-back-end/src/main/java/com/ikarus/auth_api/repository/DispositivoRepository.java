package com.ikarus.auth_api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ikarus.auth_api.model.Dispositivo;

@Repository
public interface DispositivoRepository extends JpaRepository<Dispositivo, Long> {

    List<Dispositivo> findByUsername(String username);

    Optional<Dispositivo> findByHashMaquinaAndUsername(String hash, String username);

    List<Dispositivo> findByHashMaquinaAndUsernameNot(String hash, String username);
}

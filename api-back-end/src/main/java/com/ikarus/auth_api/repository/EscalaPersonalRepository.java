package com.ikarus.auth_api.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ikarus.auth_api.model.EscalaPersonalizada;
import com.ikarus.auth_api.model.User;

@Repository
public interface EscalaPersonalRepository extends JpaRepository<EscalaPersonalizada, Long> {

    List<EscalaPersonalizada> findByUserId(Long userId);
    Optional<EscalaPersonalizada> findByUserAndDataEscala(User user, LocalDate data);
    boolean existsByUserId(Long userId);

}

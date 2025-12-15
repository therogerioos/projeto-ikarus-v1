package com.ikarus.auth_api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ikarus.auth_api.model.EscalaSimples;
import com.ikarus.auth_api.model.User;

@Repository
public interface EscalaSimplesRepository extends JpaRepository<EscalaSimples, Long> {

    List<EscalaSimples> findByUserId(Long userId);
    Optional<EscalaSimples> findByUser(User user);
    boolean existsByUserId(Long userId);

}

package com.ikarus.auth_api.repository;

import com.ikarus.auth_api.model.Organizacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizacaoRepository extends JpaRepository<Organizacao, Long> {
    boolean existsByNome(String nome);
}


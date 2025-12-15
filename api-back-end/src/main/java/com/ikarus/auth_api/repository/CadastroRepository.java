package com.ikarus.auth_api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ikarus.auth_api.model.Cadastros;
import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.model.enums.Role;

@Repository
public interface CadastroRepository extends JpaRepository<Cadastros, Long> {

    Optional<Cadastros> findByUser(User user);

    Optional<Cadastros> findByUser_Username(String username);

    List<Cadastros> findByOrganizacao_IdAndUser_Role(Long organizacaoId, Role role);

    List<Cadastros> findByAdmin_IdAndUser_Role(Long adminId, Role role);

    List<Cadastros> findByManager_IdAndUser_Role(Long managerId, Role role);

    Optional<Cadastros> findByUser_Id(Long userId);


}

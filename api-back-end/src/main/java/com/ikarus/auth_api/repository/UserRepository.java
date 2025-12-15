package com.ikarus.auth_api.repository;

import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.model.enums.Role;
import com.ikarus.auth_api.model.enums.StatusUsuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    List<User> findByOrganizacaoId(Long orgId);

    boolean existsByUsername(String username);

    long countByOrganizacaoIdAndStatusNot(Long organizacaoId, StatusUsuario status);

    List<User> findByRole(Role role);

    List<User> findAllByRole(Role role);

    List<User> findByIdInAndRoleAndStatusNot(List<Long> usersId, Role role, StatusUsuario status);


}

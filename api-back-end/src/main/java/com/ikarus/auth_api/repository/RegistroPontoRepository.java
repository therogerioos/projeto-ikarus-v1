package com.ikarus.auth_api.repository;

import com.ikarus.auth_api.model.RegistroPonto;
import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.model.enums.Role;
import com.ikarus.auth_api.model.enums.StatusPonto;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RegistroPontoRepository extends JpaRepository<RegistroPonto, Long> {

    List<RegistroPonto> findByUserIdAndDataBetween(Long userId, LocalDate inicio, LocalDate fim);

    Optional<RegistroPonto> findById(Long id);

    Optional<RegistroPonto> findTop1ByUserOrderByInicioTurnoDesc(User user);

    Optional<RegistroPonto> findByUserAndData(User user, LocalDate data);

    List<RegistroPonto> findByUserIdInAndDataAndUserRole(List<Long> userIds, LocalDate data, Role role);

    Optional<RegistroPonto> findTop1ByUserAndStatusInOrderByInicioTurnoDesc(
        User user,
        List<StatusPonto> status
    );

    List<RegistroPonto> findByUserAndDataBeforeAndStatusInAndFimTurnoIsNull(
        User user,
        LocalDate data,
        List<StatusPonto> status
    );
}



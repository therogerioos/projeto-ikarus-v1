package com.ikarus.auth_api.service;

import com.ikarus.auth_api.domain.EscalaHelper;
import com.ikarus.auth_api.domain.EscalaInfo;
import com.ikarus.auth_api.dto.TrocaSenhaDTO;
import com.ikarus.auth_api.dto.UserCadastroDTO.UserCadastroDTOFull;
import com.ikarus.auth_api.dto.AdministradorDTO.AdministradorDTOFull;
import com.ikarus.auth_api.dto.AdministradorDTO.AdministradorDTOSimple;
import com.ikarus.auth_api.dto.UserPublicDTO.UserPublicAdmin;
import com.ikarus.auth_api.dto.UserPublicDTO.UserPublicFull;
import com.ikarus.auth_api.dto.UserPublicDTO.UserPublicIdName;
import com.ikarus.auth_api.dto.UserPublicDTO.UserPublicSimple;
import com.ikarus.auth_api.model.Cadastros;
import com.ikarus.auth_api.model.Organizacao;
import com.ikarus.auth_api.model.RegistroPonto;
import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.model.enums.Role;
import com.ikarus.auth_api.model.enums.StatusUsuario;
import com.ikarus.auth_api.repository.CadastroRepository;
import com.ikarus.auth_api.repository.OrganizacaoRepository;
import com.ikarus.auth_api.repository.RegistroPontoRepository;
import com.ikarus.auth_api.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;


@Service
public class UserService {

    @Autowired
    private RegistroPontoRepository registroPontoRepository;

    @Autowired
    private CadastroRepository cadastroRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EscalaHelper escalaHelper;

    private final OrganizacaoRepository organizacaoRepository;

    public UserService(UserRepository userRepository,
                       OrganizacaoRepository organizacaoRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.organizacaoRepository = organizacaoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private boolean isSenhaForte(String senha) {
    // Pelo menos 8 caracteres, 1 letra maiúscula, 1 caractere especial
    String regex = "^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,}$";
    return senha.matches(regex);
    }

    private String normalizeUsername(String username) {

        return username.trim().toLowerCase();

    }

    private void validarUsernameParaAtualizacao(Long userId, String usernameNovo) {
        Optional<User> userComUsername = userRepository.findByUsername(usernameNovo);
        if (userComUsername.isPresent() && !userComUsername.get().getId().equals(userId)) {
            throw new RuntimeException("Username já em uso por outro usuário");
        }
    }

    @Transactional
    public User createUser(UserCadastroDTOFull dto, User adminLogado) {

        String normalizedUsername = normalizeUsername(dto.getUsername());

        if (userRepository.existsByUsername(normalizedUsername)) {
            throw new RuntimeException("Username já em uso");
        }
        // Recupera o ID da organização do admin logado
        Long organizacaoId = adminLogado.getOrganizacaoId();
        if (organizacaoId == null) {
            throw new RuntimeException("Administrador não possui organização vinculada.");
        }

        // Busca a organização no banco
        Organizacao organizacao = organizacaoRepository.findById(organizacaoId)
                .orElseThrow(() -> new RuntimeException("Organização não encontrada."));

        // Verifica o número de usuários ativos
        long usuariosAtivos = userRepository.countByOrganizacaoIdAndStatusNot(
                organizacaoId, StatusUsuario.DEMITIDO
        );

        if (usuariosAtivos >= organizacao.getLimiteUsuarios()) {
            throw new RuntimeException("Limite de usuários ativos atingido para essa organização.");
        }

        User user = new User();
        user.setUsername(normalizedUsername);
        user.setNome(dto.getNome());
        user.setRole(Role.USER);
        user.setOrganizacaoId(organizacaoId); // importante!
        user.setStatus(StatusUsuario.ATIVO);

        String provisionalPassword = generateProvisionalPassword();
        user.setPassword(passwordEncoder.encode(provisionalPassword));
        user.setTemporaryPassword(provisionalPassword);
        user.setProvisionalPassword(true);

        Cadastros cadastro = new Cadastros();
        cadastro.setTipoEscala(dto.getTipoEscala());
        cadastro.setFlagEscala(true);
        cadastro.setOrganizacao(organizacao);

        userRepository.save(user);
        cadastroRepository.save(cadastro);
        return user;
    }



    @Transactional
    public User createAdmin(AdministradorDTOFull dto, User managerLogado) {
        
        String normalizedUsername = normalizeUsername(dto.getUsername());

        if (userRepository.existsByUsername(normalizedUsername)) {
            throw new RuntimeException("Username já em uso");
        }

        Long organizacaoId = managerLogado.getOrganizacaoId();
        if (organizacaoId == null) {
            throw new RuntimeException("Manager não está vinculado a uma organização.");
        }

        Organizacao org = new Organizacao();
        org.setId(organizacaoId);

        User admin = new User();
        admin.setUsername(normalizedUsername);
        admin.setNome(dto.getNome());
        admin.setStatus(StatusUsuario.ATIVO);
        // O novo ADMIN pertence à mesma organização do MANAGER que o criou
        admin.setOrganizacaoId(organizacaoId);
        admin.setRole(Role.ADMIN);

        String provisionalPassword = generateProvisionalPassword();
        admin.setPassword(passwordEncoder.encode(provisionalPassword));
        admin.setTemporaryPassword(provisionalPassword);
        admin.setProvisionalPassword(true);

        Cadastros cadastro = new Cadastros();
        cadastro.setTipoEscala(dto.getTipoEscala());
        cadastro.setFlagEscala(true);
        cadastro.setOrganizacao(org);
        cadastro.setAdmin(managerLogado);
        cadastro.setManager(managerLogado);

        userRepository.save(admin);
        cadastroRepository.save(cadastro);

        return admin;
    }


    public void deleteUser(Long id, Role role, User gestorLogado) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (user.getRole() != role) {
            throw new RuntimeException("Perfil não corresponde ao tipo informado");
        }

        // Validação de segurança: MASTER pode tudo, outros gestores (MANAGER, ADMIN) só na sua organização.
        if (gestorLogado.getRole() != Role.MASTER) {
            if (!Objects.equals(user.getOrganizacaoId(), gestorLogado.getOrganizacaoId())) {
                throw new SecurityException("Acesso negado. Você não tem permissão para deletar usuários de outra organização.");
            }
        }

        userRepository.delete(user);
    }

    private String generateProvisionalPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    public String resetarSenhaAdmin(String username) {
        String normalizedUsername = normalizeUsername(username);
        User admin = userRepository.findByUsername(normalizedUsername)
            .orElseThrow(() -> new RuntimeException("Administrador não encontrado"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Usuário não é um administrador");
        }

        String novaSenha = generateProvisionalPassword();

        admin.setPassword(passwordEncoder.encode(novaSenha));
        admin.setTemporaryPassword(novaSenha);
        admin.setProvisionalPassword(true);

        userRepository.save(admin);

        return novaSenha;
    }

    public String resetarSenha(String username) {
        String normalizedUsername = normalizeUsername(username);
        User user = userRepository.findByUsername(normalizedUsername)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (user.getRole() != Role.USER) {
            throw new RuntimeException("Perfil não corresponde ao tipo informado");
        }

        String novaSenha = generateProvisionalPassword();

        user.setPassword(passwordEncoder.encode(novaSenha));
        user.setTemporaryPassword(novaSenha);
        user.setProvisionalPassword(true);

        userRepository.save(user);

        return novaSenha;
    }

    public void trocarSenha(TrocaSenhaDTO dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!user.isProvisionalPassword()) {
            throw new RuntimeException("Esta conta não possui senha provisória ativa.");
        }

        if (!Objects.equals(dto.getNovaSenha(), dto.getConfirmarSenha())) {
            throw new RuntimeException("Nova senha e confirmação não coincidem.");
        }

        if (!Objects.equals(dto.getSenhaProvisoria(), user.getTemporaryPassword())) {
            throw new RuntimeException("Senha provisória incorreta.");
        }

        // Regras de política de senha
        if (!isSenhaForte(dto.getNovaSenha())) {
            throw new RuntimeException("A senha deve ter no mínimo 8 caracteres, com pelo menos 1 letra maiúscula e 1 caractere especial.");
        }

        user.setPassword(passwordEncoder.encode(dto.getNovaSenha()));
        user.setProvisionalPassword(false);
        user.setTemporaryPassword(null);

        userRepository.save(user);
    }

    public User getUsuarioAutenticado() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
        return null;
    }

    Object principal = authentication.getPrincipal();
    if (principal instanceof UserDetails) {
        String username = ((UserDetails) principal).getUsername();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuário autenticado não encontrado"));
    }

    return null;
    }

    public User buscarPorId(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public Cadastros buscarCadastroPorUserId(Long id) {
        return cadastroRepository.findByUser_Id(id)
                .orElseThrow(() -> new RuntimeException("Cadastro do usuário não encontrado"));
    }

    @Transactional(readOnly = true)
    public UserPublicSimple meProfile(String username) {

        Cadastros cadastro = cadastroRepository.findByUser_Username(username)
            .orElseThrow(() -> new RuntimeException("Cadastro do usuário não encontrado"));

        EscalaInfo escala = escalaHelper.obterEscalaDoDia(cadastro.getUser(), LocalDateTime.now());

        return new UserPublicSimple(
                cadastro.getUser().getId(),
                cadastro.getUser().getUsername(),
                cadastro.getUser().getNome(),
                cadastro.getUser().getRole().name(),
                cadastro.getStatus(),
                escala != null ? escala.getInicioTurno() : null,
                escala != null ? escala.getFimTurno() : null,
                escala != null ? escala.getInicioPausa() : null,
                escala != null ? escala.getFimPausa() : null
        );
    }

    @Transactional(readOnly = true)
    public UserPublicAdmin meProfileAdmin(String username) {

        Optional<Cadastros> cadastroOpt = cadastroRepository.findByUser_Username(username);

        if (cadastroOpt.isPresent()) {

            Cadastros cadastro = cadastroOpt.get();

            return new UserPublicAdmin(
                    cadastro.getUser().getId(),
                    cadastro.getUser().getUsername(),
                    cadastro.getUser().getOrganizacaoId(),
                    cadastro.getUser().getNome(),
                    cadastro.getUser().getRole().name(),
                    cadastro.getStatus(),
                    cadastro.getAdmin() != null ? cadastro.getAdmin().getId() : null,
                    cadastro.getManager() != null ? cadastro.getManager().getId() : null,
                    null // sem mensagem de alerta
            );
        }

        // Se não encontrar cadastro, busca o user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        // Retorna DTO parcial com aviso
        return new UserPublicAdmin(
                user.getId(),
                user.getUsername(),
                user.getOrganizacaoId(),
                user.getNome(),
                user.getRole().name(),
                null, // não há status de cadastro
                null,
                null,
                "Seu perfil não possui um cadastro completo. É necessário completar as informações, por gentileza solicite ao seu gestor."
        );
    }


    public User atribuirOrganizacaoAoAdmin(Long id, AdministradorDTOFull dto) {
        User user = buscarPorId(id);

        user.setOrganizacaoId(dto.getOrganizacaoId());
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<UserPublicFull> listarPerfisUsuario(Role role, User adminLogado) {
        List<Cadastros> cadastros;

        if (adminLogado.getRole() == Role.MASTER || adminLogado.getRole() == Role.MANAGER) {
            cadastros = cadastroRepository.findByOrganizacao_IdAndUser_Role(adminLogado.getOrganizacaoId(), role);
        } else if (adminLogado.getRole() == Role.ADMIN) {
            cadastros = cadastroRepository.findByAdmin_IdAndUser_Role(adminLogado.getId(), role);
        } else {
            return Collections.emptyList();
        }

        return cadastros.stream().map(cadastro -> new UserPublicFull(
                cadastro.getUser().getId(),
                cadastro.getMatricula(),
                cadastro.getUser().getUsername(),
                cadastro.getUser().getNome(),
                cadastro.getUser().getRole().name(),
                cadastro.getFuncao(),
                cadastro.getStatus(),
                cadastro.getUser().getOrganizacaoId() != null ? cadastro.getUser().getOrganizacaoId() : null,
                cadastro.getUser().isProvisionalPassword(),
                cadastro.getUser().getTemporaryPassword(),
                cadastro.isFlagEscala(),
                cadastro.getTipoEscala(),
                cadastro.getDataNascimento(),
                cadastro.getDataAdmissao(),
                cadastro.getDataDemissao(),
                cadastro.getNumberCtps(),
                cadastro.getSerieCtps(),
                cadastro.getInterjornada(),
                cadastro.getLimiteHorasExtras(),
                cadastro.getTempoPausa(),
                cadastro.getCargaHoraria(),
                cadastro.getHoraInicioTurno(),
                cadastro.getHoraFimTurno(),
                cadastro.getHoraInicioPausa(),
                cadastro.getHoraFimPausa(),
                cadastro.getOrganizacao().getNome() != null ? cadastro.getOrganizacao().getNome() : null
        )).toList();
    }


    @Transactional
    // Esse trecho será descontinuado, quando for implementado o gerenciamento via Cadastros, com isso, ao concluir o processo de implementação, favor remover esse método.
    public void atribuirAdminParaUsuario(Long userId, Long adminId, User managerLogado) {
        Cadastros cadastro = cadastroRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Usuário a ser atribuído não encontrado."));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrador de destino não encontrado."));

        // Validação de segurança: Manager só pode gerenciar usuários da sua organização
        if (managerLogado.getRole() == Role.MANAGER) {
            if (!Objects.equals(cadastro.getUser().getOrganizacaoId(), managerLogado.getOrganizacaoId())) {
                throw new SecurityException("Acesso negado. O usuário não pertence à sua organização.");
            }
        }

        // Validações de perfil
        if (cadastro.getUser().getRole() != Role.USER) {
            throw new RuntimeException("Apenas perfis 'USER' podem ser atribuídos.");
        }

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("O perfil de destino deve ser um 'ADMIN'.");
        }

        // Validação principal: Garante que o usuário e o admin de destino pertencem à mesma organização.
        if (!Objects.equals(cadastro.getUser().getOrganizacaoId(), admin.getOrganizacaoId())) {
            throw new RuntimeException("Operação inválida: O usuário e o administrador devem pertencer à mesma organização.");
        }

        cadastro.setAdmin(admin);
        cadastro.setManager(managerLogado);
        cadastroRepository.save(cadastro);
    }

    @Transactional
    public void desatribuirAdminDeUsuario(Long userId, User gestorLogado) {
        Cadastros cadastro = cadastroRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        // Validação de segurança: MASTER pode tudo, MANAGER só na sua organização.
        if (gestorLogado.getRole() == Role.MANAGER) {
            if (!Objects.equals(cadastro.getUser().getOrganizacaoId(), gestorLogado.getOrganizacaoId())) {
                throw new SecurityException("Acesso negado. O usuário não pertence à sua organização.");
            }
        }

        if (cadastro.getAdmin() == null) {
            throw new RuntimeException("Usuário não possui um administrador atribuído.");
        }

        cadastro.setAdmin(gestorLogado);
        cadastro.setManager(gestorLogado);

        cadastroRepository.save(cadastro);
    }

    @Transactional
    public AdministradorDTOSimple atualizarAdmin(Long id, AdministradorDTOSimple adminAtualizado) {
        String normalizedUsername = normalizeUsername(adminAtualizado.getUsername());

        validarUsernameParaAtualizacao(id, normalizedUsername);

        User admin = buscarPorId(id);

        admin.setUsername(adminAtualizado.getUsername());
        admin.setNome(adminAtualizado.getNome());
        admin.setStatus(StatusUsuario.valueOf(adminAtualizado.getStatus()));

        User userAtualizado = userRepository.save(admin);

        return new AdministradorDTOSimple(userAtualizado);
    }

    @Transactional
    public Cadastros atualizaUsuario(Long id, UserCadastroDTOFull usuarioAtualizado) {
        String normalizedUsername = normalizeUsername(usuarioAtualizado.getUsername());

        validarUsernameParaAtualizacao(id, normalizedUsername);

        Cadastros cadastro = buscarCadastroPorUserId(id);
        User user = cadastro.getUser();

        if (!cadastro.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Cadastro não pertence ao usuário informado.");
        }

        user.setUsername(usuarioAtualizado.getUsername());
        user.setNome(usuarioAtualizado.getNome());
        cadastro.setStatus(usuarioAtualizado.getStatusCadastro());

        switch (usuarioAtualizado.getStatusCadastro()) {
            case DEMITIDO -> user.setStatus(StatusUsuario.DEMITIDO);
            case ATIVO -> user.setStatus(StatusUsuario.ATIVO);
            case FERIAS, AFASTADO, LICENÇA -> user.setStatus(StatusUsuario.INATIVO);
        }

        cadastro.setFuncao(usuarioAtualizado.getFuncao());
        cadastro.setMatricula(usuarioAtualizado.getMatricula());

        cadastro.setDataNascimento(usuarioAtualizado.getDataNascimento());
        cadastro.setDataAdmissao(usuarioAtualizado.getDataAdmissao());
        cadastro.setDataDemissao(usuarioAtualizado.getDataDemissao());

        cadastro.setNumberCtps(usuarioAtualizado.getNumberCtps());
        cadastro.setSerieCtps(usuarioAtualizado.getSerieCtps());

        cadastro.setFlagEscala(usuarioAtualizado.isFlagEscala());
        cadastro.setTipoEscala(usuarioAtualizado.getTipoEscala());

        cadastro.setCargaHoraria(usuarioAtualizado.getCargaHoraria());
        cadastro.setInterjornada(usuarioAtualizado.getInterjornada());
        cadastro.setLimiteHorasExtras(usuarioAtualizado.getLimiteHorasExtras());
        cadastro.setTempoPausa(usuarioAtualizado.getTempoPausa());

        cadastro.setHoraInicioTurno(usuarioAtualizado.getHoraInicioTurno());
        cadastro.setHoraFimTurno(usuarioAtualizado.getHoraFimTurno());
        cadastro.setHoraInicioPausa(usuarioAtualizado.getHoraInicioPausa());
        cadastro.setHoraFimPausa(usuarioAtualizado.getHoraFimPausa());

        userRepository.save(user);
        return cadastroRepository.save(cadastro);
    }

    @Transactional(readOnly = true)
    public List<UserPublicSimple> getFuncionariosLogadosHoje(User adminLogado, LocalDate data) {

        List<Cadastros> usuarios;

        if (adminLogado.getRole() == Role.ADMIN) {
            // Admin vê apenas os usuários que ele gerencia
            usuarios = cadastroRepository.findByAdmin_IdAndUser_Role(adminLogado.getId(), Role.USER);
        } else {
            return Collections.emptyList(); // Outros perfis não devem usar esta rota
        }

        if (usuarios.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> userIds = usuarios.stream()
                                    .filter(c -> c.getUser() != null)
                                    .map(Cadastros::getUser)
                                    .map(User::getId)
                                    .collect(Collectors.toList());

        List<RegistroPonto> registros = registroPontoRepository.findByUserIdInAndDataAndUserRole(userIds, data, Role.USER);

        return registros.stream()
                .filter(r -> r.getInicioTurno() != null && r.getFimTurno() == null) // só ativos
                .map(r -> {
                    User u = r.getUser();
                    Cadastros c = usuarios.stream()
                        .filter(cad -> cad.getUser().getId().equals(u.getId()))
                        .findFirst()
                        .orElse(null);
                    return new UserPublicSimple(
                            u.getId(),
                            u.getUsername(),
                            u.getNome(),
                            u.getRole().name(),
                            (c != null ? c.getStatus() : null),
                            r.getInicioTurno(),
                            r.getFimTurno(),
                            r.getInicioPausa(),
                            r.getFimPausa()
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserPublicIdName> getFuncionariosIdAndName(User adminLogado) {

        List<Cadastros> usuarios;

        if (adminLogado.getRole() == Role.ADMIN) {
            usuarios = cadastroRepository.findByAdmin_IdAndUser_Role(adminLogado.getId(), Role.USER);
        } else {
            return Collections.emptyList();
        }

        if (usuarios.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> userIds = usuarios.stream()
                                        .filter(c -> c.getUser() != null)
                                        .map(Cadastros::getUser)
                                        .map(User::getId)
                                        .collect(Collectors.toList());

        List<User> funcionarios = userRepository.findByIdInAndRoleAndStatusNot(userIds, Role.USER, StatusUsuario.DEMITIDO);

        return funcionarios.stream()
                .map(r -> new UserPublicIdName(
                        r.getId(),
                        r.getNome()
                ))
                .collect(Collectors.toList());
    }

}

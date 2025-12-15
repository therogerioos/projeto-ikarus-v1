package com.ikarus.auth_api.config;

import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.model.enums.Role;
import com.ikarus.auth_api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initMasterUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String masterUsername = "";

            if (userRepository.findByUsername(masterUsername).isEmpty()) {
                User master = new User();
                master.setUsername(masterUsername);
                master.setNome("");
                master.setPassword(passwordEncoder.encode(""));
                master.setRole(Role.MASTER);
                master.setProvisionalPassword(false);

                userRepository.save(master);
                System.out.println("Usuário MASTER criado com sucesso.");
            } else {
                System.out.println("Usuário MASTER já existe.");
            }
        };
    }
}

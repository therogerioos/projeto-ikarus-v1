package com.ikarus.auth_api.security;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.server.HandshakeInterceptor;

import com.ikarus.auth_api.model.User;
import com.ikarus.auth_api.repository.UserRepository;

import org.springframework.web.socket.WebSocketHandler;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

@Component
public class AuthHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtTokenProvider jwtProvider;
    private final UserRepository userRepo;

    public AuthHandshakeInterceptor(JwtTokenProvider jwtProvider, UserRepository userRepo) {
        this.jwtProvider = jwtProvider;
        this.userRepo = userRepo;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {

        if(request instanceof ServletServerHttpRequest servletRequest){
            HttpServletRequest httpReq = servletRequest.getServletRequest();
            Cookie[] cookies = httpReq.getCookies();

            if(cookies != null) {
                for(Cookie c : cookies){
                    if("AUTH-TOKEN".equals(c.getName())){
                        String token = c.getValue();
                        if(jwtProvider.validateToken(token)){
                            String username = jwtProvider.getUsername(token);

                            User user = userRepo.findByUsername(username)
                                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

                            attributes.put("username", username);
                            attributes.put("role", user.getRole());
                            attributes.put("orgId", user.getOrganizacao().getId());
                            return true;
                        }
                    }
                }
            }
        }
        response.setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {}
}

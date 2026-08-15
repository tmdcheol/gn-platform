package com.gnplatform.api.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.session.ChangeSessionIdAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;

import com.gnplatform.api.dto.LoginRequest;
import com.gnplatform.api.dto.MeResponse;
import com.gnplatform.api.service.ports.in.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Service
public class DefaultAuthService implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
    private final SessionAuthenticationStrategy sessionAuthenticationStrategy = new ChangeSessionIdAuthenticationStrategy();

    public DefaultAuthService(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public MeResponse login(LoginRequest request,
                            HttpServletRequest servletRequest,
                            HttpServletResponse servletResponse) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        // 세션 고정 공격 방지. 직접 authenticate()를 부르면 폼 로그인이 자동으로 해주던
        // 세션 ID 교체가 빠지므로 여기서 명시적으로 갱신합니다.
        sessionAuthenticationStrategy.onAuthentication(authentication, servletRequest, servletResponse);

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, servletRequest, servletResponse);

        return new MeResponse(authentication.getName());
    }

    @Override
    public void logout(HttpServletRequest servletRequest, HttpServletResponse servletResponse) {
        HttpSession session = servletRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
    }
}

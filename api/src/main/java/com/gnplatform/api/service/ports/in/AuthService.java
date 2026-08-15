package com.gnplatform.api.service.ports.in;

import com.gnplatform.api.dto.LoginRequest;
import com.gnplatform.api.dto.MeResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    /**
     * 인증에 성공하면 세션에 로그인 상태를 저장합니다. 실패하면 BadCredentialsException.
     */
    MeResponse login(LoginRequest request, HttpServletRequest servletRequest, HttpServletResponse servletResponse);

    void logout(HttpServletRequest servletRequest, HttpServletResponse servletResponse);
}

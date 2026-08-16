package com.gnplatform.api;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.web.csrf.CsrfTokenRepository;

import com.gnplatform.api.dto.LoginRequest;
import com.gnplatform.api.service.ports.in.AuthService;

import jakarta.servlet.http.Cookie;

/**
 * 로그인이 세션과 CSRF 토큰을 함께 갈아끼우는지 봅니다.
 * MockMvc는 테스트용 CSRF 저장소를 끼워 넣어 쿠키가 관찰되지 않으므로 서비스에서 확인합니다.
 */
@SpringBootTest
@DisplayName("로그인 세션·토큰 교체")
class AuthServiceTest {

    @Autowired
    AuthService authService;

    @Autowired
    CsrfTokenRepository csrfTokenRepository;

    @Value("${app.admin.username}")
    String username;

    @Value("${app.admin.password}")
    String password;

    @Test
    @DisplayName("로그인하면 로그인 전에 심어둔 CSRF 토큰을 폐기한다")
    void loginDiscardsCsrfToken() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        request.setCookies(new Cookie("XSRF-TOKEN", "로그인-전-토큰"));

        authService.login(new LoginRequest(username, password), request, response);

        // 세션 ID만 갈고 토큰을 남기면 로그인 전 토큰이 그대로 유효합니다.
        // 폐기는 빈 값 + Max-Age=0 쿠키로 나가고, 새 토큰은 다음 요청에서 발급됩니다.
        Cookie discarded = response.getCookie("XSRF-TOKEN");
        assertThat(discarded).isNotNull();
        assertThat(discarded.getValue()).isEmpty();
        assertThat(discarded.getMaxAge()).isZero();
    }

    @Test
    @DisplayName("로그인하면 기존 세션 ID를 그대로 쓰지 않는다")
    void loginChangesSessionId() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        String before = request.getSession().getId();

        authService.login(new LoginRequest(username, password), request, response);

        assertThat(request.getSession().getId()).isNotEqualTo(before);
    }
}

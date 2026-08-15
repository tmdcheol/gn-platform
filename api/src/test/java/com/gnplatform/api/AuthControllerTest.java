package com.gnplatform.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.gnplatform.api.dto.LoginRequest;

import jakarta.servlet.http.HttpSession;

import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("관리자 로그인")
class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    // 비밀번호를 테스트에 하드코딩하지 않고 테스트 프로필에서 읽습니다.
    @Value("${app.admin.username}")
    String username;

    @Value("${app.admin.password}")
    String password;

    private String body(String username, String password) {
        return objectMapper.writeValueAsString(new LoginRequest(username, password));
    }

    @Test
    @DisplayName("올바른 비밀번호로 로그인하면 200과 로그인 세션을 받는다")
    void loginSuccess() throws Exception {
        // MockMvc는 서블릿 컨테이너가 아니라 JSESSIONID를 직접 내려주지 않으므로
        // 세션에 인증 정보가 저장됐는지로 확인합니다. 실제 Set-Cookie는 실서버에서 확인했습니다.
        MvcResult result = mockMvc.perform(post("/api/auth/login").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(username, password)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(username))
                .andReturn();

        HttpSession session = result.getRequest().getSession(false);
        assertThat(session).isNotNull();
        assertThat(session.getAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY))
                .isNotNull();
    }

    @Test
    @DisplayName("틀린 비밀번호로 로그인하면 401")
    void loginFailure() throws Exception {
        mockMvc.perform(post("/api/auth/login").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(username, "틀린-비밀번호")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("아이디 또는 비밀번호가 올바르지 않습니다"));
    }

    @Test
    @DisplayName("없는 아이디로 로그인해도 같은 401 문구를 준다")
    void loginUnknownUser() throws Exception {
        mockMvc.perform(post("/api/auth/login").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body("없는-계정", password)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("아이디 또는 비밀번호가 올바르지 않습니다"));
    }

    @Test
    @DisplayName("로그인 쿠키 없이 /me를 부르면 401")
    void meWithoutLogin() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("로그인한 세션으로 /me를 부르면 200과 아이디를 받는다")
    void meWithLogin() throws Exception {
        MockHttpSession session = new MockHttpSession();

        mockMvc.perform(post("/api/auth/login").with(csrf()).session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(username, password)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/auth/me").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(username));
    }

    @Test
    @DisplayName("로그아웃하면 204이고 그 뒤 /me는 다시 401")
    void logout() throws Exception {
        MockHttpSession session = new MockHttpSession();

        mockMvc.perform(post("/api/auth/login").with(csrf()).session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(username, password)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/auth/logout").with(csrf()).session(session))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/auth/me").session(session))
                .andExpect(status().isUnauthorized());
    }
}

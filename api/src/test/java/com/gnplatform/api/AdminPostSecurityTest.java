package com.gnplatform.api;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

import com.gnplatform.api.domain.Post;
import com.gnplatform.api.dto.LoginRequest;
import com.gnplatform.api.dto.PostRequest;
import com.gnplatform.api.repository.PostRepository;

import tools.jackson.databind.ObjectMapper;

/**
 * 이 티켓을 건너뛰면 아무나 글을 쓰고 지울 수 있으므로,
 * 관리 경로의 GET·POST·PUT·DELETE 각각에 비인증 401과 인증 성공 두 축을 모두 고정합니다.
 */
@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("쓰기 API 인증 보호")
class AdminPostSecurityTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    PostRepository postRepository;

    @Value("${app.admin.username}")
    String adminUsername;

    @Value("${app.admin.password}")
    String adminPassword;

    @BeforeEach
    @AfterEach
    void clear() {
        postRepository.deleteAll();
    }

    private MockHttpSession login() throws Exception {
        MockHttpSession session = new MockHttpSession();
        mockMvc.perform(post("/api/auth/login").with(csrf()).session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new LoginRequest(adminUsername, adminPassword))))
                .andExpect(status().isOk());
        return session;
    }

    private String body() {
        return objectMapper.writeValueAsString(
                new PostRequest("윙바디 유압 누유", "요약", "본문", null, "관리자", true));
    }

    private Long savePost() {
        return postRepository.save(Post.builder()
                .slug("윙바디-유압-누유")
                .title("윙바디 유압 누유")
                .excerpt("요약")
                .content("본문")
                .author("관리자")
                .published(true)
                .build()).getId();
    }

    @Test
    @DisplayName("쿠키 없이 GET /api/admin/posts → 401, 로그인 후 → 200")
    void list() throws Exception {
        mockMvc.perform(get("/api/admin/posts"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("로그인이 필요합니다"));

        mockMvc.perform(get("/api/admin/posts").session(login()))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("쿠키 없이 GET /api/admin/posts/{id} → 401, 로그인 후 → 200")
    void detail() throws Exception {
        Long id = savePost();

        mockMvc.perform(get("/api/admin/posts/" + id))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/admin/posts/" + id).session(login()))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("CSRF 토큰만 있고 세션이 없는 POST /api/admin/posts → 401, 로그인 후 → 201")
    void create() throws Exception {
        mockMvc.perform(post("/api/admin/posts").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body()))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/admin/posts").with(csrf()).session(login())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body()))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("CSRF 토큰만 있고 세션이 없는 PUT /api/admin/posts/{id} → 401, 로그인 후 → 200")
    void update() throws Exception {
        Long id = savePost();

        mockMvc.perform(put("/api/admin/posts/" + id).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body()))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(put("/api/admin/posts/" + id).with(csrf()).session(login())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body()))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("CSRF 토큰만 있고 세션이 없는 DELETE /api/admin/posts/{id} → 401, 로그인 후 → 204")
    void delete_() throws Exception {
        Long id = savePost();

        mockMvc.perform(delete("/api/admin/posts/" + id).with(csrf()))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(delete("/api/admin/posts/" + id).with(csrf()).session(login()))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("비인증 쓰기 요청이 막히면 글이 실제로 생기지 않는다")
    void unauthenticatedWriteDoesNotPersist() throws Exception {
        mockMvc.perform(post("/api/admin/posts").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body()))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/posts"))
                .andExpect(jsonPath("$.content.length()").value(0));
    }

    @Test
    @DisplayName("공개 경로는 로그인 없이도 열려 있다")
    void publicPathsStayOpen() throws Exception {
        savePost();

        mockMvc.perform(get("/api/posts")).andExpect(status().isOk());
        mockMvc.perform(get("/api/posts/윙바디-유압-누유")).andExpect(status().isOk());
        mockMvc.perform(get("/api/contact")).andExpect(status().isOk());
        mockMvc.perform(get("/api/services")).andExpect(status().isOk());
        mockMvc.perform(get("/api/reviews")).andExpect(status().isOk());
    }

    @Test
    @DisplayName("쿠키가 전혀 없는 쓰기 요청은 401이 아니라 403이다")
    void writeWithoutAnyCookieIsForbidden() throws Exception {
        // CsrfFilter가 인가 필터보다 앞에 있어, 토큰이 없으면 인증 여부를 판단하기 전에 막힙니다.
        // 완료 조건 문구는 401이지만 실제 동작은 403이며, 차단된다는 점은 같습니다.
        // 프론트는 세션 만료를 다룰 때 401과 403을 모두 재로그인으로 처리해야 합니다.
        mockMvc.perform(post("/api/admin/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body()))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("접근 권한이 없습니다"));

        mockMvc.perform(get("/api/posts"))
                .andExpect(jsonPath("$.content.length()").value(0));
    }

    @Test
    @DisplayName("로그인해도 CSRF 토큰이 없으면 403이고 로그인 페이지로 리다이렉트하지 않는다")
    void missingCsrfIsForbidden() throws Exception {
        mockMvc.perform(post("/api/admin/posts").session(login())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body()))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("접근 권한이 없습니다"));
    }
}

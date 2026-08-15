package com.gnplatform.api;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
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
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import com.gnplatform.api.dto.LoginRequest;

import tools.jackson.databind.ObjectMapper;

/**
 * 실제 업로드는 외부 스토리지에 의존하므로 검증하지 않고, 인증과 입력 검증만 고정합니다.
 */
@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("이미지 업로드")
class AdminImageControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Value("${app.admin.username}")
    String adminUsername;

    @Value("${app.admin.password}")
    String adminPassword;

    private MockHttpSession login() throws Exception {
        MockHttpSession session = new MockHttpSession();
        mockMvc.perform(post("/api/auth/login").with(csrf()).session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new LoginRequest(adminUsername, adminPassword))))
                .andExpect(status().isOk());
        return session;
    }

    private MockMultipartFile file(String filename, String contentType, byte[] content) {
        return new MockMultipartFile("file", filename, contentType, content);
    }

    @Test
    @DisplayName("로그인하지 않으면 401")
    void unauthenticated() throws Exception {
        mockMvc.perform(multipart("/api/admin/images")
                        .file(file("사진.jpg", "image/jpeg", "이미지".getBytes()))
                        .with(csrf()))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("로그인이 필요합니다"));
    }

    @Test
    @DisplayName("허용되지 않는 타입은 400")
    void disallowedType() throws Exception {
        mockMvc.perform(multipart("/api/admin/images")
                        .file(file("악성.exe", "application/octet-stream", "실행파일".getBytes()))
                        .with(csrf()).session(login()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("지원하지 않는 이미지 형식입니다: exe"));
    }

    @Test
    @DisplayName("확장자만 이미지로 위장한 파일은 400")
    void disguisedExtension() throws Exception {
        mockMvc.perform(multipart("/api/admin/images")
                        .file(file("위장.jpg", "application/x-msdownload", "실행파일".getBytes()))
                        .with(csrf()).session(login()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("확장자와 파일 형식이 일치하지 않습니다"));
    }

    @Test
    @DisplayName("5MB를 넘으면 400")
    void tooLarge() throws Exception {
        byte[] tooBig = new byte[(int) (5 * 1024 * 1024) + 1];

        mockMvc.perform(multipart("/api/admin/images")
                        .file(file("큰사진.jpg", "image/jpeg", tooBig))
                        .with(csrf()).session(login()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("이미지는 5MB를 넘을 수 없습니다"));
    }

    @Test
    @DisplayName("빈 파일은 400")
    void emptyFile() throws Exception {
        mockMvc.perform(multipart("/api/admin/images")
                        .file(file("사진.jpg", "image/jpeg", new byte[0]))
                        .with(csrf()).session(login()))
                .andExpect(status().isBadRequest());
    }
}

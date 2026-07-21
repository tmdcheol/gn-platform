package com.gn.api.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.gn.api.domain.Member;
import com.gn.api.dto.MemberRequest;
import com.gn.api.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MemberRepository repository;

    private Member member;

    @BeforeEach
    void setUp() {
        repository.deleteAll();

        member = repository.save(Member.builder()
                .email("hong@example.com")
                .name("홍길동")
                .password("password1")
                .build());
    }

    @Test
    @DisplayName("GET /api/members - 전체 회원을 조회한다")
    void findAll() throws Exception {
        mockMvc.perform(get("/api/members"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].email").value("hong@example.com"))
                .andExpect(jsonPath("$[0].password").doesNotExist());
    }

    @Test
    @DisplayName("GET /api/members/{id} - 단건 회원을 조회한다")
    void findById() throws Exception {
        mockMvc.perform(get("/api/members/{id}", member.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("hong@example.com"))
                .andExpect(jsonPath("$.name").value("홍길동"));
    }

    @Test
    @DisplayName("GET /api/members/{id} - 존재하지 않으면 404를 반환한다")
    void findByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/members/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/members - 회원을 생성한다")
    void create() throws Exception {
        var request = new MemberRequest("kim@example.com", "김철수", "password2");

        mockMvc.perform(post("/api/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.email").value("kim@example.com"))
                .andExpect(jsonPath("$.name").value("김철수"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/members - 이미 사용 중인 이메일이면 400을 반환한다")
    void createDuplicateEmail() throws Exception {
        var request = new MemberRequest("hong@example.com", "다른이름", "password2");

        mockMvc.perform(post("/api/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/members - 이메일 형식이 잘못되면 400을 반환한다")
    void createWithInvalidEmail() throws Exception {
        var request = new MemberRequest("not-an-email", "김철수", "password2");

        mockMvc.perform(post("/api/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/members - 비밀번호가 8자 미만이면 400을 반환한다")
    void createWithShortPassword() throws Exception {
        var request = new MemberRequest("kim@example.com", "김철수", "123");

        mockMvc.perform(post("/api/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /api/members/{id} - 회원 정보를 수정한다")
    void update() throws Exception {
        var request = new MemberRequest("hong@example.com", "김철수", "newpassword2");

        mockMvc.perform(put("/api/members/{id}", member.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("김철수"));
    }

    @Test
    @DisplayName("DELETE /api/members/{id} - 회원을 삭제한다")
    void deleteMember() throws Exception {
        mockMvc.perform(delete("/api/members/{id}", member.getId()))
                .andExpect(status().isNoContent());
    }
}

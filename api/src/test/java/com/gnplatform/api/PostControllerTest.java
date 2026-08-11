package com.gnplatform.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

import tools.jackson.databind.ObjectMapper;
import com.gnplatform.api.domain.Post;
import com.gnplatform.api.dto.PostRequest;
import com.gnplatform.api.repository.PostRepository;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("게시글 CRUD")
class PostControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    PostRepository postRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    // MockMvc 테스트는 트랜잭션 롤백이 되지 않으므로 다른 테스트에 데이터가 새지 않도록 직접 지웁니다.
    @BeforeEach
    @AfterEach
    void clear() {
        postRepository.deleteAll();
    }

    private String body(String title, boolean published) throws Exception {
        return objectMapper.writeValueAsString(
                new PostRequest(title, "요약", "# 본문", null, "관리자", published));
    }

    private Long savePost(String title, String slug, boolean published) {
        return postRepository.save(Post.builder()
                .slug(slug)
                .title(title)
                .excerpt("요약")
                .content("본문")
                .author("관리자")
                .published(published)
                .build()).getId();
    }

    @Test
    @DisplayName("생성 → 슬러그로 조회 → 수정 → 삭제가 되고, 삭제한 슬러그 조회는 404")
    void fullLifecycle() throws Exception {
        String location = mockMvc.perform(post("/api/admin/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body("윙바디 유압 누유, 원인 3가지", true)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.slug").value("윙바디-유압-누유-원인-3가지"))
                .andReturn().getResponse().getHeader("Location");

        Long id = Long.valueOf(location.substring(location.lastIndexOf('/') + 1));

        mockMvc.perform(get("/api/posts/윙바디-유압-누유-원인-3가지"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("윙바디 유압 누유, 원인 3가지"));

        mockMvc.perform(put("/api/admin/posts/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body("제목을 바꿨습니다", true)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("제목을 바꿨습니다"));

        mockMvc.perform(delete("/api/admin/posts/" + id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/posts/윙바디-유압-누유-원인-3가지"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("수정 시 제목이 바뀌어도 슬러그는 유지된다")
    void slugSurvivesTitleChange() throws Exception {
        Long id = savePost("윙바디 유압 누유", "윙바디-유압-누유", true);

        mockMvc.perform(put("/api/admin/posts/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body("완전히 다른 제목", true)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("윙바디-유압-누유"));

        assertThat(postRepository.findById(id).orElseThrow().getSlug()).isEqualTo("윙바디-유압-누유");
    }

    @Test
    @DisplayName("임시저장 글은 공개 목록에 없고 관리 목록에는 있다")
    void draftHiddenFromPublicList() throws Exception {
        savePost("발행된 글", "발행된-글", true);
        savePost("임시저장 글", "임시저장-글", false);

        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].slug").value("발행된-글"));

        mockMvc.perform(get("/api/admin/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @DisplayName("임시저장 글은 공개 상세로 직접 접근해도 404")
    void draftHiddenFromPublicDetail() throws Exception {
        savePost("임시저장 글", "임시저장-글", false);

        mockMvc.perform(get("/api/posts/임시저장-글"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("임시저장 글도 관리 상세는 id로 조회된다")
    void draftVisibleInAdminDetail() throws Exception {
        Long id = savePost("임시저장 글", "임시저장-글", false);

        mockMvc.perform(get("/api/admin/posts/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.published").value(false));
    }

    @Test
    @DisplayName("공개 목록은 최신순이다")
    void publicListIsNewestFirst() throws Exception {
        savePost("먼저 쓴 글", "먼저-쓴-글", true);
        savePost("나중에 쓴 글", "나중에-쓴-글", true);

        mockMvc.perform(get("/api/posts"))
                .andExpect(jsonPath("$[0].slug").value("나중에-쓴-글"))
                .andExpect(jsonPath("$[1].slug").value("먼저-쓴-글"));
    }

    @Test
    @DisplayName("createdAt이 같아도 목록 순서가 흔들리지 않는다")
    void orderIsStableOnEqualCreatedAt() throws Exception {
        Long first = savePost("먼저 쓴 글", "먼저-쓴-글", true);
        Long second = savePost("나중에 쓴 글", "나중에-쓴-글", true);
        jdbcTemplate.update("UPDATE post SET created_at = (SELECT created_at FROM post WHERE id = ?) WHERE id = ?",
                first, second);

        for (int i = 0; i < 5; i++) {
            mockMvc.perform(get("/api/posts"))
                    .andExpect(jsonPath("$[0].id").value(second.intValue()))
                    .andExpect(jsonPath("$[1].id").value(first.intValue()));
        }
    }

    @Test
    @DisplayName("제목이 비면 400")
    void blankTitleIsBadRequest() throws Exception {
        mockMvc.perform(post("/api/admin/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new PostRequest("  ", "요약", "본문", null, "관리자", true))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.title").value("제목은 필수입니다"));
    }

    @Test
    @DisplayName("본문·작성자가 비어도 400")
    void blankContentOrAuthorIsBadRequest() throws Exception {
        mockMvc.perform(post("/api/admin/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new PostRequest("제목", "요약", null, null, "", true))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.content").value("본문은 필수입니다"))
                .andExpect(jsonPath("$.fieldErrors.author").value("작성자는 필수입니다"));
    }

    @Test
    @DisplayName("요약이 300자를 넘으면 500이 아니라 400")
    void tooLongExcerptIsBadRequest() throws Exception {
        mockMvc.perform(post("/api/admin/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new PostRequest("제목", "요".repeat(301), "본문", null, "관리자", true))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.excerpt").value("요약은 300자를 넘을 수 없습니다"));
    }

    @Test
    @DisplayName("요약이 정확히 300자면 통과한다")
    void exactlyThreeHundredIsOk() throws Exception {
        mockMvc.perform(post("/api/admin/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new PostRequest("제목", "요".repeat(300), "본문", null, "관리자", true))))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("excerpt 없이 생성하면 본문 앞 150자가 요약으로 들어간다")
    void excerptIsGeneratedWhenMissing() throws Exception {
        String content = "가".repeat(300);

        mockMvc.perform(post("/api/admin/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new PostRequest("요약 없는 글", null, content, null, "관리자", true))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.excerpt").value("가".repeat(150)));
    }

    @Test
    @DisplayName("없는 슬러그 조회는 500이 아니라 404")
    void notFoundCases() throws Exception {
        mockMvc.perform(get("/api/posts/없는-슬러그"))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/admin/posts/9999"))
                .andExpect(status().isNotFound());

        mockMvc.perform(put("/api/admin/posts/9999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body("제목", true)))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/admin/posts/9999"))
                .andExpect(status().isNotFound());
    }
}

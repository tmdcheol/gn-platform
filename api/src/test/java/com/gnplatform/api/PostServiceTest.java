package com.gnplatform.api;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.gnplatform.api.domain.Post;
import com.gnplatform.api.repository.PostRepository;
import com.gnplatform.api.service.ports.in.PostService;

@SpringBootTest
@Transactional
@DisplayName("슬러그 중복 회피")
class PostServiceTest {

    @Autowired
    private PostService postService;

    @Autowired
    private PostRepository postRepository;

    private void savePostWithSlug(String slug) {
        postRepository.save(Post.builder()
                .slug(slug)
                .title("윙바디 유압 누유")
                .excerpt("요약")
                .content("본문")
                .author("관리자")
                .published(true)
                .build());
    }

    @Test
    @DisplayName("겹치는 슬러그가 없으면 변환 결과를 그대로 쓴다")
    void noConflict() {
        assertThat(postService.generateUniqueSlug("윙바디 유압 누유"))
                .isEqualTo("윙바디-유압-누유");
    }

    @Test
    @DisplayName("같은 슬러그가 이미 있으면 -2를 붙인다")
    void appendsTwo() {
        savePostWithSlug("윙바디-유압-누유");

        assertThat(postService.generateUniqueSlug("윙바디 유압 누유"))
                .isEqualTo("윙바디-유압-누유-2");
    }

    @Test
    @DisplayName("-2까지 있으면 -3을 붙인다")
    void appendsThree() {
        savePostWithSlug("윙바디-유압-누유");
        savePostWithSlug("윙바디-유압-누유-2");

        assertThat(postService.generateUniqueSlug("윙바디 유압 누유"))
                .isEqualTo("윙바디-유압-누유-3");
    }
}

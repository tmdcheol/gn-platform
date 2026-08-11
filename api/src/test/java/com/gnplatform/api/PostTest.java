package com.gnplatform.api;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.gnplatform.api.domain.Post;

@DisplayName("Post 도메인")
class PostTest {

    /** LocalDateTime.now()가 직전 호출과 같은 값을 돌려주지 않도록 최소한의 간격을 둡니다. */
    private void sleepAMoment() {
        try {
            Thread.sleep(1);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private Post newPost() {
        return Post.builder()
                .slug("윙바디-유압-누유")
                .title("윙바디 유압 누유 증상")
                .excerpt("요약")
                .content("# 본문")
                .thumbnailUrl("/images/a.jpg")
                .author("관리자")
                .published(false)
                .build();
    }

    @Test
    @DisplayName("publish()는 published를 true로 바꾸고 updatedAt을 갱신한다")
    void publish() {
        Post post = newPost();
        LocalDateTime before = post.getUpdatedAt();
        sleepAMoment();

        post.publish();

        assertThat(post.isPublished()).isTrue();
        assertThat(post.getUpdatedAt()).isAfter(before);
    }

    @Test
    @DisplayName("unpublish()는 published를 false로 바꾸고 updatedAt을 갱신한다")
    void unpublish() {
        Post post = newPost();
        post.publish();
        LocalDateTime before = post.getUpdatedAt();
        sleepAMoment();

        post.unpublish();

        assertThat(post.isPublished()).isFalse();
        assertThat(post.getUpdatedAt()).isAfter(before);
    }

    @Test
    @DisplayName("update()는 제목·요약·본문·썸네일을 바꾸고 updatedAt을 갱신한다")
    void update() {
        Post post = newPost();
        LocalDateTime before = post.getUpdatedAt();
        sleepAMoment();

        post.update("바뀐 제목", "바뀐 요약", "## 바뀐 본문", "/images/b.jpg");

        assertThat(post.getTitle()).isEqualTo("바뀐 제목");
        assertThat(post.getExcerpt()).isEqualTo("바뀐 요약");
        assertThat(post.getContent()).isEqualTo("## 바뀐 본문");
        assertThat(post.getThumbnailUrl()).isEqualTo("/images/b.jpg");
        assertThat(post.getUpdatedAt()).isAfter(before);
    }

    @Test
    @DisplayName("update()로 제목을 바꿔도 슬러그는 유지된다")
    void slugNeverChanges() {
        Post post = newPost();

        post.update("바뀐 제목", "요약", "본문", null);

        assertThat(post.getSlug()).isEqualTo("윙바디-유압-누유");
    }

    @Test
    @DisplayName("update()는 createdAt을 바꾸지 않는다")
    void createdAtUnchanged() {
        Post post = newPost();
        LocalDateTime createdAt = post.getCreatedAt();

        post.update("바뀐 제목", "요약", "본문", null);

        assertThat(post.getCreatedAt()).isEqualTo(createdAt);
    }
}

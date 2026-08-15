package com.gnplatform.api;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.gnplatform.api.config.DataInitializer;
import com.gnplatform.api.domain.Post;
import com.gnplatform.api.repository.PostRepository;

@SpringBootTest
@DisplayName("샘플 글 시딩")
class DataInitializerTest {

    private static final int SAMPLE_COUNT = 12;

    @Autowired
    DataInitializer dataInitializer;

    @Autowired
    PostRepository postRepository;

    @BeforeEach
    void clear() {
        postRepository.deleteAll();
    }

    @Test
    @DisplayName("글이 0건이면 샘플 12건을 넣는다")
    void seedsWhenEmpty() {
        dataInitializer.run();

        assertThat(postRepository.count()).isEqualTo(SAMPLE_COUNT);
    }

    @Test
    @DisplayName("두 번 실행해도 12건 그대로다 (재시작해도 24건이 되지 않는다)")
    void doesNotSeedTwice() {
        dataInitializer.run();
        dataInitializer.run();

        assertThat(postRepository.count()).isEqualTo(SAMPLE_COUNT);
    }

    @Test
    @DisplayName("샘플이 한 건이라도 있으면 추가로 넣지 않는다")
    void skipsWhenAnyPostExists() {
        postRepository.save(Post.builder()
                .slug("직접-쓴-글")
                .title("직접 쓴 글")
                .excerpt("요약")
                .content("본문")
                .author("관리자")
                .published(true)
                .build());

        dataInitializer.run();

        assertThat(postRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("샘플은 전부 발행 상태이고 슬러그가 겹치지 않는다")
    void samplesArePublishedWithUniqueSlugs() {
        dataInitializer.run();

        assertThat(postRepository.findAll())
                .allSatisfy(post -> {
                    assertThat(post.isPublished()).isTrue();
                    assertThat(post.getAuthor()).isNotBlank();
                    assertThat(post.getExcerpt()).isNotBlank();
                })
                .extracting(Post::getSlug)
                .doesNotHaveDuplicates();
    }

    @Test
    @DisplayName("본문은 ## 소제목과 목록을 포함한 마크다운이다")
    void samplesAreMarkdown() {
        dataInitializer.run();

        assertThat(postRepository.findAll()).allSatisfy(post -> {
            assertThat(post.getContent()).contains("## ");
            assertThat(post.getContent()).contains("\n- ");
        });
    }

    @Test
    @DisplayName("자동 생성된 요약에는 마크다운 기호가 남지 않는다")
    void excerptsArePlainText() {
        dataInitializer.run();

        assertThat(postRepository.findAll()).allSatisfy(post -> {
            assertThat(post.getExcerpt()).doesNotContain("#", "*", "`");
            assertThat(post.getExcerpt().length()).isLessThanOrEqualTo(300);
        });
    }
}

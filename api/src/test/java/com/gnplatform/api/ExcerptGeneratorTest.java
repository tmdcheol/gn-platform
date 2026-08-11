package com.gnplatform.api;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.gnplatform.api.domain.ExcerptGenerator;

@DisplayName("요약 자동 생성 규칙")
class ExcerptGeneratorTest {

    @Test
    @DisplayName("요약이 있으면 그대로 쓴다")
    void keepsGivenExcerpt() {
        assertThat(ExcerptGenerator.generate("직접 쓴 요약", "본문")).isEqualTo("직접 쓴 요약");
    }

    @Test
    @DisplayName("요약이 비면 본문 앞 150자로 채운다")
    void fillsFromContent() {
        String content = "가".repeat(300);

        assertThat(ExcerptGenerator.generate(null, content)).isEqualTo("가".repeat(150));
    }

    @Test
    @DisplayName("공백뿐인 요약도 비어 있는 것으로 본다")
    void blankExcerptIsEmpty() {
        assertThat(ExcerptGenerator.generate("   ", "윙바디 유압 누유 증상")).isEqualTo("윙바디 유압 누유 증상");
    }

    @Test
    @DisplayName("본문이 150자보다 짧으면 본문 전체를 쓴다")
    void shortContent() {
        assertThat(ExcerptGenerator.generate("", "짧은 본문")).isEqualTo("짧은 본문");
    }

    @Test
    @DisplayName("마크다운 기호는 벗겨내고 텍스트만 남긴다")
    void stripsMarkdown() {
        String content = """
                # 윙바디 유압 누유, 원인 3가지

                ![유압 호스](/images/hose.jpg)

                **호스 노후**가 가장 흔한 원인입니다. [점검 항목](/blog/점검)을 참고하세요.
                """;

        assertThat(ExcerptGenerator.generate(null, content))
                .isEqualTo("윙바디 유압 누유, 원인 3가지 호스 노후가 가장 흔한 원인입니다. 점검 항목을 참고하세요.");
    }

    @Test
    @DisplayName("목록·인용·코드블록 기호도 남지 않는다")
    void stripsListsAndQuotes() {
        String content = """
                > 정비 전 확인하세요

                - 유압 호스 상태
                1. 오일 잔량

                ```java
                System.out.println("코드");
                ```
                """;

        assertThat(ExcerptGenerator.generate(null, content))
                .isEqualTo("정비 전 확인하세요 유압 호스 상태 오일 잔량");
    }

    @Test
    @DisplayName("기호를 벗겨낸 뒤 기준으로 150자를 센다")
    void countsAfterStripping() {
        String content = "# " + "가".repeat(300);

        assertThat(ExcerptGenerator.generate(null, content)).isEqualTo("가".repeat(150));
    }
}

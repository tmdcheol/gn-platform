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
}

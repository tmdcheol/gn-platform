package com.gnplatform.api;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Locale;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.gnplatform.api.domain.SlugGenerator;

@DisplayName("슬러그 생성 규칙")
class SlugGeneratorTest {

    @Test
    @DisplayName("한글 제목의 공백은 -가 되고 기호는 제거된다")
    void koreanTitle() {
        assertThat(SlugGenerator.generate("윙바디 유압 누유, 원인 3가지"))
                .isEqualTo("윙바디-유압-누유-원인-3가지");
    }

    @Test
    @DisplayName("한글은 그대로 남는다")
    void keepsKorean() {
        assertThat(SlugGenerator.generate("냉동탑 수리")).isEqualTo("냉동탑-수리");
    }

    @Test
    @DisplayName("영문은 소문자로 바뀐다")
    void lowercase() {
        assertThat(SlugGenerator.generate("Wing Body Repair")).isEqualTo("wing-body-repair");
    }

    @Test
    @DisplayName("소문자화는 JVM 기본 로케일에 영향받지 않는다")
    void lowercaseIsLocaleIndependent() {
        Locale original = Locale.getDefault();
        try {
            Locale.setDefault(Locale.forLanguageTag("tr"));
            assertThat(SlugGenerator.generate("LIFT 수리")).isEqualTo("lift-수리");
        } finally {
            Locale.setDefault(original);
        }
    }

    @Test
    @DisplayName("연속된 공백·기호는 하나의 -로 축약된다")
    void collapsesSeparators() {
        assertThat(SlugGenerator.generate("탑차   문짝 // 처짐")).isEqualTo("탑차-문짝-처짐");
    }

    @Test
    @DisplayName("앞뒤 -는 제거된다")
    void trimsHyphens() {
        assertThat(SlugGenerator.generate("  !!리프트 고장!!  ")).isEqualTo("리프트-고장");
    }

    @Test
    @DisplayName("허용되지 않는 문자는 제거된다")
    void removesDisallowed() {
        assertThat(SlugGenerator.generate("탑차 @#$% 수리!")).isEqualTo("탑차-수리");
    }

    @Test
    @DisplayName("제목이 기호뿐이면 post-{timestamp}로 대체된다")
    void fallbackWhenEmpty() {
        assertThat(SlugGenerator.generate("!@#$%^&*()")).matches("post-\\d+");
    }
}

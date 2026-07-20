package com.gn.api.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class MemberTest {

    @Test
    @DisplayName("Builder로 Member를 생성할 수 있다")
    void createWithBuilder() {
        Member member = Member.builder()
                .email("hong@example.com")
                .name("홍길동")
                .password("password1")
                .build();

        assertThat(member.getEmail()).isEqualTo("hong@example.com");
        assertThat(member.getName()).isEqualTo("홍길동");
        assertThat(member.getPassword()).isEqualTo("password1");
    }

    @Test
    @DisplayName("생성 시 createdAt과 updatedAt이 자동 설정된다")
    void constructorSetsTimestamps() {
        var before = LocalDateTime.now();

        Member member = Member.builder()
                .email("hong@example.com")
                .name("홍길동")
                .password("password1")
                .build();

        var after = LocalDateTime.now();

        assertThat(member.getCreatedAt()).isNotNull();
        assertThat(member.getUpdatedAt()).isNotNull();
        assertThat(member.getCreatedAt()).isEqualTo(member.getUpdatedAt());
        assertThat(member.getCreatedAt()).isBetween(before, after);
    }

    @Test
    @DisplayName("update로 이름과 비밀번호를 변경할 수 있다")
    void update() {
        Member member = Member.builder()
                .email("hong@example.com")
                .name("홍길동")
                .password("password1")
                .build();

        member.update("김철수", "newpassword2");

        assertThat(member.getName()).isEqualTo("김철수");
        assertThat(member.getPassword()).isEqualTo("newpassword2");
    }

    @Test
    @DisplayName("update 시 updatedAt이 갱신되고 createdAt은 유지된다")
    void updateRefreshesUpdatedAt() throws InterruptedException {
        Member member = Member.builder()
                .email("hong@example.com")
                .name("홍길동")
                .password("password1")
                .build();

        var createdAt = member.getCreatedAt();
        var originalUpdatedAt = member.getUpdatedAt();

        Thread.sleep(10);

        member.update("김철수", "newpassword2");

        assertThat(member.getCreatedAt()).isEqualTo(createdAt);
        assertThat(member.getUpdatedAt()).isAfter(originalUpdatedAt);
    }
}

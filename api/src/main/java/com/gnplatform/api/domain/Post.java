package com.gnplatform.api.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 300)
    private String excerpt;

    /**
     * 요약을 본문에서 자동으로 만들었는지. 관리자가 직접 쓴 요약과 구분해야
     * 수정 화면이 자동 요약을 프리필하지 않고, 본문을 고치면 요약이 따라옵니다.
     */
    @Column(nullable = false)
    private boolean excerptAuto;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String thumbnailUrl;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private boolean published;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    private Post(String slug, String title, String excerpt, boolean excerptAuto, String content,
                 String thumbnailUrl, String author, boolean published) {
        this.slug = slug;
        this.title = title;
        this.excerpt = excerpt;
        this.excerptAuto = excerptAuto;
        this.content = content;
        this.thumbnailUrl = thumbnailUrl;
        this.author = author;
        this.published = published;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    /**
     * 제목·본문 등을 수정합니다. 슬러그는 색인 유지를 위해 바뀌지 않습니다.
     */
    public void update(String title, String excerpt, boolean excerptAuto, String content, String thumbnailUrl) {
        this.title = title;
        this.excerpt = excerpt;
        this.excerptAuto = excerptAuto;
        this.content = content;
        this.thumbnailUrl = thumbnailUrl;
        this.updatedAt = LocalDateTime.now();
    }

    public void publish() {
        this.published = true;
        this.updatedAt = LocalDateTime.now();
    }

    public void unpublish() {
        this.published = false;
        this.updatedAt = LocalDateTime.now();
    }
}

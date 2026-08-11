package com.gnplatform.api.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
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

    @Column(nullable = false)
    private String title;

    @Column(length = 300)
    private String excerpt;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String thumbnailUrl;

    private String author;

    @Column(nullable = false)
    private boolean published;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    private Post(String slug, String title, String excerpt, String content,
                 String thumbnailUrl, String author, boolean published) {
        this.slug = slug;
        this.title = title;
        this.excerpt = excerpt;
        this.content = content;
        this.thumbnailUrl = thumbnailUrl;
        this.author = author;
        this.published = published;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PrePersist
    void onPersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * 제목·본문 등을 수정합니다. 슬러그는 색인 유지를 위해 바뀌지 않습니다.
     */
    public void update(String title, String excerpt, String content, String thumbnailUrl) {
        this.title = title;
        this.excerpt = excerpt;
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

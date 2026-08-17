package com.gnplatform.api.dto;

import java.time.LocalDateTime;

import com.gnplatform.api.domain.Post;

public record PostResponse(
        Long id,
        String slug,
        String title,
        String excerpt,
        /** 요약이 본문에서 자동 생성된 값인지. 관리자 수정 화면이 프리필 여부를 정하는 데 씁니다. */
        boolean excerptAuto,
        String content,
        String thumbnailUrl,
        String author,
        boolean published,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static PostResponse from(Post post) {
        return new PostResponse(
                post.getId(),
                post.getSlug(),
                post.getTitle(),
                post.getExcerpt(),
                post.isExcerptAuto(),
                post.getContent(),
                post.getThumbnailUrl(),
                post.getAuthor(),
                post.isPublished(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}

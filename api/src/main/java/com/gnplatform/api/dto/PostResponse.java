package com.gnplatform.api.dto;

import java.time.LocalDateTime;

import com.gnplatform.api.domain.Post;

public record PostResponse(
        Long id,
        String slug,
        String title,
        String excerpt,
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
                post.getContent(),
                post.getThumbnailUrl(),
                post.getAuthor(),
                post.isPublished(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}

package com.gnplatform.api.dto;

public record PostRequest(
        String title,
        String excerpt,
        String content,
        String thumbnailUrl,
        String author,
        boolean published
) {
}

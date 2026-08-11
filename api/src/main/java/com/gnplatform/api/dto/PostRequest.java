package com.gnplatform.api.dto;

import jakarta.validation.constraints.NotBlank;

public record PostRequest(
        @NotBlank(message = "제목은 필수입니다") String title,
        String excerpt,
        @NotBlank(message = "본문은 필수입니다") String content,
        String thumbnailUrl,
        @NotBlank(message = "작성자는 필수입니다") String author,
        boolean published
) {
}

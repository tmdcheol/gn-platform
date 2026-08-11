package com.gnplatform.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostRequest(
        @NotBlank(message = "제목은 필수입니다") String title,
        @Size(max = 300, message = "요약은 300자를 넘을 수 없습니다") String excerpt,
        @NotBlank(message = "본문은 필수입니다") String content,
        String thumbnailUrl,
        @NotBlank(message = "작성자는 필수입니다") String author,
        boolean published
) {
}

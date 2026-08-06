package com.gnplatform.api.dto;

public record ReviewResponse(
        String author,
        String vehicleType,
        int rating,
        String content
) {
}

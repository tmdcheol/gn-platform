package com.gnplatform.api.dto;

import java.util.List;

public record RepairResponse(
        Long id,
        String slug,
        String title,
        String description,
        String icon,
        String longDescription,
        List<String> symptoms
) {
}

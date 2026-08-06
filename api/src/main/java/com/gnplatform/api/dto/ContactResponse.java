package com.gnplatform.api.dto;

import java.util.List;

public record ContactResponse(
        String phone,
        List<String> callCenter,
        String kakaoOpenChatUrl,
        String address
) {
}

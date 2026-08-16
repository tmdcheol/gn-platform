package com.gnplatform.api.dto;

import java.util.List;

public record RepairResponse(
        Long id,
        String slug,
        String title,
        String description,
        String icon,
        String longDescription,
        List<String> symptoms,
        /**
         * 지역+서비스 쿼리("광주 윙바디 수리")를 노리는 서비스인지.
         * 전국 픽업·견인처럼 지역을 한정하지 않는 서비스는 false입니다.
         */
        boolean regional
) {
}

package com.gnplatform.api.dto;

import java.util.List;

public record ContactResponse(
        String phone,
        List<String> callCenter,
        String kakaoOpenChatUrl,
        /** 화면에 그대로 노출하는 한 줄 주소. */
        String address,
        /** 구조화 데이터(JSON-LD)용으로 쪼갠 주소. address와 같은 값을 나눠 담습니다. */
        String streetAddress,
        String addressLocality,
        String addressRegion,
        /** 영업시간. 구조화 데이터와 화면이 같은 값을 씁니다. */
        List<BusinessHours> businessHours
) {

    /**
     * @param days      요일. schema.org DayOfWeek 값(Monday, Saturday …)
     * @param opens     여는 시각 "HH:mm"
     * @param closes    닫는 시각 "HH:mm"
     */
    public record BusinessHours(List<String> days, String opens, String closes) {
    }
}

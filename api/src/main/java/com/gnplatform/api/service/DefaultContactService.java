package com.gnplatform.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gnplatform.api.dto.ContactResponse;
import com.gnplatform.api.service.ports.in.ContactService;

@Service
public class DefaultContactService implements ContactService {

    private static final String PHONE = "010-5243-3064";
    private static final List<String> CALL_CENTER = List.of("1688-2178", "1666-1347");
    private static final String KAKAO_OPEN_CHAT_URL = "https://open.kakao.com/o/sVPLBe6";
    private static final String ADDRESS = "광주 광산구 지로길 33 공장 (지죽동 127-4)";
    // 위 한 줄 주소를 그대로 쪼갠 값입니다. 구조화 데이터에서 시·구가 중복되지 않도록 나눠 둡니다.
    private static final String STREET_ADDRESS = "지로길 33 공장 (지죽동 127-4)";
    private static final String ADDRESS_LOCALITY = "광산구";
    private static final String ADDRESS_REGION = "광주광역시";
    // 일요일은 휴무라 항목 자체가 없습니다. 없는 요일 = 영업하지 않는 날.
    private static final List<ContactResponse.BusinessHours> BUSINESS_HOURS = List.of(
            new ContactResponse.BusinessHours(
                    List.of("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"), "08:00", "18:00"),
            new ContactResponse.BusinessHours(List.of("Saturday"), "08:00", "13:00"));

    @Override
    public ContactResponse getContact() {
        return new ContactResponse(PHONE, CALL_CENTER, KAKAO_OPEN_CHAT_URL, ADDRESS,
                STREET_ADDRESS, ADDRESS_LOCALITY, ADDRESS_REGION, BUSINESS_HOURS);
    }
}

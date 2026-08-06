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

    @Override
    public ContactResponse getContact() {
        return new ContactResponse(PHONE, CALL_CENTER, KAKAO_OPEN_CHAT_URL, ADDRESS);
    }
}

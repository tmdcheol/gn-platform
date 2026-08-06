package com.gnplatform.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ContactControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/contact 는 실제 연락처 정보를 반환한다")
    void getContact() throws Exception {
        mockMvc.perform(get("/api/contact"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.phone").value("010-5243-3064"))
                .andExpect(jsonPath("$.callCenter.length()").value(2))
                .andExpect(jsonPath("$.callCenter[0]").value("1688-2178"))
                .andExpect(jsonPath("$.callCenter[1]").value("1666-1347"))
                .andExpect(jsonPath("$.kakaoOpenChatUrl").value("https://open.kakao.com/o/sVPLBe6"))
                .andExpect(jsonPath("$.address").value("광주 광산구 지로길 33 공장 (지죽동 127-4)"));
    }
}

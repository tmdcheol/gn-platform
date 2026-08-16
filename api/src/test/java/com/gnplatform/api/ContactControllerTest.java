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
                .andExpect(jsonPath("$.address").value("광주 광산구 지로길 33 공장 (지죽동 127-4)"))
                .andExpect(jsonPath("$.streetAddress").value("지로길 33 공장 (지죽동 127-4)"))
                .andExpect(jsonPath("$.addressLocality").value("광산구"))
                .andExpect(jsonPath("$.addressRegion").value("광주광역시"))
                .andExpect(jsonPath("$.businessHours.length()").value(2))
                .andExpect(jsonPath("$.businessHours[0].days.length()").value(5))
                .andExpect(jsonPath("$.businessHours[0].days[0]").value("Monday"))
                .andExpect(jsonPath("$.businessHours[0].opens").value("08:00"))
                .andExpect(jsonPath("$.businessHours[0].closes").value("18:00"))
                .andExpect(jsonPath("$.businessHours[1].days[0]").value("Saturday"))
                .andExpect(jsonPath("$.businessHours[1].opens").value("08:00"))
                .andExpect(jsonPath("$.businessHours[1].closes").value("13:00"));
    }

    @Test
    @DisplayName("쪼갠 주소를 합치면 한 줄 주소와 같다")
    void addressPartsMatchAddress() throws Exception {
        mockMvc.perform(get("/api/contact"))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    var json = result.getResponse().getContentAsString();
                    var region = com.jayway.jsonpath.JsonPath.<String>read(json, "$.addressRegion");
                    var locality = com.jayway.jsonpath.JsonPath.<String>read(json, "$.addressLocality");
                    var street = com.jayway.jsonpath.JsonPath.<String>read(json, "$.streetAddress");
                    var address = com.jayway.jsonpath.JsonPath.<String>read(json, "$.address");
                    // 한 줄 주소는 "광주"처럼 줄여 쓰므로 접두사만 맞춰 비교합니다.
                    org.assertj.core.api.Assertions.assertThat(address)
                            .startsWith(region.replace("광역시", ""))
                            .contains(locality)
                            .endsWith(street);
                });
    }
}

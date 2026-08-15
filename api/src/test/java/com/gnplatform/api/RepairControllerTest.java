package com.gnplatform.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class RepairControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/services 는 6건 이상의 수리 서비스 목록을 반환한다")
    void getRepairs() throws Exception {
        mockMvc.perform(get("/api/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", Matchers.greaterThanOrEqualTo(6)))
                .andExpect(jsonPath("$[0].id").isNumber())
                .andExpect(jsonPath("$[0].title").value("탑차 수리"))
                .andExpect(jsonPath("$[0].description").isNotEmpty())
                .andExpect(jsonPath("$[0].icon").isNotEmpty());
    }

    @Test
    @DisplayName("GET /api/services/{slug} 는 상세 필드를 반환한다")
    void getRepairBySlug() throws Exception {
        mockMvc.perform(get("/api/services/wing-body"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("wing-body"))
                .andExpect(jsonPath("$.title").value("윙바디 수리"))
                .andExpect(jsonPath("$.longDescription").isNotEmpty())
                .andExpect(jsonPath("$.symptoms.length()", Matchers.greaterThanOrEqualTo(4)))
                .andExpect(jsonPath("$.symptoms[0]").isNotEmpty());
    }

    @Test
    @DisplayName("없는 슬러그는 404")
    void unknownSlug() throws Exception {
        mockMvc.perform(get("/api/services/없는-서비스"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("서비스 상세는 로그인 없이 열려 있다")
    void detailIsPublic() throws Exception {
        mockMvc.perform(get("/api/services/box-truck"))
                .andExpect(status().isOk());
    }
}

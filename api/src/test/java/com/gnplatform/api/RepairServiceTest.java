package com.gnplatform.api;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.gnplatform.api.dto.RepairResponse;
import com.gnplatform.api.service.ports.in.RepairService;

@SpringBootTest
@Transactional
class RepairServiceTest {

    @Autowired
    RepairService repairService;

    @Test
    @DisplayName("수리 서비스 목록을 6건 이상 반환한다")
    void getRepairs() {
        List<RepairResponse> repairs = repairService.getRepairs();

        assertThat(repairs).hasSizeGreaterThanOrEqualTo(6);
    }

    @Test
    @DisplayName("모든 수리 서비스는 id·제목·설명·아이콘을 갖는다")
    void everyRepairHasAllFields() {
        List<RepairResponse> repairs = repairService.getRepairs();

        assertThat(repairs).allSatisfy(repair -> {
            assertThat(repair.id()).isNotNull();
            assertThat(repair.title()).isNotBlank();
            assertThat(repair.description()).isNotBlank();
            assertThat(repair.icon()).isNotBlank();
        });
    }

    @Test
    @DisplayName("수리 서비스 id는 서로 중복되지 않는다")
    void repairIdsAreUnique() {
        List<RepairResponse> repairs = repairService.getRepairs();

        assertThat(repairs).extracting(RepairResponse::id).doesNotHaveDuplicates();
    }
}

package com.gnplatform.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.gnplatform.api.domain.RepairNotFoundException;
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

    @Test
    @DisplayName("슬러그는 서로 중복되지 않고 URL에 쓸 수 있는 형태다")
    void slugsAreUniqueAndUrlSafe() {
        List<RepairResponse> repairs = repairService.getRepairs();

        assertThat(repairs).extracting(RepairResponse::slug).doesNotHaveDuplicates();
        assertThat(repairs).allSatisfy(repair ->
                assertThat(repair.slug()).matches("[a-z0-9-]+"));
    }

    @Test
    @DisplayName("모든 서비스가 상세 설명과 대표 증상 4~6개를 갖는다")
    void everyRepairHasDetail() {
        List<RepairResponse> repairs = repairService.getRepairs();

        assertThat(repairs).allSatisfy(repair -> {
            assertThat(repair.longDescription()).isNotBlank();
            assertThat(repair.symptoms()).hasSizeBetween(4, 6).allSatisfy(
                    symptom -> assertThat(symptom).isNotBlank());
        });
    }

    @Test
    @DisplayName("상세 설명은 3~5문단이다")
    void longDescriptionHasThreeToFiveParagraphs() {
        List<RepairResponse> repairs = repairService.getRepairs();

        assertThat(repairs).allSatisfy(repair -> {
            long paragraphs = repair.longDescription().lines()
                    .filter(line -> !line.isBlank())
                    .count();
            assertThat(paragraphs).isBetween(3L, 5L);
        });
    }

    @Test
    @DisplayName("슬러그로 서비스 상세를 조회한다")
    void getRepairBySlug() {
        RepairResponse repair = repairService.getRepair("wing-body");

        assertThat(repair.title()).isEqualTo("윙바디 수리");
        assertThat(repair.longDescription()).contains("유압");
    }

    @Test
    @DisplayName("없는 슬러그를 조회하면 RepairNotFoundException")
    void unknownSlug() {
        assertThatThrownBy(() -> repairService.getRepair("없는-서비스"))
                .isInstanceOf(RepairNotFoundException.class);
    }
}

package com.gnplatform.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gnplatform.api.dto.RepairResponse;
import com.gnplatform.api.service.ports.in.RepairService;

@Service
public class DefaultRepairService implements RepairService {

    private static final List<RepairResponse> REPAIRS = List.of(
            new RepairResponse(1L, "탑차 수리",
                    "탑 파손·문짝 처짐·바닥 부식까지 탑차 전반을 수리합니다.", "truck"),
            new RepairResponse(2L, "윙바디 수리",
                    "윙 개폐 불량, 유압 실린더·호스 누유, 윙 판넬 교체를 진행합니다.", "wing"),
            new RepairResponse(3L, "냉동탑 수리",
                    "냉동기 성능 저하, 단열 판넬 파손, 냉동탑 방수 시공을 다룹니다.", "snowflake"),
            new RepairResponse(4L, "리프트 수리",
                    "파워게이트 작동 불량, 유압 누유, 리프트 발판 교체를 처리합니다.", "lift"),
            new RepairResponse(5L, "보험·사고 수리",
                    "사고 차량 견적부터 보험사 접수까지 대신 처리해 드립니다.", "shield"),
            new RepairResponse(6L, "무료 대차",
                    "수리 기간 동안 영업이 멈추지 않도록 대차를 무료로 지원합니다.", "car"),
            new RepairResponse(7L, "전국 픽업",
                    "전국 어디든 차량을 무료로 픽업해 입고합니다.", "pickup"),
            new RepairResponse(8L, "전국 견인",
                    "자력 운행이 어려운 차량은 전국 견인으로 안전하게 이송합니다.", "tow")
    );

    @Override
    public List<RepairResponse> getRepairs() {
        return REPAIRS;
    }
}

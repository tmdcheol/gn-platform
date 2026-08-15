package com.gnplatform.api.service.ports.in;

import java.util.List;

import com.gnplatform.api.dto.RepairResponse;

public interface RepairService {

    List<RepairResponse> getRepairs();

    /** 슬러그로 서비스 상세를 조회합니다. 없으면 RepairNotFoundException. */
    RepairResponse getRepair(String slug);
}

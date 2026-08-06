package com.gnplatform.api.service.ports.in;

import java.util.List;

import com.gnplatform.api.dto.RepairResponse;

public interface RepairService {

    List<RepairResponse> getRepairs();
}

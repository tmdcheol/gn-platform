package com.gnplatform.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gnplatform.api.dto.RepairResponse;
import com.gnplatform.api.service.ports.in.RepairService;

@RestController
public class RepairController {

    private final RepairService repairService;

    public RepairController(RepairService repairService) {
        this.repairService = repairService;
    }

    @GetMapping("/api/services")
    public List<RepairResponse> getRepairs() {
        return repairService.getRepairs();
    }
}

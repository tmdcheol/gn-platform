package com.gnplatform.api.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.gnplatform.api.dto.ImageUploadResponse;
import com.gnplatform.api.service.ports.in.ImageService;

/**
 * 이미지 업로드는 관리 경로라 인증이 필요합니다 (T-22의 /api/admin/** 규칙).
 */
@RestController
public class AdminImageController {

    private final ImageService imageService;

    public AdminImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/api/admin/images")
    public ImageUploadResponse upload(@RequestParam("file") MultipartFile file) {
        return imageService.upload(file);
    }
}

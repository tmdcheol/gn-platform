package com.gnplatform.api.service.ports.in;

import org.springframework.web.multipart.MultipartFile;

import com.gnplatform.api.dto.ImageUploadResponse;

public interface ImageService {

    /**
     * 이미지를 오브젝트 스토리지에 올리고 공개 URL을 돌려줍니다.
     * 확장자·MIME·용량 위반 시 InvalidImageException.
     */
    ImageUploadResponse upload(MultipartFile file);
}

package com.gnplatform.api.service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import com.gnplatform.api.config.StorageProperties;
import com.gnplatform.api.domain.ImageFile;
import com.gnplatform.api.domain.InvalidImageException;
import com.gnplatform.api.dto.ImageUploadResponse;
import com.gnplatform.api.service.ports.in.ImageService;

@Service
public class DefaultImageService implements ImageService {

    private static final DateTimeFormatter PATH_DATE = DateTimeFormatter.ofPattern("yyyy/MM");

    private final StorageProperties storageProperties;
    private final RestClient restClient;

    public DefaultImageService(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
        this.restClient = RestClient.create();
    }

    @Override
    public ImageUploadResponse upload(MultipartFile file) {
        String extension = ImageFile.validate(file.getOriginalFilename(), file.getContentType(), file.getSize());

        String objectPath = "%s/%s.%s".formatted(LocalDate.now().format(PATH_DATE), UUID.randomUUID(), extension);
        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new InvalidImageException("이미지를 읽을 수 없습니다");
        }

        restClient.post()
                .uri("%s/storage/v1/object/%s/%s".formatted(
                        storageProperties.url(), storageProperties.bucket(), objectPath))
                // sb_secret_ 형식의 키는 apikey 헤더가 함께 있어야 합니다.
                // Authorization만 보내면 JWT로 해석돼 Invalid Compact JWS로 거부됩니다.
                .header("apikey", storageProperties.serviceKey())
                .header("Authorization", "Bearer " + storageProperties.serviceKey())
                .contentType(MediaType.parseMediaType(file.getContentType()))
                .body(bytes)
                .retrieve()
                .toBodilessEntity();

        return new ImageUploadResponse("%s/storage/v1/object/public/%s/%s".formatted(
                storageProperties.url(), storageProperties.bucket(), objectPath));
    }
}

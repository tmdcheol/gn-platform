package com.gnplatform.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 오브젝트 스토리지(Supabase Storage) 설정. 키는 환경변수로만 주입합니다.
 */
@ConfigurationProperties(prefix = "app.storage")
public record StorageProperties(String url, String bucket, String serviceKey) {
}

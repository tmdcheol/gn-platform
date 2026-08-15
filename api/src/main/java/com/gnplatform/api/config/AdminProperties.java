package com.gnplatform.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 관리자 계정은 1개. 값은 환경변수로만 주입하고 평문·해시 어느 쪽도 커밋하지 않습니다.
 */
@ConfigurationProperties(prefix = "app.admin")
public record AdminProperties(String username, String passwordHash) {
}

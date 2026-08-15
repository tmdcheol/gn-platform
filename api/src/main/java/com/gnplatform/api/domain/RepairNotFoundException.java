package com.gnplatform.api.domain;

public class RepairNotFoundException extends RuntimeException {

    public RepairNotFoundException(String message) {
        super(message);
    }

    public static RepairNotFoundException bySlug(String slug) {
        return new RepairNotFoundException("서비스를 찾을 수 없습니다: slug=" + slug);
    }
}

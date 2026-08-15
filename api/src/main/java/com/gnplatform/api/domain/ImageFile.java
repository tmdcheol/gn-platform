package com.gnplatform.api.domain;

import java.util.Locale;
import java.util.Map;

/**
 * 업로드된 이미지의 검증 규칙. 스토리지에 보내기 전에 여기서 다 걸러냅니다.
 */
public final class ImageFile {

    public static final long MAX_SIZE_BYTES = 5 * 1024 * 1024;

    /** 확장자와 MIME이 서로 맞는지까지 봅니다. */
    private static final Map<String, String> ALLOWED = Map.of(
            "jpg", "image/jpeg",
            "jpeg", "image/jpeg",
            "png", "image/png",
            "webp", "image/webp",
            "gif", "image/gif");

    private ImageFile() {
    }

    /**
     * 위반 시 InvalidImageException. 통과하면 저장에 쓸 확장자를 돌려줍니다.
     */
    public static String validate(String originalFilename, String contentType, long size) {
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new InvalidImageException("파일 이름이 없습니다");
        }
        if (size <= 0) {
            throw new InvalidImageException("빈 파일은 업로드할 수 없습니다");
        }
        if (size > MAX_SIZE_BYTES) {
            throw new InvalidImageException("이미지는 5MB를 넘을 수 없습니다");
        }

        String extension = extensionOf(originalFilename);
        String expectedContentType = ALLOWED.get(extension);
        if (expectedContentType == null) {
            throw new InvalidImageException("지원하지 않는 이미지 형식입니다: " + extension);
        }
        if (contentType == null || !expectedContentType.equals(contentType.toLowerCase(Locale.ROOT))) {
            throw new InvalidImageException("확장자와 파일 형식이 일치하지 않습니다");
        }
        return extension;
    }

    private static String extensionOf(String filename) {
        int dot = filename.lastIndexOf('.');
        if (dot < 0 || dot == filename.length() - 1) {
            return "";
        }
        return filename.substring(dot + 1).toLowerCase(Locale.ROOT);
    }
}

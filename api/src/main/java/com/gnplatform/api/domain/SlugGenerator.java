package com.gnplatform.api.domain;

/**
 * 제목에서 URL 슬러그를 만드는 순수 함수. 한글은 그대로 둡니다.
 * 중복 회피(-2, -3)는 리포지토리가 필요하므로 서비스가 맡습니다.
 */
public final class SlugGenerator {

    private static final String ALLOWED = "[^가-힣ㄱ-ㅎㅏ-ㅣa-z0-9-]";

    private SlugGenerator() {
    }

    public static String generate(String title) {
        String slug = title == null ? "" : title.toLowerCase()
                .replaceAll("\\s+", "-")
                .replaceAll(ALLOWED, "")
                .replaceAll("-{2,}", "-")
                .replaceAll("^-+|-+$", "");

        return slug.isEmpty() ? "post-" + System.currentTimeMillis() : slug;
    }
}

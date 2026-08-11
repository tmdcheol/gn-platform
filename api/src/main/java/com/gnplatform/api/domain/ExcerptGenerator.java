package com.gnplatform.api.domain;

/**
 * 요약을 비워두면 meta description이 비어버리므로 본문 앞부분으로 채웁니다.
 */
public final class ExcerptGenerator {

    private static final int MAX_LENGTH = 150;

    private ExcerptGenerator() {
    }

    public static String generate(String excerpt, String content) {
        if (excerpt != null && !excerpt.isBlank()) {
            return excerpt;
        }
        String plain = content.strip();
        return plain.length() <= MAX_LENGTH ? plain : plain.substring(0, MAX_LENGTH);
    }
}

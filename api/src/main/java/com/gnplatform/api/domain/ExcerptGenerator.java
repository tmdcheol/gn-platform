package com.gnplatform.api.domain;

/**
 * 요약을 비워두면 meta description이 비어버리므로 본문 앞부분으로 채웁니다.
 * 본문은 마크다운 원문이라 기호를 그대로 두면 검색 결과 스니펫에 `#`나 `**`가 노출됩니다.
 */
public final class ExcerptGenerator {

    private static final int MAX_LENGTH = 150;

    private ExcerptGenerator() {
    }

    public static String generate(String excerpt, String content) {
        if (excerpt != null && !excerpt.isBlank()) {
            return excerpt;
        }

        String plain = stripMarkdown(content);
        return plain.length() <= MAX_LENGTH ? plain : plain.substring(0, MAX_LENGTH);
    }

    private static String stripMarkdown(String content) {
        return content
                .replaceAll("(?s)```.*?```", " ")          // 코드 블록
                .replaceAll("!\\[[^\\]]*\\]\\([^)]*\\)", " ")   // 이미지
                .replaceAll("\\[([^\\]]*)\\]\\([^)]*\\)", "$1") // 링크는 표시 텍스트만
                .replaceAll("(?m)^\\s{0,3}#{1,6}\\s+", "")     // 제목
                .replaceAll("(?m)^\\s{0,3}>\\s?", "")          // 인용
                .replaceAll("(?m)^\\s*([-*+]|\\d+\\.)\\s+", "") // 목록 기호
                .replaceAll("(?m)^\\s*[-*_]{3,}\\s*$", " ")    // 구분선
                .replaceAll("[*_~`]", "")                      // 강조·인라인 코드
                .replaceAll("\\s+", " ")                       // 줄바꿈을 공백으로
                .strip();
    }
}

package com.gnplatform.api.domain;

import java.util.ArrayList;
import java.util.List;

/**
 * 요약을 비워두면 meta description이 비어버리므로 본문 앞부분으로 채웁니다.
 * 본문은 마크다운 원문이라 기호를 그대로 두면 검색 결과 스니펫에 `#`나 `**`가 노출됩니다.
 */
public final class ExcerptGenerator {

    private static final int MAX_LENGTH = 150;

    /** 문장이 여기서 끝났다고 보는 문자들. 뒤에 마침표를 덧붙이지 않습니다. */
    private static final String SENTENCE_END = ".!?…:;,";

    private ExcerptGenerator() {
    }

    public static String generate(String excerpt, String content) {
        if (excerpt != null && !excerpt.isBlank()) {
            return excerpt;
        }

        String plain = stripMarkdown(content);
        return plain.length() <= MAX_LENGTH ? plain : plain.substring(0, MAX_LENGTH);
    }

    /**
     * 소제목·목록·인용을 문장 단위로 끊어 이어 붙입니다.
     * 그냥 공백으로 붙이면 "…표가 납니다. 증상 비가 오면 물이 들어온다 날개를 닫아도…"처럼
     * 비문이 됩니다.
     */
    private static String stripMarkdown(String content) {
        String cleaned = content
                .replaceAll("(?s)```.*?```", "\n")              // 코드 블록
                .replaceAll("!\\[[^\\]]*\\]\\([^)]*\\)", " ")   // 이미지
                .replaceAll("\\[([^\\]]*)\\]\\([^)]*\\)", "$1") // 링크는 표시 텍스트만
                .replaceAll("[*_~`]", "");                      // 강조·인라인 코드

        List<String> sentences = new ArrayList<>();
        StringBuilder paragraph = new StringBuilder();

        for (String rawLine : cleaned.split("\n")) {
            String line = rawLine.strip();

            // 소제목은 요약에 넣지 않습니다. 문장이 아니라 이정표라 붙이면 어색합니다.
            boolean isHeading = line.matches("#{1,6}\\s+.*");
            boolean isDivider = line.matches("[-=]{3,}");
            if (line.isEmpty() || isHeading || isDivider) {
                flush(paragraph, sentences);
                continue;
            }

            boolean isListItem = line.matches("([-+]|\\d+\\.)\\s+.*");
            line = line.replaceAll("^>\\s?", "")                 // 인용
                    .replaceAll("^([-+]|\\d+\\.)\\s+", "")       // 목록 기호
                    .strip();

            // 목록은 항목마다 끊고, 문단은 여러 줄이 이어지므로 모았다가 끝에서 끊습니다.
            if (isListItem) {
                flush(paragraph, sentences);
                sentences.add(line);
            } else {
                paragraph.append(paragraph.isEmpty() ? "" : " ").append(line);
            }
        }
        flush(paragraph, sentences);

        return join(sentences).replaceAll("\\s+", " ").strip();
    }

    private static void flush(StringBuilder paragraph, List<String> sentences) {
        if (!paragraph.isEmpty()) {
            sentences.add(paragraph.toString().strip());
            paragraph.setLength(0);
        }
    }

    /** 뒤에 다른 단위가 이어질 때만 문장을 끊습니다. 마지막 단위는 원문 그대로 둡니다. */
    private static String join(List<String> sentences) {
        StringBuilder joined = new StringBuilder();
        for (int i = 0; i < sentences.size(); i++) {
            joined.append(i < sentences.size() - 1
                    ? endSentence(sentences.get(i)) + " "
                    : sentences.get(i));
        }
        return joined.toString();
    }

    private static String endSentence(String text) {
        if (text.isEmpty() || SENTENCE_END.indexOf(text.charAt(text.length() - 1)) >= 0) {
            return text;
        }
        return text + ".";
    }
}

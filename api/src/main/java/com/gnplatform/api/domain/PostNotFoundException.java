package com.gnplatform.api.domain;

public class PostNotFoundException extends RuntimeException {

    public PostNotFoundException(String message) {
        super(message);
    }

    public static PostNotFoundException byId(Long id) {
        return new PostNotFoundException("게시글을 찾을 수 없습니다: id=" + id);
    }

    public static PostNotFoundException bySlug(String slug) {
        return new PostNotFoundException("게시글을 찾을 수 없습니다: slug=" + slug);
    }
}

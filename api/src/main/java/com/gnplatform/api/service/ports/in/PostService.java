package com.gnplatform.api.service.ports.in;

public interface PostService {

    /**
     * 제목으로 슬러그를 만들되, 이미 쓰이고 있으면 -2, -3을 붙여 겹치지 않게 합니다.
     */
    String generateUniqueSlug(String title);
}

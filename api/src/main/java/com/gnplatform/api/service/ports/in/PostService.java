package com.gnplatform.api.service.ports.in;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gnplatform.api.dto.PostRequest;
import com.gnplatform.api.dto.PostResponse;

public interface PostService {

    /**
     * 제목으로 슬러그를 만들되, 이미 쓰이고 있으면 -2, -3을 붙여 겹치지 않게 합니다.
     */
    String generateUniqueSlug(String title);

    /** 공개 목록 — 발행된 글만 최신순, 페이지 단위. */
    Page<PostResponse> getPublishedPosts(Pageable pageable);

    /** 공개 상세 — 발행된 글만 슬러그로. 없으면 PostNotFoundException. */
    PostResponse getPublishedPostBySlug(String slug);

    /** 관리 목록 — 임시저장 포함 전체, 최신순. */
    List<PostResponse> getAllPosts();

    /** 관리 상세 — 임시저장 포함, id로. 없으면 PostNotFoundException. */
    PostResponse getPost(Long id);

    PostResponse create(PostRequest request);

    PostResponse update(Long id, PostRequest request);

    void delete(Long id);
}

package com.gnplatform.api.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gnplatform.api.dto.PostResponse;
import com.gnplatform.api.service.ports.in.PostService;

/**
 * 공개 경로. 임시저장 글은 목록에도 상세에도 나오지 않습니다.
 */
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public Page<PostResponse> getPosts(@RequestParam(required = false) String q,
                                       @PageableDefault(size = 6) Pageable pageable) {
        // 공개 목록은 항상 최신순이고 정렬은 노출하지 않습니다.
        // ?sort=가 들어오면 이미 order by가 있는 조회 쿼리에 정렬이 덧붙어 깨지므로 여기서 버립니다.
        return postService.getPublishedPosts(q,
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize()));
    }

    @GetMapping("/{slug}")
    public PostResponse getPost(@PathVariable String slug) {
        return postService.getPublishedPostBySlug(slug);
    }
}

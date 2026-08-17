package com.gnplatform.api.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    public Page<PostResponse> getPosts(@PageableDefault(size = 6) Pageable pageable) {
        return postService.getPublishedPosts(pageable);
    }

    @GetMapping("/{slug}")
    public PostResponse getPost(@PathVariable String slug) {
        return postService.getPublishedPostBySlug(slug);
    }
}

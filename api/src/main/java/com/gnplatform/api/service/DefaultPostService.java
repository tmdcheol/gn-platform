package com.gnplatform.api.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gnplatform.api.domain.ExcerptGenerator;
import com.gnplatform.api.domain.Post;
import com.gnplatform.api.domain.PostNotFoundException;
import com.gnplatform.api.domain.SlugGenerator;
import com.gnplatform.api.dto.PostRequest;
import com.gnplatform.api.dto.PostResponse;
import com.gnplatform.api.repository.PostRepository;
import com.gnplatform.api.service.ports.in.PostService;

@Service
@Transactional(readOnly = true)
public class DefaultPostService implements PostService {

    private final PostRepository postRepository;

    public DefaultPostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public String generateUniqueSlug(String title) {
        String base = SlugGenerator.generate(title);

        String slug = base;
        int suffix = 1;
        while (postRepository.existsBySlug(slug)) {
            suffix++;
            slug = base + "-" + suffix;
        }
        return slug;
    }

    @Override
    public Page<PostResponse> getPublishedPosts(Pageable pageable) {
        return postRepository.findAllByPublishedTrueOrderByCreatedAtDescIdDesc(pageable)
                .map(PostResponse::from);
    }

    @Override
    public PostResponse getPublishedPostBySlug(String slug) {
        return postRepository.findBySlugAndPublishedTrue(slug)
                .map(PostResponse::from)
                .orElseThrow(() -> PostNotFoundException.bySlug(slug));
    }

    @Override
    public List<PostResponse> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDescIdDesc().stream()
                .map(PostResponse::from)
                .toList();
    }

    @Override
    public PostResponse getPost(Long id) {
        return PostResponse.from(findPost(id));
    }

    @Override
    @Transactional
    public PostResponse create(PostRequest request) {
        Post post = Post.builder()
                .slug(generateUniqueSlug(request.title()))
                .title(request.title())
                .excerpt(ExcerptGenerator.generate(request.excerpt(), request.content()))
                .excerptAuto(isBlank(request.excerpt()))
                .content(request.content())
                .thumbnailUrl(request.thumbnailUrl())
                .author(request.author())
                .published(request.published())
                .build();

        return PostResponse.from(postRepository.save(post));
    }

    @Override
    @Transactional
    public PostResponse update(Long id, PostRequest request) {
        Post post = findPost(id);

        // 제목이 바뀌어도 슬러그는 유지합니다 — URL이 바뀌면 색인이 날아갑니다.
        post.update(request.title(),
                ExcerptGenerator.generate(request.excerpt(), request.content()),
                isBlank(request.excerpt()),
                request.content(),
                request.thumbnailUrl());
        if (request.published() != post.isPublished()) {
            if (request.published()) {
                post.publish();
            } else {
                post.unpublish();
            }
        }
        return PostResponse.from(post);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        postRepository.delete(findPost(id));
    }

    /** 요약을 비워 보내면 본문에서 자동으로 만듭니다. */
    private static boolean isBlank(String excerpt) {
        return excerpt == null || excerpt.isBlank();
    }

    private Post findPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> PostNotFoundException.byId(id));
    }
}

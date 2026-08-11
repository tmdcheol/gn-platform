package com.gnplatform.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gnplatform.api.domain.Post;
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
    public List<PostResponse> getPublishedPosts() {
        return postRepository.findAllByPublishedTrueOrderByCreatedAtDescIdDesc().stream()
                .map(PostResponse::from)
                .toList();
    }

    @Override
    public Optional<PostResponse> getPublishedPostBySlug(String slug) {
        return postRepository.findBySlugAndPublishedTrue(slug).map(PostResponse::from);
    }

    @Override
    public List<PostResponse> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDescIdDesc().stream()
                .map(PostResponse::from)
                .toList();
    }

    @Override
    public Optional<PostResponse> getPost(Long id) {
        return postRepository.findById(id).map(PostResponse::from);
    }

    @Override
    @Transactional
    public PostResponse create(PostRequest request) {
        Post post = Post.builder()
                .slug(generateUniqueSlug(request.title()))
                .title(request.title())
                .excerpt(request.excerpt())
                .content(request.content())
                .thumbnailUrl(request.thumbnailUrl())
                .author(request.author())
                .published(request.published())
                .build();

        return PostResponse.from(postRepository.save(post));
    }

    @Override
    @Transactional
    public Optional<PostResponse> update(Long id, PostRequest request) {
        return postRepository.findById(id).map(post -> {
            // 제목이 바뀌어도 슬러그는 유지합니다 — URL이 바뀌면 색인이 날아갑니다.
            post.update(request.title(), request.excerpt(), request.content(), request.thumbnailUrl());
            if (request.published() != post.isPublished()) {
                if (request.published()) {
                    post.publish();
                } else {
                    post.unpublish();
                }
            }
            return PostResponse.from(post);
        });
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        if (!postRepository.existsById(id)) {
            return false;
        }
        postRepository.deleteById(id);
        return true;
    }
}

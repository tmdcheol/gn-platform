package com.gnplatform.api.service;

import org.springframework.stereotype.Service;

import com.gnplatform.api.domain.SlugGenerator;
import com.gnplatform.api.repository.PostRepository;
import com.gnplatform.api.service.ports.in.PostService;

@Service
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
}

package com.gnplatform.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gnplatform.api.domain.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

    boolean existsBySlug(String slug);
}

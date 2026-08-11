package com.gnplatform.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gnplatform.api.domain.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

    boolean existsBySlug(String slug);

    List<Post> findAllByPublishedTrueOrderByCreatedAtDescIdDesc();

    List<Post> findAllByOrderByCreatedAtDescIdDesc();

    Optional<Post> findBySlugAndPublishedTrue(String slug);
}

package com.gnplatform.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.gnplatform.api.domain.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

    boolean existsBySlug(String slug);

    Page<Post> findAllByPublishedTrueOrderByCreatedAtDescIdDesc(Pageable pageable);

    List<Post> findAllByOrderByCreatedAtDescIdDesc();

    Optional<Post> findBySlugAndPublishedTrue(String slug);
}

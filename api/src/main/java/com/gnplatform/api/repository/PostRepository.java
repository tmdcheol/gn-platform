package com.gnplatform.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gnplatform.api.domain.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

    boolean existsBySlug(String slug);

    Page<Post> findAllByPublishedTrueOrderByCreatedAtDescIdDesc(Pageable pageable);

    /** 검색도 발행된 글만 봅니다. 제목·본문 어느 쪽에 걸려도 결과에 넣습니다. */
    @Query("""
            select p from Post p
            where p.published = true
              and (lower(p.title) like lower(concat('%', :q, '%'))
                or lower(p.content) like lower(concat('%', :q, '%')))
            order by p.createdAt desc, p.id desc
            """)
    Page<Post> searchPublished(@Param("q") String q, Pageable pageable);

    List<Post> findAllByOrderByCreatedAtDescIdDesc();

    Optional<Post> findBySlugAndPublishedTrue(String slug);
}

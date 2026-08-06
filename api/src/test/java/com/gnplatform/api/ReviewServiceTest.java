package com.gnplatform.api;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.gnplatform.api.dto.ReviewResponse;
import com.gnplatform.api.service.ports.in.ReviewService;

@SpringBootTest
@Transactional
class ReviewServiceTest {

    @Autowired
    ReviewService reviewService;

    @Test
    @DisplayName("고객 후기를 5건 반환한다")
    void getReviews() {
        List<ReviewResponse> reviews = reviewService.getReviews();

        assertThat(reviews).hasSize(5);
    }

    @Test
    @DisplayName("모든 후기는 작성자·차량종류·평점·내용을 갖는다")
    void everyReviewHasAllFields() {
        List<ReviewResponse> reviews = reviewService.getReviews();

        assertThat(reviews).allSatisfy(review -> {
            assertThat(review.author()).isNotBlank();
            assertThat(review.vehicleType()).isNotBlank();
            assertThat(review.rating()).isBetween(1, 5);
            assertThat(review.content()).isNotBlank();
        });
    }
}

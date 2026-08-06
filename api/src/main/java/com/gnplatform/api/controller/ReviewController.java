package com.gnplatform.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gnplatform.api.dto.ReviewResponse;
import com.gnplatform.api.service.ports.in.ReviewService;

@RestController
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/api/reviews")
    public List<ReviewResponse> getReviews() {
        return reviewService.getReviews();
    }
}

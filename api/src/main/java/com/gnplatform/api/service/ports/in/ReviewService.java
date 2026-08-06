package com.gnplatform.api.service.ports.in;

import java.util.List;

import com.gnplatform.api.dto.ReviewResponse;

public interface ReviewService {

    List<ReviewResponse> getReviews();
}

package com.gnplatform.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gnplatform.api.dto.ReviewResponse;
import com.gnplatform.api.service.ports.in.ReviewService;

@Service
public class DefaultReviewService implements ReviewService {

    private static final List<ReviewResponse> REVIEWS = List.of(
            new ReviewResponse("김성호", "냉동탑", 5,
                    "냉동기가 멈춰서 급하게 맡겼는데 당일에 봐주셨습니다. 대차까지 내주셔서 영업 공백이 없었어요."),
            new ReviewResponse("이재현", "윙바디", 5,
                    "윙이 한쪽만 안 올라가던 문제를 유압 호스 교체로 잡아주셨습니다. 견적도 미리 정확히 알려주셨어요."),
            new ReviewResponse("박정민", "탑차", 4,
                    "탑 문짝 처짐이 심했는데 깔끔하게 교정됐습니다. 대기 시간이 조금 있었지만 마감은 만족스럽습니다."),
            new ReviewResponse("최동욱", "리프트", 5,
                    "파워게이트가 중간에 멈춰 위험했는데 원인까지 설명해주시고 수리해주셨습니다."),
            new ReviewResponse("정우진", "탑차", 5,
                    "사고 수리라 보험 접수가 걱정이었는데 처리까지 대신 해주셔서 훨씬 수월했습니다.")
    );

    @Override
    public List<ReviewResponse> getReviews() {
        return REVIEWS;
    }
}

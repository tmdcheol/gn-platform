package com.gn.api.dto;

import com.gn.api.domain.Member;
import java.time.LocalDateTime;

public record MemberResponse(
    Long id,
    String email,
    String name,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static MemberResponse from(Member member) {
        return new MemberResponse(
            member.getId(),
            member.getEmail(),
            member.getName(),
            member.getCreatedAt(),
            member.getUpdatedAt()
        );
    }
}

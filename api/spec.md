# GN Platform API Spec

GN특장 웹 서비스의 백엔드 API. 현재는 회원(Member) 기본 기능을 제공한다.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 4.1.0, Java 21, JPA, H2 |
| Build | Gradle (Groovy) |
| API | REST JSON |

## 핵심 기능

### 회원 (Member)

- 회원 생성 / 조회 / 수정 / 삭제
- 이메일 (필수, 고유), 이름 (필수), 비밀번호 (필수, 8자 이상)
- 이메일 중복 시 생성 불가
- 비밀번호는 응답에 노출하지 않음

## 데이터 모델

### Member

| Field | Type | 비고 |
|-------|------|------|
| id | Long | PK, auto |
| email | String | 필수, 고유(unique) |
| name | String | 필수 |
| password | String | 필수 (해싱은 향후) |
| createdAt | LocalDateTime | |
| updatedAt | LocalDateTime | |

## API 설계

### Members

| Method | Path | 설명 |
|--------|------|------|
| GET | /api/members | 전체 회원 조회 |
| GET | /api/members/{id} | 회원 단건 조회 |
| POST | /api/members | 회원 생성 |
| PUT | /api/members/{id} | 회원 수정 (이름/비밀번호) |
| DELETE | /api/members/{id} | 회원 삭제 |

상세 계약은 `openapi.yml` 참고.

## 제외 범위 (이후)

- 사용자 인증 / 로그인 / JWT
- 비밀번호 해싱 (BCrypt)
- 권한 / 역할 (Role)
- 이메일 인증 / 비밀번호 재설정
- PostgreSQL 실제 연동 (현재 H2)

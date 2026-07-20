# Spec: 회원(Member) 도메인

> 기능 명세. 무엇을 / 왜.

## 배경 / 목적
회원 기능은 서비스의 필수 기반이다. 인프라(Repository/Service/Controller)나 인증을 붙이기 전에, **회원 도메인(Member)** 을 먼저 명확히 모델링하고 테스트로 불변식을 고정한다. 도메인부터 견고하게 세워 이후 계층을 안전하게 확장한다.

## 범위
### 포함
- Member 도메인(JPA 엔티티) 정의
- 도메인 생성 규칙(불변식) 및 그에 대한 테스트

### 미포함 (다음 단계)
- Repository / Service / Controller
- 회원 가입 API, 목록/조회 API
- 비밀번호 해싱, 로그인, JWT
- DB 실제 연동(운영), PostgreSQL

## 도메인 모델
`Member` — 회원을 표현하는 엔티티. **Builder 패턴**으로 생성한다.

| 필드 | 타입 | 설명 / 제약 |
|------|------|-------------|
| id | Long | 식별자(PK), 영속화 시 자동 생성 |
| email | String | 필수(not null), 고유(unique) |
| name | String | 필수(not null) |
| password | String | 필수(not null), 해싱은 상위 계층 책임 |
| createdAt | LocalDateTime | 생성 시각, 생성 시 자동 설정 |
| updatedAt | LocalDateTime | 수정 시각, 생성 시 createdAt과 동일하게 설정, update 시 갱신 |

## 도메인 규칙
- `Member.builder().email(..).name(..).password(..).build()` 로 생성한다.
- 생성 시 createdAt, updatedAt 이 현재 시각으로 동일하게 설정된다.
- `update(name, password)` 로 이름·비밀번호를 변경하면 updatedAt 이 갱신되고 createdAt 은 유지된다.
- email 은 시스템 내에서 고유하다 (DB 유니크 제약으로 보장, 중복 검사 로직은 다음 단계).

## 수용 기준
- [ ] Builder 로 Member 를 생성할 수 있다.
- [ ] 생성 시 createdAt, updatedAt 이 null 이 아니고 서로 같다.
- [ ] update 시 name/password 가 바뀌고 updatedAt 이 갱신되며 createdAt 은 유지된다.

## 미해결 질문
- 없음 (도메인 범위 확정)

# GN Platform API Tasks

## Phase 1: 회원(Member) 기본 CRUD

### 1-1. Domain
- [x] `Member` 엔티티 생성 (id, email, name, password, createdAt, updatedAt)
- [x] `@Builder` 생성자 + `update(name, password)` 메서드
- [x] `MemberTest` 순수 단위 테스트

### 1-2. Repository
- [x] `MemberRepository` (findByEmail, existsByEmail)

### 1-3. Service
- [x] `MemberService` 인터페이스 (service.ports.in)
- [x] `DefaultMemberService` 구현 (이메일 중복 검사)
- [x] `DefaultMemberServiceTest` (@SpringBootTest @Transactional)

### 1-4. Controller
- [x] `MemberRequest`(검증) / `MemberResponse` DTO
- [x] `MemberController` (GET 목록·단건, POST, PUT, DELETE)
- [x] `GlobalExceptionHandler` (404 / 400 / 500)
- [x] `MemberControllerTest` (@SpringBootTest @AutoConfigureMockMvc @Transactional)

### 1-5. API 문서 & 검증
- [x] `openapi.yml` 로 회원 API 문서화
- [x] `./gradlew build` 통과

---

## Phase 2: 인증 (예정)
- [ ] 비밀번호 BCrypt 해싱
- [ ] 로그인 / JWT
- [ ] 엔드포인트 보호

## Phase 3: PostgreSQL 전환 (예정)
- [ ] H2 → PostgreSQL datasource 교체

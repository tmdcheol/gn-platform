# GN Platform API 개발 계획

## 기술 스택 상세

### Backend
- **Spring Boot 4.1.0** / Java 21
- **Spring Data JPA** + **H2** (in-memory), PostgreSQL 드라이버 포함 (향후 전환)
- **Lombok** - 보일러플레이트 제거
- **Gradle (Groovy)** - 빌드
- 패키지 구조: `com.gn.api.{domain,repository,service,service.ports.in,controller,dto}`

### 개발 환경
- Backend: `localhost:8080`

---

## Phase 1: 회원(Member) 기본 CRUD

가장 단순한 형태의 회원 API를 계층별로 구현한다.

### 1-1. Domain
- `Member` 엔티티 (id, email, name, password, createdAt, updatedAt)
- `@Builder` 생성자, `update(name, password)` 메서드
- 순수 단위 테스트로 불변식 검증

### 1-2. Repository
- `MemberRepository` (JpaRepository, `findByEmail`, `existsByEmail`)

### 1-3. Service
- `service.ports.in.MemberService` 인터페이스
- `DefaultMemberService` 구현 (이메일 중복 검사, `@Transactional`)
- `@SpringBootTest` 통합 테스트

### 1-4. Controller
- `MemberController` (GET 목록·단건, POST 생성, PUT 수정, DELETE 삭제)
- `MemberRequest`(검증) / `MemberResponse` DTO
- `GlobalExceptionHandler` (404 / 400 / 500)
- `@SpringBootTest @AutoConfigureMockMvc` 통합 테스트

### 1-5. API 문서 & 검증
- `openapi.yml` 로 API 계약 문서화
- `./gradlew build` 통과, curl 로 CRUD 동작 확인

---

## Phase 2: 인증 (예정)

- 비밀번호 BCrypt 해싱
- 로그인 / JWT 발급·검증
- 인증 필요한 엔드포인트 보호

## Phase 3: PostgreSQL 전환 (예정)

- H2 → PostgreSQL datasource 교체
- 마이그레이션 도구 도입 검토

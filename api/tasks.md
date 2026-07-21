# Tasks: 회원(Member) 도메인

> 구현 · 테스트 리스트. 완료 시 `- [x]`.

## 구현
- [x] 1. `com.gn.api.domain.Member` 엔티티 작성 (필드, JPA 매핑, `@Builder`)
- [x] 2. 생성자에서 createdAt/updatedAt 자동 설정
- [x] 3. `update(name, password)` 메서드 (updatedAt 갱신)

## 테스트
- [x] 4. Builder 로 Member 생성 성공
- [x] 5. 생성 시 createdAt/updatedAt 자동 설정되고 서로 같음
- [x] 6. update 로 name/password 변경
- [x] 7. update 시 updatedAt 갱신 + createdAt 유지

## 검증
- [x] 8. `./gradlew test` 통과

## Repository
- [x] 9. `com.gn.api.repository.MemberRepository` (JpaRepository, findByEmail/existsByEmail)

## Service
- [x] 10. `service.ports.in.MemberService` 인터페이스 (findAll/findById/create/update/delete)
- [x] 11. `service.DefaultMemberService` 구현체 (이메일 중복 검사 포함)
- [x] 12. `DefaultMemberServiceTest` (@SpringBootTest @Transactional 통합 테스트)

## Controller
- [x] 13. DTO `MemberRequest`(검증) / `MemberResponse`(from)
- [x] 14. `MemberController` (GET 목록·단건, POST 생성, PUT 수정, DELETE 삭제)
- [x] 15. `SecurityConfig` (/api/** permitAll, csrf disable), `GlobalExceptionHandler` (400/404/409)
- [x] 16. `MemberControllerTest` (@SpringBootTest @AutoConfigureMockMvc @Transactional)
- [x] 17. `openapi.yml` — 회원 API를 OpenAPI 3.0 표준 형식으로 문서화 (컨트롤러 계약과 일치)

## 진행 메모
- 도메인 → Repository → Service → Controller 순으로 구현.
- 서비스는 포트/어댑터 구조: 인터페이스는 `service/ports/in`, 구현체는 `Default` 접두어.
- 예외 매핑: 검증실패 400, NoSuchElementException 404, IllegalStateException(중복 이메일) 409.
- 비밀번호 해싱/로그인/JWT는 아직 미구현(password는 현재 평문 저장).
- 프로젝트 도메인 컨벤션(예시 Reminder)에 맞춰 @Builder + createdAt/updatedAt + update 메서드 형식 채택.
- Repository JPA 테스트는 생략(파생 쿼리 위주라 별도 검증 불필요).

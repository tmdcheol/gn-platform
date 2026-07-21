# Coding Conventions

## 패키지 구조
- `domain`: 엔티티 클래스
- `service.ports.in`: Service 인터페이스
- `service`: Service 구현 클래스 (`Default` 접두사)
- `repository`: JPA Repository
- `controller`: REST Controller, `GlobalExceptionHandler`
- `dto`: DTO 클래스

## 도메인
- `@Entity @Getter @NoArgsConstructor(access = PROTECTED)`, setter 없음
- 생성은 `@Builder` 생성자에서 `createdAt = updatedAt = now`
- 상태 변경은 `update(...)` 메서드로만 하고 그 안에서 `updatedAt` 갱신

## Service
- 인터페이스는 `ports.in` 패키지에 정의
- 구현 클래스는 `service` 패키지에 `Default` 접두사 (예: `DefaultMemberService`)
- `@Service @RequiredArgsConstructor @Transactional(readOnly = true)`, 쓰기 메서드에 `@Transactional`
- 조회 실패 시 `NoSuchElementException`

## 테스트
- 기능 추가/수정 시 반드시 검증 테스트를 함께 작성
- 도메인 엔티티 테스트는 순수 단위 테스트 (JPA, Spring Context 의존 금지)
- Service/Controller 테스트는 `@SpringBootTest` + `@Transactional` 통합 테스트 (Mock 사용 금지)
- Controller 테스트는 `@AutoConfigureMockMvc` + MockMvc + `tools.jackson.databind.ObjectMapper`

## 예외 처리
- `controller.GlobalExceptionHandler` 에서 처리
- `NoSuchElementException` → 404, `IllegalStateException`/`IllegalArgumentException`/검증 실패 → 400, 그 외 → 500
- 응답 형식: `{ "error": message, "timestamp": ... }`

## API 문서
- API 계약은 `openapi.yml`(OpenAPI 3.0)에 표준 형식으로 유지. 컨트롤러 변경 시 함께 갱신.

## 참고 문서
- spec.md: 기능 명세
- plan.md: 개발 계획
- tasks.md: 구현 태스크 체크리스트

## Git
- 커밋 메시지는 한글로 한 일만 간결히 (type prefix·Co-Authored-By 없음), 커밋/푸시는 요청 시에만

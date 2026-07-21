# CLAUDE.md — gn-platform api

## 프로젝트
- gn-platform 모노레포. git은 루트(`gn-platform/`)에서 관리. `api/`(Spring Boot), `web/`(Next.js, 아직 빈 상태).
- api 스택: **Spring Boot 4.1.0 / Java 21 / Gradle(Groovy)**. Spring Web(MVC), Data JPA, Security, Validation, Actuator, Lombok.
- DB: 개발용 **H2 인메모리**(`application.yml`). PostgreSQL 드라이버는 포함되어 있고 향후 전환 예정.

## 개발 방식 (Spec-Driven)
- `api/spec.md`(기능 명세) → `api/plan.md`(개발 계획) → `api/tasks.md`(구현·테스트 리스트) 순으로 작성 후 구현.
- 현재 진행 기능 기준으로 세 파일을 갱신. 자세한 규칙은 `api/docs/README.md`.

## 도메인 컨벤션
- 엔티티는 `com.gn.api.domain` 에. `@Entity @Getter @NoArgsConstructor(access = PROTECTED)`, setter 없음.
- 생성은 **`@Builder` 생성자**. 생성 시 `createdAt = updatedAt = LocalDateTime.now()`.
- 상태 변경은 `update(...)` 메서드로만 하고 그 안에서 `updatedAt` 갱신.
- 도메인 단위 테스트 필수(JUnit + AssertJ, Spring 컨텍스트 없이).
- Repository는 `com.gn.api.repository`, Service는 포트/어댑터 구조: 인터페이스 `service.ports.in`, 구현체는 `service` 에 `Default` 접두어(`@Service @RequiredArgsConstructor @Transactional(readOnly=true)`, 쓰기 메서드에 `@Transactional`).
- Service 테스트는 `@SpringBootTest @Transactional` 통합 테스트로 작성(실제 Repository 주입, `@BeforeEach` 에서 `deleteAll()`). Mockito 목킹 대신 실제 계층으로 검증.

## Spring Boot 4 주의점 (3.x와 다름)
- Jackson **3.x** — 패키지가 `com.fasterxml.jackson` 이 아니라 **`tools.jackson`**.
- 자동설정 클래스 재배치 (예: `org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration`).
- MockMvc 애노테이션: `org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc`.
- 테스트 스타터가 기능별로 분리(`spring-boot-starter-webmvc-test` 등).
- Spring Initializr 다운로드 시 bootVersion은 `4.1.0`(뒤에 `.RELEASE` 붙이면 실패).

## 명령
- 빌드/테스트: `./gradlew build`, `./gradlew test`
- 실행: `./gradlew bootRun` (8080). Security 기본 보호로 미인증 요청은 401이 정상.

## 작업 규칙
- **커밋 메시지는 한글로 한 일만 간결히** 적는다. `기능:`, `설정:` 같은 접두어(type prefix) 쓰지 않는다. `Co-Authored-By` 트레일러도 넣지 않는다.
- 커밋/푸시는 사용자가 요청할 때만.

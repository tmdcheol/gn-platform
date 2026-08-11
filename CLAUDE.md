# CLAUDE.md

특장차(탑차/윙바디/냉동탑/리프트) 수리 전문점의 **실서비스** 웹사이트. `web/`(Next.js 16) + `api/`(Spring Boot 4)를 각 디렉터리에서 독립 실행하며, 웹이 동작하려면 두 서버가 다 떠 있어야 합니다.

## 스펙은 ASSIGNMENT.md

요구사항의 단일 출처는 루트 `ASSIGNMENT.md`의 **티켓 T-01 ~ T-52**입니다. 작업 전에 해당 티켓 본문을 읽으세요 — 연락처 실제 값, API 응답 스펙, 완료 조건이 전부 거기 있습니다. 여기에 옮겨 적지 않는 이유는 두 곳이 어긋나는 걸 막기 위해서입니다.

**T-01 ~ T-16은 완료됐습니다.** T-17부터는 "검색 유입용 콘텐츠 마케팅 사이트, 글은 관리자만 작성"이라는 목적에 맞춰 재설계된 스펙입니다.

**요청받은 티켓 범위만 구현합니다.** 뒤 티켓의 기능을 앞질러 넣지 마세요 (T-19 CRUD에 인증 → 그건 T-22, 목록에 페이지네이션 → 그건 T-39).

## 티켓 본문에 묻혀 있는 전역 제약

- 웹 폼은 `'use client'` + `useState`. **폼 라이브러리 금지.** 라이트박스 등 UI도 **라이브러리 없이 직접 구현.**
  유일한 예외는 마크다운 렌더링 — `react-markdown` + `remark-gfm`을 쓰고 **`rehype-raw`는 켜지 않습니다**(XSS).
- 설정 파일은 전부 YAML. `application.properties`를 만들지 마세요.
- 하드코딩 금지: 연락처는 `/api/contact`에서만, API 주소는 `NEXT_PUBLIC_API_BASE_URL` + `web/src/lib/api.ts` 래퍼로만, CORS 오리진은 `application.yml`에서만. **유일한 예외는 T-46의 fallback 연락처.**
  관리자 계정·스토리지 키 같은 시크릿은 yml에 값이 아니라 `${ENV_VAR}` 참조만 둡니다.
- 목록 상태(`q`, `page`)는 URL 쿼리스트링으로 관리. 로딩·에러 상태는 항상 렌더링합니다.

## 이 사이트의 목적 = 검색 유입

블로그는 사내 게시판이 아니라 **검색 유입용 콘텐츠 채널**이고, 글은 **관리자만** 씁니다. 여기서 나오는 불변 규칙:

- **공개 블로그 화면은 전부 서버 컴포넌트에서 `await` fetch.** `useEffect` + `fetch`는 크롤러에 빈 페이지를 보냅니다.
- **`published=false` 글은 공개 목록·공개 상세·검색·사이트맵 어디에도 나오지 않습니다.**
- 공개 경로는 `/api/posts/**`, 관리 경로는 `/api/admin/**`. **쓰기는 전부 `/api/admin/**`이고 인증이 필요합니다.**
- 공개 화면에 글쓰기·수정·삭제 버튼을 두지 않습니다. 작성은 `/admin`에서만.
- **슬러그는 한 번 정해지면 바뀌지 않습니다.** 제목을 수정해도 유지 — URL이 바뀌면 그동안의 색인이 날아갑니다.
- 관리자 비밀번호는 BCrypt 해시로만 다루고, 평문·해시 **어느 쪽도 커밋하지 않습니다.**

## API 컨벤션

`com.gnplatform.api` 아래 계층별 패키지: `domain`(JPA 엔티티, 상태 변경 로직은 서비스가 아니라 여기에) · `service/ports/in`(인터페이스) · `service`(구현, **`Default` 접두사**) · `repository` · `controller`(+`GlobalExceptionHandler`) · `dto`(요청/응답 `record`) · `config`.

컨트롤러는 리포지토리가 아니라 서비스 인터페이스만 호출하고, 엔티티를 그대로 노출하지 않습니다.

엔티티는 Lombok으로 `@Getter` + `@Builder` + `@NoArgsConstructor(access = AccessLevel.PROTECTED)`. **setter는 만들지 않고**, 상태 변경은 의미 있는 이름의 도메인 메서드로 합니다. `dto`의 `record`에는 Lombok을 쓰지 않습니다.

**테스트는 코드와 같은 커밋에. 목(Mock)·`@MockBean` 금지.**
도메인은 스프링 없는 순수 단위 테스트, 서비스는 `@SpringBootTest` + `@Transactional`, 컨트롤러는 `@SpringBootTest` + `@AutoConfigureMockMvc`. `@DisplayName`은 한글, 단언은 AssertJ.
단일 테스트는 `cd api && ./gradlew test --tests 'com.gnplatform.api.PostControllerTest'`.

**각 티켓의 완료 조건을 그대로 테스트로 옮깁니다.** 통합 테스트는 개발용 H2 파일(`api/data/`)을 건드리지 않도록 인메모리 H2를 쓰는 `src/test/resources/application-test.yml` 프로필로 돌립니다(T-17에서 생성). `web`은 테스트 러너 없이 브라우저 육안 확인입니다.

Spring Boot 4에서 패키지가 옮겨졌습니다. `AutoConfigureMockMvc`는 `org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc`에서 임포트하세요 (`...boot.test.autoconfigure.web.servlet`이 아닙니다).

## 기타

- 이 Next.js 16은 학습 데이터와 API·규약이 다를 수 있습니다. 애매하면 `web/node_modules/next/dist/docs/`를 먼저 읽으세요. `web/AGENTS.md`의 자동 생성 블록은 지우지 말고 그대로 커밋합니다.
- 커밋 메시지는 한글, `Co-Authored-By` 트레일러 없이.

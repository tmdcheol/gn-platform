# 과제: 특장차 수리 전문점 반응형 웹사이트

> ⚠️ **연습용 토이 프로젝트가 아니라 실제로 운영할 서비스입니다. 완성은 필수입니다.**
> 실제 고객이 이 사이트를 보고 전화를 걸고 카톡을 보냅니다. 티켓 전부를 통과해야 끝난 것입니다.
>
> 다만 **작업 방식**은, 코드를 직접 타이핑하지 말고 Claude Code에게 시키세요.
> 시키고 → 결과를 읽고 → 마음에 안 들면 다시 요청하는 흐름을 익히는 것이 부수적 목표입니다.

- **주제 참고**: https://gn2021.com/ (특장차 = 탑차 / 윙바디 / 냉동탑 / 리프트 수리 전문점)
  → **주제와 사업 정보만 참고**하고 UI/UX는 요즘 잘 만든 서비스를 보고 **새로 디자인**합니다. 기존 사이트를 베끼지 마세요.
- **실제 연락처** (더미 금지, 반드시 정확히 반영)
  - 휴대전화 `010-5243-3064` / 콜센터 `1688-2178`, `1666-1347`
  - 카카오톡 오픈채팅 **https://open.kakao.com/o/sVPLBe6**
  - 주소: 광주 광산구 지로길 33 공장 (지죽동 127-4)
- **예상 소요**: 6~8시간
- **난이도**: 하 (개별 티켓은 전부 30분 이내 분량입니다. 개수가 많을 뿐입니다)

---

## 0. 작업 방식

### 티켓 단위로 진행합니다

아래에 **38개의 작은 티켓**이 있습니다. 각 티켓은 **하나의 Claude Code 요청 = 하나의 커밋**입니다.

```
티켓 하나 읽기 → Claude Code에 요청 → 완료 조건 직접 확인 → 커밋 → 다음 티켓
```

**규칙**

- 티켓 **하나씩만** 요청하세요. "T-11부터 T-16까지 해줘" 같은 요청은 반드시 꼬입니다.
- **완료 조건을 눈으로 확인하기 전에는 다음으로 넘어가지 마세요.** 브라우저를 열거나 `curl`을 치세요.
- 티켓마다 커밋하세요. 최소 38커밋이 남습니다.
- 순서를 바꿔도 되지만, **단계는 순서대로** 가세요 (앞 단계가 뒤 단계의 재료입니다).

### 테스트 코드는 항상 함께 작성합니다 (api)

**`api` 티켓은 테스트 없이 커밋하지 않습니다.** 코드와 같은 커밋에 테스트가 들어갑니다.

- **도메인 테스트는 순수 단위 테스트로.** 스프링 컨텍스트도, JPA도, DB도 쓰지 않습니다.
  `new`(또는 빌더)로 객체를 만들어 도메인 규칙만 검증합니다.
- **서비스 테스트는 `@SpringBootTest` + `@Transactional` 통합 테스트로.**
  실제 리포지토리를 그대로 쓰고, **목(Mock)·`@MockBean`·가짜 구현을 쓰지 마세요.**
  동작하는 것을 검증해야지, 내가 짠 가짜가 동작하는 것을 검증하면 의미가 없습니다.
- **컨트롤러 테스트는 `@SpringBootTest` + `@AutoConfigureMockMvc`로** 상태코드·응답 JSON 검증 (요청부터 DB까지 관통).
- `@DisplayName`은 한글로, 단언은 AssertJ로.
- **각 티켓의 완료 조건을 그대로 테스트로 옮기세요.** "삭제한 id 조회 시 404"가 완료 조건이면 그걸 검증하는 테스트가 있어야 합니다.
  `curl`로 눈으로 확인하는 것은 그대로 하되, 테스트가 그것을 대체하는 게 아니라 **고정**합니다.

통합 테스트가 개발용 H2 파일(`api/data/`)을 건드리지 않도록, 테스트는 인메모리 H2를 쓰는
별도 프로필(`src/test/resources/application-test.yml`)로 돌립니다. (T-17에서 H2 설정을 할 때 같이 만드세요)

> ✅ 모든 api 티켓의 공통 완료 조건: `cd api && ./gradlew test` 가 통과한다

`web`은 테스트 러너를 따로 두지 않고 브라우저 육안 확인으로 갑니다.

### 진행 현황

| 단계 | 티켓 | 내용 |
|---|---|---|
| 1 | T-01 ~ T-04 | 프로젝트 세팅 |
| 2 | T-05 ~ T-16 | 콘텐츠 API + 메인 랜딩 + **전화/카톡 버튼** |
| 3 | T-17 ~ T-25 | 블로그 CRUD + 블로그 화면 |
| 4 | T-26 ~ T-34 | 페이지네이션·검색 · 갤러리 · 다크모드 · 마감 |
| 5 | T-35 ~ T-38 | 배포 및 실기기 검증 |

---

# 단계 1 — 프로젝트 세팅

### T-01. `web` 프로젝트 생성

```bash
npx create-next-app@latest web
```
선택: **TypeScript ✅ / ESLint ✅ / Tailwind CSS ✅ / `src/` ✅ / App Router ✅ / Turbopack ✅**

> ✅ 완료 조건: `cd web && npm run dev` → http://localhost:3000 에 기본 페이지가 뜬다

---

### T-02. `api` 프로젝트 생성

**반드시 [Spring Initializr](https://start.spring.io)로 생성합니다.**

| 항목 | 값 |
|---|---|
| Project | Gradle - Kotlin |
| Language | Java |
| Spring Boot | 4.x (기본값) |
| Java | **21** |
| Packaging | Jar |
| Group | `com.gnplatform` |
| Artifact / Name | `api` |
| Dependencies | `Spring Web`, `Spring Data JPA`, `H2 Database`, `Validation`, `Lombok` |

터미널로 만들어도 됩니다:

```bash
curl https://start.spring.io/starter.zip \
  -d type=gradle-project-kotlin -d language=java -d javaVersion=21 \
  -d dependencies=web,data-jpa,h2,validation,lombok \
  -d name=api -d artifactId=api -d groupId=com.gnplatform \
  -d packageName=com.gnplatform.api \
  -o api.zip && unzip api.zip -d api && rm api.zip
```

생성 직후 `src/main/resources/application.properties`를 **삭제하고 `application.yml`로 바꾸세요.**
(이 프로젝트는 설정 파일을 전부 **yml**로 통일합니다)

```yaml
spring:
  application:
    name: api
```

> ✅ 완료 조건: `cd api && ./gradlew bootRun` → http://localhost:8080 에서 기동 로그가 뜬다 (404여도 정상)

---

### T-03. git 초기화 + `.gitignore` + 첫 커밋

```bash
cd gn-platform && git init
```

`.gitignore`에 최소한 이것들: `node_modules`, `.next`, `build`, `.gradle`, `api/data`, `.env*`

> ✅ 완료 조건: `git status`에 `node_modules`가 안 보인다 / 첫 커밋 완료

---

### T-04. `CLAUDE.md` 생성

Claude Code에서 `/init` 실행.

> ✅ 완료 조건: 루트에 `CLAUDE.md`가 생기고, 안에 web/api 구조 설명이 있다
> 💡 이후 모든 요청의 정확도가 눈에 띄게 올라갑니다. 건너뛰지 마세요.

---

# 단계 2 — 콘텐츠 API + 메인 랜딩

## 2-A. API 쪽

### T-05. CORS 설정

`WebMvcConfigurer`로 `/api/**`에 `http://localhost:3000` 허용.
허용 도메인은 **yml에서 읽어오게** 하세요 (나중에 Vercel 도메인을 추가해야 합니다).

```yaml
app:
  cors:
    allowed-origins:
      - http://localhost:3000
```

> ✅ 완료 조건: 브라우저 콘솔에서 `fetch('http://localhost:8080/api/ping')` 시 CORS 에러가 안 난다

---

### T-06. `GET /api/contact`

`controller`의 `@RestController` + `dto`의 응답 `record`로 반환. **데이터는 코드에 하드코딩합니다.**
하드코딩 값은 `service`의 구현 클래스에 상수로 두고, 컨트롤러는 `ports/in`의 서비스 인터페이스만 호출합니다.

```json
{
  "phone": "010-5243-3064",
  "callCenter": ["1688-2178", "1666-1347"],
  "kakaoOpenChatUrl": "https://open.kakao.com/o/sVPLBe6",
  "address": "광주 광산구 지로길 33 공장 (지죽동 127-4)"
}
```

> ⭐ **핵심**: 전화번호와 카톡 링크를 프론트에 하드코딩하지 않고 여기서 받아 씁니다.
> "연락처가 바뀌면 어디를 고쳐야 하는가"를 한 곳으로 모으는 것이 이 요구사항의 이유입니다.

> ✅ 완료 조건: `curl localhost:8080/api/contact` → 위 JSON 반환

---

### T-07. `GET /api/services`

수리 서비스 목록. 응답 필드: `id`, `title`, `description`, `icon` (T-06과 같은 계층 구성)
내용은 실제 취급 항목으로 — 탑차 수리 / 윙바디 / 냉동탑 / 리프트 / 보험·사고 수리 / 무료 대차 / 전국 픽업 / 전국 견인 중에서 6개 이상.

> ✅ 완료 조건: `curl localhost:8080/api/services` → 6개 이상의 배열

---

### T-08. `GET /api/reviews`

고객 후기 목록. 응답 필드: `author`, `vehicleType`, `rating`, `content`. 샘플 5건. (T-06과 같은 계층 구성)

> ✅ 완료 조건: `curl localhost:8080/api/reviews` → 5건 배열

---

## 2-B. 웹 쪽

### T-09. API 호출 유틸 + 환경변수

`web/.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

`src/lib/api.ts`에 fetch 래퍼 하나. **주소를 컴포넌트마다 하드코딩하지 마세요.**

> ✅ 완료 조건: 임시 페이지에서 유틸로 `/api/contact`를 불러 화면에 출력됨

---

### T-10. 공통 레이아웃 (헤더 / 푸터)

헤더에 로고 + `홈 / 블로그` 네비게이션, 모바일은 햄버거 메뉴. 푸터에 상호·주소·연락처.

> ✅ 완료 조건: 폭 375px에서 햄버거가 뜨고 열고 닫힌다

---

### T-11. Hero 섹션 + **전화/카톡 버튼** ⭐

한 줄 카피 + 서브카피 + CTA 2개.

```tsx
// 번호는 /api/contact 에서 받아온 값 사용. tel: 에는 하이픈 제거
<a href={`tel:${contact.phone.replace(/-/g, '')}`}>전화 상담</a>

<a href={contact.kakaoOpenChatUrl} target="_blank" rel="noopener noreferrer">
  카톡 상담
</a>
```

**고대비 CTA** — 가장 중요한 버튼 하나만 진하게, 나머지는 외곽선.

> ✅ 완료 조건: 데스크톱에서 두 버튼이 보이고, 카톡 버튼이 새 탭으로 오픈채팅방을 연다

---

### T-12. 모바일 하단 고정 CTA 바 ⭐ (필수 기능)

화면 하단 고정. 좌 "전화 상담" / 우 "카톡 상담". `md:hidden`으로 **모바일에서만** 노출.
엄지 터치 반경 안에 오도록 충분히 크게, 본문이 가려지지 않게 `body`에 하단 패딩.

> ✅ 완료 조건: 375px에서만 보이고 1440px에서는 사라진다 / 스크롤해도 계속 붙어 있다

---

### T-13. 강점 3종 섹션

무료 대차 · 무료 전국 픽업 · 전국 견인. **벤또박스(Bento) 그리드** — 크기가 다른 카드를 격자로.

> ✅ 완료 조건: 데스크톱에서 카드 크기가 다르게 배치되고, 모바일에서 세로로 쌓인다

---

### T-14. 수리 서비스 섹션

`/api/services` 렌더링. 데스크톱 3열 / 태블릿 2열 / 모바일 1열.

> ✅ 완료 조건: API를 껐다 켜면 화면 내용도 따라 바뀐다 (= 하드코딩이 아니다)

---

### T-15. 고객 후기 섹션

`/api/reviews` 렌더링. 모바일은 가로 스크롤(스냅).

> ✅ 완료 조건: 모바일 폭에서 옆으로 밀린다

---

### T-16. 오시는 길 섹션

`/api/contact`의 주소·전화·콜센터 표시. 지도는 이미지 또는 링크로 충분합니다.

> ✅ 완료 조건: 주소가 정확히 "광주 광산구 지로길 33 공장 (지죽동 127-4)"로 표시된다

---

# 단계 3 — 블로그

## 3-A. API 쪽

### T-17. `Post` 엔티티 + H2 파일 모드 설정

`domain` 패키지에 `Post` 엔티티. 필드: `id`, `title`, `content`, `author`, `createdAt`, `updatedAt`
Lombok은 `@Getter` + `@Builder` + `@NoArgsConstructor(access = AccessLevel.PROTECTED)`까지만 — **setter 금지**, 수정은 도메인 메서드로 (T-18/T-24의 수정 기능이 이걸 씁니다).

`application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:h2:file:./data/gnplatform
    driver-class-name: org.h2.Driver
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: update
    open-in-view: false
  h2:
    console:
      enabled: true
```

`api/data/`는 `.gitignore`에 추가. H2 콘솔: http://localhost:8080/h2-console

> ✅ 완료 조건: 기동 후 `api/data/` 폴더에 파일이 생기고, H2 콘솔에서 `POST` 테이블이 보인다

---

### T-18. 게시글 CRUD

계층 구성은 `CLAUDE.md`의 "API 아키텍처"를 따릅니다.

- `service/ports/in/PostService` 인터페이스 + `service/DefaultPostService` 구현
- `repository/PostRepository extends JpaRepository<Post, Long>`
- `controller/PostController`, 요청/응답은 `dto`의 `record`
- 컨트롤러는 리포지토리를 직접 참조하지 않고 `PostService`만 호출합니다.

| Method | Path | 응답 |
|---|---|---|
| GET | `/api/posts` | 200 (최신순) |
| GET | `/api/posts/{id}` | 200 / 404 |
| POST | `/api/posts` | 201 + `Location` 헤더 |
| PUT | `/api/posts/{id}` | 200 / 404 |
| DELETE | `/api/posts/{id}` | 204 / 404 |

> ✅ 완료 조건: `curl`로 생성 → 조회 → 수정 → 삭제가 전부 되고, 삭제한 id 조회 시 **404**

---

### T-19. 검증 + 404 예외 처리

- `dto`의 요청 `record`에 `@Valid` + `@NotBlank` → 제목/본문이 비면 **400**
- 404는 커스텀 예외로. HTTP 매핑은 `controller/GlobalExceptionHandler`(`@RestControllerAdvice`)에서 모아 처리합니다.

> ✅ 완료 조건: 빈 제목으로 POST → 400 / 없는 id 조회 → 500이 아니라 404

---

### T-20. 샘플 글 시딩

`config/DataInitializer`(`CommandLineRunner`)로 **글이 0건일 때만** 샘플 **12건** 삽입.
(페이지네이션을 눈으로 확인하려면 2페이지 이상 필요합니다)

> ✅ 완료 조건: 서버를 두 번 재시작해도 글이 12건 그대로 (24건으로 늘어나지 않음)

---

## 3-B. 웹 쪽

> 공통: 폼은 `'use client'` + `useState`로. **폼 라이브러리 금지.**
> **로딩·에러 상태를 반드시 표시하세요.** API가 안 떠 있을 때 화면이 하얗게 비면 미완성입니다.

### T-21. `/blog` 목록

데스크톱 3열 / 모바일 1열 카드. 우상단 "글쓰기" 버튼.

> ✅ 완료 조건: 시딩된 글이 카드로 보이고, 클릭하면 상세로 이동

---

### T-22. `/blog/[id]` 상세

제목 · 작성자 · 작성일 · 본문 + 수정/삭제 버튼.
삭제는 `confirm` 후 실행하고 `/blog`로 이동.

> ✅ 완료 조건: 삭제하면 목록에서 사라진다

---

### T-23. `/blog/new` 작성

제목 · 작성자 · 내용 → POST 후 **생성된 글 상세로 이동**.

> ✅ 완료 조건: 글을 쓰면 상세 페이지로 넘어가고, 목록에도 나타난다

---

### T-24. `/blog/[id]/edit` 수정

기존 값 프리필 → PUT 후 상세로 이동.

> ✅ 완료 조건: 수정 후 상세 화면에 바뀐 내용이 보인다

---

### T-25. 메인에 "최신 블로그 3건"

`/api/posts?size=3` + "전체 보기" 링크.

> ✅ 완료 조건: 새 글을 쓰면 메인 최신 3건이 바뀐다

---

# 단계 4 — 페이지네이션·검색 · 갤러리 · 마감

### T-26. 목록 API 페이지네이션

컨트롤러가 `Pageable`을 받아 서비스에 넘기고, 서비스가 `Page<Post>`를 반환하면 끝입니다.
다만 **엔티티를 그대로 내보내지 말고** `dto`의 응답 `record`로 매핑하세요 (`page.map(PostResponse::from)`).
응답에 `content`, `totalPages`, `number`가 그대로 들어갑니다.

> ✅ 완료 조건: `curl 'localhost:8080/api/posts?page=1&size=6'` → 7~12번째 글, `totalPages: 2`

---

### T-27. 목록 API 검색

`PostService`에 `q`를 포함한 조회 메서드를 하나 두고, `DefaultPostService`에서
`q`가 있으면 `findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(q, q, pageable)`,
없으면 `findAll(pageable)`로 분기합니다.

> ✅ 완료 조건: `curl 'localhost:8080/api/posts?q=냉동'` → 해당 글만

---

### T-28. `/blog` 검색창 + 페이지 버튼

**검색어·페이지를 URL 쿼리스트링(`?q=&page=`)으로 관리하세요.**
→ 새로고침해도, 뒤로가기를 눌러도 상태가 유지되어야 합니다.

> ✅ 완료 조건: 2페이지로 이동 → 새로고침 → 여전히 2페이지 / 뒤로가기 → 1페이지

---

### T-29. 수리 사례 갤러리 그리드 (메인)

모바일 2열 / 데스크톱 4열. `next/image` + `public/gallery/` 이미지.

> ✅ 완료 조건: 이미지 비율이 깨지지 않고, 모바일에서 2열로 보인다

---

### T-30. 갤러리 라이트박스

클릭 시 모달 — 오버레이 + 좌우 이동 + `ESC`로 닫기.
**라이브러리 쓰지 말고 직접 구현하세요.** 열려 있는 동안 배경 스크롤 잠금.

> ✅ 완료 조건: 열기 → 좌우 이동 → `ESC`로 닫기가 모두 되고, 배경이 스크롤되지 않는다

---

### T-31. 다크 모드

Tailwind `darkMode: 'class'`. 헤더에 토글 버튼.
선택값은 `localStorage`에 저장, 첫 방문은 `prefers-color-scheme`를 따름.
**새로고침 시 흰 화면이 번쩍이지 않도록** `<head>`에 인라인 스크립트로 클래스를 미리 붙이세요.

> ✅ 완료 조건: 다크로 바꾸고 새로고침 → 다크 유지 + **흰 화면 깜빡임 없음**

---

### T-32. 스크롤 등장 애니메이션

`IntersectionObserver`로 `useInView` 훅 **하나만** 만들어 섹션마다 재사용.
`opacity` + `translateY` 트랜지션. `prefers-reduced-motion: reduce`면 애니메이션 끄기.

> ✅ 완료 조건: 스크롤 시 섹션이 순차 등장 / OS "동작 줄이기" 켜면 즉시 표시

---

### T-33. 장애 대응 (fallback 연락처) ⭐

API가 죽어도 **전화·카톡 버튼은 반드시 눌러져야 합니다.** 실제 고객 문의가 걸린 부분입니다.
`/api/contact` 실패 시 쓸 **하드코딩 fallback 연락처**를 프론트에 두세요.
(하드코딩 금지 원칙의 **의도적 예외**입니다)
나머지 섹션은 실패 시 안내 문구를 표시합니다.

> ✅ 완료 조건: **API를 완전히 끈 채로** 사이트를 열어도 화면이 안 깨지고 전화·카톡 버튼이 동작한다

---

### T-34. 반응형 점검 + 정리

| 구분 | 폭 |
|---|---|
| 모바일 | ~767px |
| 태블릿 | 768~1023px |
| 데스크톱 | 1024px~ |

> ✅ 완료 조건: 375 / 768 / 1440 세 폭에서 **가로 스크롤바가 생기지 않는다**

---

# 단계 5 — 배포

### T-35. GitHub push

```bash
gh repo create gn-platform --public --source=. --push
```

> ✅ 완료 조건: 저장소에 web/api가 모두 올라가 있고 `node_modules`는 없다

---

### T-36. `api` 배포 (Railway 또는 Render)

- Root Directory를 `api`로 지정 (Gradle 자동 인식)
- yml의 CORS 허용 목록에 **Vercel 도메인 추가** — 안 하면 브라우저에서 전부 막힙니다
- ⚠️ **무료 플랜은 디스크가 휘발성입니다.** 재배포하면 H2 파일이 날아가 글이 사라집니다.
  → **운영 프로필만 PostgreSQL로 전환하세요** (Neon / Supabase / Railway 무료 DB).
  JPA를 썼으니 `application-prod.yml` 추가로 끝나고 코드 수정은 거의 없습니다:

  ```yaml
  spring:
    datasource:
      url: ${DATABASE_URL}
      driver-class-name: org.postgresql.Driver
    jpa:
      hibernate:
        ddl-auto: update
  ```
  (`build.gradle.kts`에 `runtimeOnly("org.postgresql:postgresql")` 추가)

> ✅ 완료 조건: 배포된 주소 + `/api/contact` 가 브라우저에서 JSON을 반환한다

---

### T-37. `web` 배포 (Vercel)

- 저장소 연결 후 **Root Directory를 `web`으로 지정**
- Environment Variables에 `NEXT_PUBLIC_API_BASE_URL` = T-36의 배포 주소

> ✅ 완료 조건: 공개 URL에서 서비스·후기·블로그가 **실제로 보인다** / 콘솔에 CORS 에러 없음
> ⚠️ 무료 플랜은 콜드 스타트가 있어 첫 접속이 느립니다. T-33의 로딩 표시가 여기서 값을 합니다.

---

### T-38. 실기기 최종 검증 ⭐

**실제 휴대폰으로** 배포된 사이트를 열고 확인:

- [ ] 전화 버튼 → `010-5243-3064` 통화 화면
- [ ] 카톡 버튼 → 오픈채팅방(`sVPLBe6`) 진입
- [ ] 하단 고정 CTA 바가 스크롤 내내 보임
- [ ] 글 작성 → 목록 노출 → 수정 → 삭제
- [ ] 재배포 후에도 작성한 글이 남아 있음

> ✅ 완료 조건: 위 5개 전부 통과 → **과제 완료**

---

# 부록 A. Claude Code 사용법

### 반드시 써볼 것

| 기능 | 방법 | 왜 |
|---|---|---|
| **Plan mode** | `Shift+Tab` | 바로 코드 짜지 말고 **계획부터 받아서 읽고 고치기**. 제일 중요합니다 |
| `/init` | T-04 | `CLAUDE.md`가 생겨 이후 요청 정확도가 올라갑니다 |
| **스크린샷 붙여넣기** | 참고 사이트 캡처 후 `Cmd+V` | "이런 느낌으로"가 말보다 100배 정확합니다 |
| `ESC` | 엉뚱한 방향으로 갈 때 | 끝까지 기다리지 말고 **바로 끊고** 다시 요청 |
| `/clear` | 단계가 바뀔 때 | 대화가 길어지면 엉뚱한 걸 기억합니다 |

### 요청하는 법

| ❌ 이렇게 하지 마세요 | ✅ 이렇게 하세요 |
|---|---|
| "사이트 만들어줘" | "T-11 Hero 섹션만 만들어줘. 왼쪽 텍스트 / 오른쪽 이미지, 모바일에선 세로로 쌓이게." |
| "예쁘게 해줘" | "버튼 배경을 더 진하게, 여백을 지금의 1.5배로, 제목을 한 단계 크게." |
| "안 돼" | "`/blog`에서 이 에러가 떴어: (에러 전문 붙여넣기)" |
| "블로그 만들어줘" | "T-18만 해줘. 페이지네이션은 T-26에서 할 거야." |

**원칙 3가지**

1. **티켓 하나씩.** 묶어서 시키면 반드시 꼬입니다.
2. **결과를 읽으세요.** 돌아가는 코드와 이해한 코드는 다릅니다. 모르는 코드가 나오면 "이 부분 설명해줘".
3. **마음에 안 들면 다시 시키세요.** 직접 고치는 것보다 "이건 이래서 별로야, 이렇게 바꿔줘"가 빠릅니다.

### 이런 것도 시켜보세요

- "커밋 메시지 써서 커밋해줘"
- "지금 `page.tsx`가 너무 길어. 컴포넌트로 쪼개줘"
- "왜 `Pageable`을 쓰는 게 직접 자르는 것보다 나은지 설명해줘"
- "모바일 폭에서 이 부분이 잘려" (스크린샷 첨부)

---

# 부록 B. 디자인 리서치

T-10을 시작하기 전에 **잘 만든 서비스 3~5개를 직접 보고** 무엇을 가져올지 정하세요.
(당근 · 토스 · 오늘의집 · 크몽 · 숨고 등의 랜딩/상세 페이지)

메모할 것 — 여백은 얼마나 넓은지, 글자 크기 단계는 몇 개인지, 버튼 중 어느 게 제일 눈에 띄는지,
모바일에서 엄지가 닿는 곳에 무엇이 있는지.

**이 과제에 이미 반영해 둔 트렌드**

- 벤또박스 그리드 (T-13)
- 고대비 CTA — 중요한 버튼 하나만 진하게 (T-11)
- 모바일 하단 고정 상담 바 (T-12)
- 한 화면당 정보량 제한 — 섹션 하나에 메시지 하나

---

# 부록 C. 막혔을 때

- **에러 메시지 전문을 그대로 붙여넣으세요.** 요약하지 마세요.
- CORS 에러 → 브라우저 콘솔 메시지를 그대로 복사해서 물어보세요.
- 뭘 물어야 할지 모르겠으면 → "지금 상황이 이런데 뭐부터 확인해야 해?"
- 한 티켓에서 오래 막히면 그것만 남기고 다음 티켓으로 갔다가 돌아오세요. 단, 최종적으로는 전부 채웁니다.
- 요구사항이 이상해 보이면 혼자 빼지 말고 **먼저 물어보세요.** 실서비스라 임의로 축소하면 안 됩니다.

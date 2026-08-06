# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

특장차(탑차/윙바디/냉동탑/리프트) 수리 전문점의 실서비스 웹사이트. `web/` = Next.js 16 (App Router, Tailwind v4), `api/` = Spring Boot 4 (Java 21, JPA, H2). 별도 워크스페이스 도구 없이 각 디렉터리에서 독립 실행하며, 웹이 동작하려면 두 서버가 모두 떠 있어야 합니다.

## 스펙은 ASSIGNMENT.md

요구사항의 단일 출처는 루트 `ASSIGNMENT.md`의 **티켓 T-01 ~ T-38**입니다. 작업 전에 해당 티켓 본문을 읽으세요 — 연락처 실제 값, API 응답 스펙, 완료 조건이 전부 거기 있습니다. 여기에 옮겨 적지 않는 이유는 두 곳이 어긋나는 걸 막기 위해서입니다.

**요청받은 티켓 범위만 구현합니다.** 뒤 티켓의 기능을 앞질러 넣지 마세요 (T-18에 페이지네이션 → 그건 T-26).

## 티켓 본문에 묻혀 있는 전역 제약

- 웹 폼은 `'use client'` + `useState`. **폼 라이브러리 금지.** 라이트박스 등 UI도 **라이브러리 없이 직접 구현.**
- 설정 파일은 전부 YAML. `application.properties`를 만들지 마세요.
- 하드코딩 금지: 연락처는 `/api/contact`에서만, API 주소는 `NEXT_PUBLIC_API_BASE_URL` + `web/src/lib/api.ts` 래퍼로만, CORS 오리진은 `application.yml`에서만. **유일한 예외는 T-33의 fallback 연락처** — API가 죽어도 전화·카톡 버튼은 동작해야 합니다.
- 목록 상태(`q`, `page`)는 URL 쿼리스트링으로 관리. 로딩·에러 상태는 항상 렌더링합니다.

## API 아키텍처 — 헥사고날

가독성을 위해 API는 헥사고날(포트 & 어댑터) 구조로 갑니다. `com.gnplatform.api.<기능>` 아래로 계층을 나눕니다:

- `domain` — 순수 도메인 모델과 규칙. 스프링·JPA 애너테이션 없음.
- `application` — 유스케이스 구현 + 아웃바운드 **포트 인터페이스** 선언. 의존 방향은 항상 안쪽(도메인)으로만.
- `adapter/in/web` — `@RestController`, 요청/응답 `record`. 도메인 모델을 그대로 노출하지 말고 여기서 변환합니다.
- `adapter/out/persistence` — JPA 엔티티와 `JpaRepository`, 그리고 application의 포트를 구현하는 어댑터. JPA 엔티티는 이 패키지 밖으로 나가지 않습니다.

컨트롤러는 리포지토리를 직접 참조하지 않고 유스케이스만 호출합니다.

## 명령어

`npm run dev|build|lint` (web), `./gradlew bootRun|test` (api). 단일 테스트:

```bash
cd api && ./gradlew test --tests 'com.gnplatform.api.PostControllerTest'
```

## 기타

- 이 Next.js 16은 학습 데이터와 API·규약이 다를 수 있습니다. 애매하면 `web/node_modules/next/dist/docs/`를 먼저 읽으세요. `web/AGENTS.md`의 자동 생성 블록은 지우지 말고 그대로 커밋합니다.
- 커밋 메시지는 한글, `Co-Authored-By` 트레일러 없이.

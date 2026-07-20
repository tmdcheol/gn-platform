# Plan: 회원(Member) 도메인

> 개발 계획. 어떻게.

## 개요
`com.gn.api.domain` 패키지에 `Member` JPA 엔티티를 Builder 패턴으로 만든다. 생성 시 타임스탬프(createdAt/updatedAt)를 자동 설정하고, update 메서드로 변경 시 updatedAt 을 갱신한다. 순수 단위 테스트로 동작을 검증한다(Spring 컨텍스트/DB 불필요).

## 위치 / 파일
```
src/main/java/com/gn/api/domain/Member.java        # JPA 엔티티 + 생성 규칙
src/test/java/com/gn/api/domain/MemberTest.java     # 순수 단위 테스트 (JUnit)
```

## 설계
### Member 엔티티
- `@Entity`, 테이블명 `members`
- 필드: id(자동생성), email(unique, not null), name(not null), password(not null), createdAt, updatedAt
- JPA 용 기본 생성자: `protected` (`@NoArgsConstructor(access = PROTECTED)`)
- `@Builder` 를 붙인 공개 생성자 `Member(email, name, password)`:
  - 필드 대입 후 `now = LocalDateTime.now()` 로 createdAt = updatedAt = now
- `update(String name, String password)`: name/password 변경 + updatedAt 갱신
- 접근자: getter 만 노출(Lombok `@Getter`), setter 없음 (변경은 update 메서드로만)

## 테스트 전략
- 프레임워크 없이 `Member.builder()...build()` 로 동작 검증 (빠르고 순수).
- Builder 생성, 타임스탬프 자동 설정(createdAt == updatedAt), update 동작(값 변경 + updatedAt 갱신, createdAt 유지)을 확인.

## 기술 선택 / 근거
- Builder 패턴: 필드가 늘어나도 가독성 있는 생성, 프로젝트 도메인 컨벤션(예시 Reminder)과 통일.
- 상태 변경은 update 메서드로만 열어 불변식과 updatedAt 갱신을 한 곳에서 관리.
- 단위 테스트(Spring 미사용): 도메인만 검증하면 되므로 컨텍스트 로딩 불필요, 빠름.

## 리스크 / 고려사항
- 지금은 Repository가 없어 persist 테스트는 하지 않는다(다음 단계에서 @DataJpaTest 로 유니크 제약 검증 예정).
- 현재 application.yml 은 H2 로 설정되어 있어 애플리케이션 컨텍스트 로딩(ApiApplicationTests)에는 영향 없다.

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

## 진행 메모
- 도메인 → Repository 순으로 구현. Service/Controller는 다음 단계.
- 프로젝트 도메인 컨벤션(예시 Reminder)에 맞춰 @Builder + createdAt/updatedAt + update 메서드 형식 채택.
- Repository JPA 테스트는 생략(파생 쿼리 위주라 별도 검증 불필요).

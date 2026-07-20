# 문서 (Spec-Driven Development)

gn-platform은 **명세 주도 개발(Spec-Driven Development)** 방식으로 작업한다.
기능마다 `spec → plan → tasks` 순서로 문서를 작성하고, 문서를 기준으로 구현한다.

## 3단계 문서

| 문서 | 질문 | 내용 |
|------|------|------|
| `spec.md` | 무엇을 / 왜 (What/Why) | 요구사항, 사용자 스토리, 수용 기준. 구현 방법은 쓰지 않는다 |
| `plan.md` | 어떻게 (How) | 기술 설계, 아키텍처, 데이터 모델, API, 파일 구조, 기술 선택 근거 |
| `tasks.md` | 순서 (Steps) | plan을 잘게 쪼갠 체크리스트. `- [ ]` 로 진행 상태 추적 |

## 진행 방식

1. `spec.md` 작성 → 요구사항 확정 (모호함 제거)
2. `plan.md` 작성 → 설계 및 리뷰
3. `tasks.md` 분해 → 실행 가능한 작업 목록으로 쪼갬
4. task 하나씩 구현 → 완료 시 `- [x]` 체크 후 커밋
5. 요구가 바뀌면 `spec.md`부터 갱신 → 문서와 코드를 동기화 유지

## 새 기능 시작하기

`templates/` 의 3개 템플릿을 복사해서 사용한다.

```bash
mkdir -p api/docs/specs/<기능명>
cp api/docs/templates/spec.md  api/docs/specs/<기능명>/spec.md
cp api/docs/templates/plan.md  api/docs/specs/<기능명>/plan.md
cp api/docs/templates/tasks.md api/docs/specs/<기능명>/tasks.md
```

## 구조

```text
api/docs/
├── README.md          # 이 문서
├── templates/         # 빈 템플릿
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
└── specs/             # 기능별 문서 (기능마다 하위 폴더)
    └── <기능명>/
        ├── spec.md
        ├── plan.md
        └── tasks.md
```

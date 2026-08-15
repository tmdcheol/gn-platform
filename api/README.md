# api 실행

관리자 계정은 환경변수로 주입합니다. **둘 다 없으면 기동에 실패합니다.**

| 변수 | 설명 |
|---|---|
| `ADMIN_USERNAME` | 관리자 아이디 |
| `ADMIN_PASSWORD_HASH` | 관리자 비밀번호의 **BCrypt 해시**. 평문이 아닙니다 |
| `SUPABASE_URL` | 예: `https://xxxx.supabase.co` |
| `SUPABASE_BUCKET` | 이미지 버킷 이름. **공개(public) 버킷이어야 반환된 URL이 열립니다** |
| `SUPABASE_SERVICE_KEY` | 스토리지 service role 키. 커밋 금지 |

```bash
ADMIN_USERNAME=admin ADMIN_PASSWORD_HASH='$2a$10$...' \
  SUPABASE_URL=https://xxxx.supabase.co SUPABASE_BUCKET=images SUPABASE_SERVICE_KEY=... \
  ./gradlew bootRun
```

해시는 아래처럼 만들 수 있습니다 (`'`로 감싸야 `$`가 셸에서 치환되지 않습니다).

```bash
CP=$(find ~/.gradle/caches -name 'spring-security-crypto-*.jar' -o -name 'spring-jcl-*.jar' | tr '\n' ':')
cat > /tmp/Gen.java <<'EOF'
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class Gen {
    public static void main(String[] args) {
        System.out.println(new BCryptPasswordEncoder().encode(args[0]));
    }
}
EOF
java -cp "$CP" /tmp/Gen.java '여기에-비밀번호'
```

평문도 해시도 커밋하지 마세요. 테스트는 `src/test/resources/application-test.yml`의 테스트 전용 계정을 쓰므로
환경변수 없이 `./gradlew test`가 그대로 돌아갑니다.

## 그 밖에

- 개발 DB는 H2 파일 모드(`api/data/`, gitignore 대상), 콘솔은 http://localhost:8080/h2-console
- CSRF가 켜져 있습니다. 쓰기 요청은 `XSRF-TOKEN` 쿠키 값을 `X-XSRF-TOKEN` 헤더에 실어야 합니다.

## 관리 API의 인증 실패 응답

`/api/admin/**`은 인증이 필요하고, 막히는 방식이 두 가지입니다. `CsrfFilter`가 인가 필터보다 앞에 있어
**CSRF 토큰이 없으면 인증 여부를 판단하기 전에 403이 납니다.**

| 상황 | 응답 |
|---|---|
| CSRF 토큰 있음 + 로그인 안 됨 | **401** `로그인이 필요합니다` |
| CSRF 토큰 없음 (쿠키가 전혀 없는 경우 포함) | **403** `접근 권한이 없습니다` |

**프론트는 401과 403을 모두 "재로그인 필요"로 처리해야 합니다.** 401만 보고 분기하면, 세션과 토큰 쿠키가
함께 사라진 상태에서 사용자가 원인 모를 오류를 보게 됩니다. 어느 쪽이든 리다이렉트 없이 JSON으로 옵니다.

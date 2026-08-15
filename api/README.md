# api 실행

관리자 계정은 환경변수로 주입합니다. **둘 다 없으면 기동에 실패합니다.**

| 변수 | 설명 |
|---|---|
| `ADMIN_USERNAME` | 관리자 아이디 |
| `ADMIN_PASSWORD_HASH` | 관리자 비밀번호의 **BCrypt 해시**. 평문이 아닙니다 |

```bash
ADMIN_USERNAME=admin ADMIN_PASSWORD_HASH='$2a$10$...' ./gradlew bootRun
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

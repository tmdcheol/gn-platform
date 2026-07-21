package com.gn.api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.gn.api.domain.Member;
import com.gn.api.repository.MemberRepository;
import com.gn.api.service.ports.in.MemberService;
import java.util.NoSuchElementException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class DefaultMemberServiceTest {

    @Autowired
    private MemberService service;

    @Autowired
    private MemberRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    @DisplayName("전체 회원을 조회할 수 있다")
    void findAll() {
        service.create("hong@example.com", "홍길동", "password1");
        service.create("kim@example.com", "김철수", "password2");

        assertThat(service.findAll()).hasSize(2);
    }

    @Test
    @DisplayName("ID로 회원을 조회할 수 있다")
    void findById() {
        Member created = service.create("hong@example.com", "홍길동", "password1");

        Member result = service.findById(created.getId());

        assertThat(result.getEmail()).isEqualTo("hong@example.com");
    }

    @Test
    @DisplayName("존재하지 않는 ID 조회 시 예외가 발생한다")
    void findByIdNotFound() {
        assertThatThrownBy(() -> service.findById(999L))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    @DisplayName("회원을 생성할 수 있다")
    void create() {
        Member result = service.create("hong@example.com", "홍길동", "password1");

        assertThat(result.getId()).isNotNull();
        assertThat(result.getEmail()).isEqualTo("hong@example.com");
        assertThat(result.getName()).isEqualTo("홍길동");
        assertThat(result.getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("이미 사용 중인 이메일이면 생성에 실패한다")
    void createDuplicateEmail() {
        service.create("hong@example.com", "홍길동", "password1");

        assertThatThrownBy(() -> service.create("hong@example.com", "다른이름", "password2"))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    @DisplayName("회원 이름과 비밀번호를 수정할 수 있다")
    void update() {
        Member created = service.create("hong@example.com", "홍길동", "password1");

        Member result = service.update(created.getId(), "김철수", "newpassword2");

        assertThat(result.getName()).isEqualTo("김철수");
        assertThat(result.getPassword()).isEqualTo("newpassword2");
    }

    @Test
    @DisplayName("회원을 삭제할 수 있다")
    void delete() {
        Member created = service.create("hong@example.com", "홍길동", "password1");

        service.delete(created.getId());

        assertThat(repository.findById(created.getId())).isEmpty();
    }
}

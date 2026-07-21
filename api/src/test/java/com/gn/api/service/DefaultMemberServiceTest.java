package com.gn.api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.gn.api.domain.Member;
import com.gn.api.repository.MemberRepository;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DefaultMemberServiceTest {

    @Mock
    private MemberRepository repository;

    @InjectMocks
    private DefaultMemberService service;

    private Member sampleMember() {
        return Member.builder()
                .email("hong@example.com")
                .name("홍길동")
                .password("password1")
                .build();
    }

    @Test
    @DisplayName("전체 목록을 조회한다")
    void findAll() {
        given(repository.findAll()).willReturn(List.of(sampleMember()));

        assertThat(service.findAll()).hasSize(1);
    }

    @Test
    @DisplayName("id로 회원을 조회한다")
    void findById() {
        given(repository.findById(1L)).willReturn(Optional.of(sampleMember()));

        assertThat(service.findById(1L).getEmail()).isEqualTo("hong@example.com");
    }

    @Test
    @DisplayName("없는 id 조회 시 예외가 발생한다")
    void findById_notFound() {
        given(repository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(99L))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    @DisplayName("회원을 생성하면 저장된다")
    void create() {
        given(repository.existsByEmail("hong@example.com")).willReturn(false);
        given(repository.save(any(Member.class))).willAnswer(inv -> inv.getArgument(0));

        Member created = service.create("hong@example.com", "홍길동", "password1");

        assertThat(created.getName()).isEqualTo("홍길동");
        verify(repository).save(any(Member.class));
    }

    @Test
    @DisplayName("이미 사용 중인 이메일이면 생성에 실패한다")
    void create_duplicateEmail() {
        given(repository.existsByEmail("hong@example.com")).willReturn(true);

        assertThatThrownBy(() -> service.create("hong@example.com", "홍길동", "password1"))
                .isInstanceOf(IllegalStateException.class);
        verify(repository, never()).save(any(Member.class));
    }

    @Test
    @DisplayName("회원 정보를 수정한다")
    void update() {
        given(repository.findById(1L)).willReturn(Optional.of(sampleMember()));

        Member updated = service.update(1L, "김철수", "newpassword2");

        assertThat(updated.getName()).isEqualTo("김철수");
        assertThat(updated.getPassword()).isEqualTo("newpassword2");
    }

    @Test
    @DisplayName("회원을 삭제한다")
    void delete() {
        Member member = sampleMember();
        given(repository.findById(1L)).willReturn(Optional.of(member));

        service.delete(1L);

        verify(repository).delete(member);
    }
}

package com.gn.api.service;

import com.gn.api.domain.Member;
import com.gn.api.repository.MemberRepository;
import com.gn.api.service.ports.in.MemberService;
import java.util.List;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DefaultMemberService implements MemberService {

    private final MemberRepository repository;

    @Override
    public List<Member> findAll() {
        return repository.findAll();
    }

    @Override
    public Member findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("회원을 찾을 수 없습니다. id=" + id));
    }

    @Override
    @Transactional
    public Member create(String email, String name, String password) {
        if (repository.existsByEmail(email)) {
            throw new IllegalStateException("이미 사용 중인 이메일입니다. email=" + email);
        }
        Member member = Member.builder()
                .email(email)
                .name(name)
                .password(password)
                .build();
        return repository.save(member);
    }

    @Override
    @Transactional
    public Member update(Long id, String name, String password) {
        Member member = findById(id);
        member.update(name, password);
        return member;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Member member = findById(id);
        repository.delete(member);
    }
}

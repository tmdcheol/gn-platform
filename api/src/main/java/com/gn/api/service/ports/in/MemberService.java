package com.gn.api.service.ports.in;

import com.gn.api.domain.Member;
import java.util.List;

public interface MemberService {

    List<Member> findAll();

    Member findById(Long id);

    Member create(String email, String name, String password);

    Member update(Long id, String name, String password);

    void delete(Long id);
}

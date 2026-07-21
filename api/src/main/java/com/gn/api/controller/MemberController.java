package com.gn.api.controller;

import com.gn.api.dto.MemberRequest;
import com.gn.api.dto.MemberResponse;
import com.gn.api.service.ports.in.MemberService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MemberController {

    private final MemberService service;

    @GetMapping("/api/members")
    public List<MemberResponse> findAll() {
        return service.findAll().stream()
                .map(MemberResponse::from)
                .toList();
    }

    @GetMapping("/api/members/{id}")
    public MemberResponse findById(@PathVariable Long id) {
        return MemberResponse.from(service.findById(id));
    }

    @PostMapping("/api/members")
    @ResponseStatus(HttpStatus.CREATED)
    public MemberResponse create(@Valid @RequestBody MemberRequest request) {
        return MemberResponse.from(service.create(request.email(), request.name(), request.password()));
    }

    @PutMapping("/api/members/{id}")
    public MemberResponse update(@PathVariable Long id, @Valid @RequestBody MemberRequest request) {
        return MemberResponse.from(service.update(id, request.name(), request.password()));
    }

    @DeleteMapping("/api/members/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

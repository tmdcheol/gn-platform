package com.gnplatform.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gnplatform.api.dto.ContactResponse;
import com.gnplatform.api.service.ports.in.ContactService;

@RestController
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping("/api/contact")
    public ContactResponse getContact() {
        return contactService.getContact();
    }
}

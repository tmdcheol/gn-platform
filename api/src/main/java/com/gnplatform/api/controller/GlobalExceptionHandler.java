package com.gnplatform.api.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.gnplatform.api.domain.InvalidImageException;
import com.gnplatform.api.domain.PostNotFoundException;
import com.gnplatform.api.domain.RepairNotFoundException;
import com.gnplatform.api.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PostNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(PostNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(e.getMessage(), Map.of()));
    }

    @ExceptionHandler(RepairNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleRepairNotFound(RepairNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(e.getMessage(), Map.of()));
    }

    @ExceptionHandler(InvalidImageException.class)
    public ResponseEntity<ErrorResponse> handleInvalidImage(InvalidImageException e) {
        return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage(), Map.of()));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleTooLargeUpload(MaxUploadSizeExceededException e) {
        return ResponseEntity.badRequest()
                .body(new ErrorResponse("이미지는 5MB를 넘을 수 없습니다", Map.of()));
    }

    @ExceptionHandler(RestClientException.class)
    public ResponseEntity<ErrorResponse> handleStorageFailure(RestClientException e) {
        // 스토리지가 응답하지 않거나 키가 잘못된 경우. 클라이언트 잘못이 아니므로 502.
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(new ErrorResponse("이미지 저장소에 업로드하지 못했습니다", Map.of()));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthentication(AuthenticationException e) {
        // 아이디가 틀린 것인지 비밀번호가 틀린 것인지 구분해서 알려주지 않습니다.
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("아이디 또는 비밀번호가 올바르지 않습니다", Map.of()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError error : e.getBindingResult().getFieldErrors()) {
            errors.putIfAbsent(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.badRequest()
                .body(new ErrorResponse("입력값이 올바르지 않습니다", errors));
    }
}

package com.gnplatform.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.gnplatform.api.domain.ImageFile;
import com.gnplatform.api.domain.InvalidImageException;

@DisplayName("이미지 업로드 검증 규칙")
class ImageFileTest {

    @Test
    @DisplayName("허용된 확장자와 MIME이 맞으면 확장자를 돌려준다")
    void allowsImage() {
        assertThat(ImageFile.validate("사진.jpg", "image/jpeg", 1024)).isEqualTo("jpg");
        assertThat(ImageFile.validate("사진.PNG", "image/png", 1024)).isEqualTo("png");
        assertThat(ImageFile.validate("사진.webp", "image/webp", 1024)).isEqualTo("webp");
    }

    @Test
    @DisplayName("허용되지 않는 확장자는 거부한다")
    void rejectsDisallowedExtension() {
        assertThatThrownBy(() -> ImageFile.validate("악성.exe", "application/octet-stream", 1024))
                .isInstanceOf(InvalidImageException.class)
                .hasMessageContaining("지원하지 않는 이미지 형식");
    }

    @Test
    @DisplayName("확장자는 이미지지만 MIME이 다르면 거부한다")
    void rejectsMismatchedContentType() {
        assertThatThrownBy(() -> ImageFile.validate("가짜.jpg", "application/x-msdownload", 1024))
                .isInstanceOf(InvalidImageException.class)
                .hasMessageContaining("일치하지 않습니다");
    }

    @Test
    @DisplayName("5MB를 넘으면 거부한다")
    void rejectsTooLarge() {
        assertThatThrownBy(() -> ImageFile.validate("큰사진.jpg", "image/jpeg", ImageFile.MAX_SIZE_BYTES + 1))
                .isInstanceOf(InvalidImageException.class)
                .hasMessageContaining("5MB");
    }

    @Test
    @DisplayName("정확히 5MB는 통과한다")
    void allowsExactlyMaxSize() {
        assertThat(ImageFile.validate("사진.jpg", "image/jpeg", ImageFile.MAX_SIZE_BYTES)).isEqualTo("jpg");
    }

    @Test
    @DisplayName("빈 파일과 확장자 없는 파일은 거부한다")
    void rejectsEmptyOrExtensionless() {
        assertThatThrownBy(() -> ImageFile.validate("사진.jpg", "image/jpeg", 0))
                .isInstanceOf(InvalidImageException.class);
        assertThatThrownBy(() -> ImageFile.validate("확장자없음", "image/jpeg", 1024))
                .isInstanceOf(InvalidImageException.class);
    }
}

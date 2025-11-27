package ir.kghobad.thesis_defense_time_schedular.helper;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Log4j2
public class PasswordEncoderTest {
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Test
    void test() {
        log.info("Admin: {}", passwordEncoder.encode("admin123"));
        log.info("Professor: {}", passwordEncoder.encode("prof123"));
        log.info("Student: {}", passwordEncoder.encode("student123"));
    }
}

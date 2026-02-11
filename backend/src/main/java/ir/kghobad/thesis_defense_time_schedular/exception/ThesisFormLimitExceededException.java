package ir.kghobad.thesis_defense_time_schedular.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
public class ThesisFormLimitExceededException extends RuntimeException {
    public ThesisFormLimitExceededException(String message) {
        super(message);
    }
}

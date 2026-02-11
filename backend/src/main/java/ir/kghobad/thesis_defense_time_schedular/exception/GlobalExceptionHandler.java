package ir.kghobad.thesis_defense_time_schedular.exception;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
@Log4j2
public class GlobalExceptionHandler {
    @ExceptionHandler({BadCredentialsException.class})
    public ResponseEntity<String> handleAuthenticationException(BadCredentialsException e) {
        log.error(e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
    }

    @ExceptionHandler({AuthorizationDeniedException.class})
    public ResponseEntity<String> handleAuthenticationException(AuthorizationDeniedException e) {
        log.error(e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    }
    

    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException e) {
        log.error(e.getMessage(), e);
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<Map<String, Object>> handleHandlerMethodValidationException(
            HandlerMethodValidationException ex) {

        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> errors = new ArrayList<>();

        ex.getAllValidationResults().forEach(result -> {
            // Get the index if it's a list validation
            Object argument = result.getArgument();
            int index = -1;

            // Try to determine index for list items
            if (result.getMethodParameter() != null) {
                // Get container index if available
                result.getResolvableErrors().forEach(error -> {
                    Map<String, Object> errorDetail = new HashMap<>();

                    if (error instanceof FieldError fieldError) {
                        errorDetail.put("field", fieldError.getField());
                        errorDetail.put("rejectedValue", fieldError.getRejectedValue());
                        errorDetail.put("message", fieldError.getDefaultMessage());
                    } else {
                        errorDetail.put("message", error.getDefaultMessage());
                        errorDetail.put("codes", error.getCodes());
                    }

                    errors.add(errorDetail);
                });
            }
        });

        response.put("timestamp", LocalDateTime.now().toString());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Validation Failed");
        response.put("message", "یک یا چند فیلد دارای خطای اعتبارسنجی هستند");
        response.put("errors", errors);

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException e) {
        log.error(e.getMessage(), e);
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleValidationExceptions(Exception e) {
        log.error(e.getMessage(), e);
        Map<String, String> errors = new HashMap<>();
        return new ResponseEntity<>(errors, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

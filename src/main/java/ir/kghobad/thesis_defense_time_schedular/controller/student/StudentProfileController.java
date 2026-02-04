package ir.kghobad.thesis_defense_time_schedular.controller.student;

import ir.kghobad.thesis_defense_time_schedular.model.dto.PhoneUpdateDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.student.PasswordChangeInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.student.StudentOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.service.student.StudentProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/student/profile")
@RequiredArgsConstructor
public class StudentProfileController {
    private final StudentProfileService service;

    @GetMapping
    public ResponseEntity<StudentOutputDTO> getProfile() {
        return ResponseEntity.ok(service.getProfile());
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeInputDTO input) {
        service.changePassword(input);
        return ResponseEntity.ok("Password changed successfully");
    }

    @PutMapping("/update-phone")
    public ResponseEntity<?> updatePhone(@Valid @RequestBody PhoneUpdateDTO phone) {
        service.updatePhone(phone);
        return ResponseEntity.ok("Password changed successfully");
    }
}

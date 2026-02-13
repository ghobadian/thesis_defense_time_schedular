package ir.kghobad.thesis_defense_time_schedular.controller.admin;

import ir.kghobad.thesis_defense_time_schedular.model.dto.PhoneUpdateDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.SystemStatsDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingDetailsOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.student.PasswordChangeInputDTO;
import ir.kghobad.thesis_defense_time_schedular.service.admin.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService service;

    @GetMapping("/")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.ok(service.getProfile());
    }

    @GetMapping("/stats")
    public ResponseEntity<SystemStatsDTO> getSystemStats() {
        return ResponseEntity.ok(service.getSystemStats());
    }

    @GetMapping("/meetings")
    public ResponseEntity<List<ThesisDefenseMeetingOutputDTO>> getMeetings() {
        return ResponseEntity.ok(service.getMeetings());
    }

    @GetMapping("/meetings/{meetingId}")
    public ResponseEntity<ThesisDefenseMeetingDetailsOutputDTO> getMeeting(@PathVariable Long meetingId) {
        return ResponseEntity.ok(service.getMeeting(meetingId));
    }

    @PutMapping("/update-phone")
    public ResponseEntity<?> updatePhone(@Valid @RequestBody PhoneUpdateDTO phone) {
        service.updatePhone(phone);
        return ResponseEntity.ok("Password changed successfully");
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeInputDTO input) {
        service.changePassword(input);
        return ResponseEntity.ok("Password changed successfully");
    }
}

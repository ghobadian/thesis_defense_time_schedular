package ir.kghobad.thesis_defense_time_schedular.controller.admin;

import ir.kghobad.thesis_defense_time_schedular.model.dto.*;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingDetailsOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.student.StudentOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.student.StudentRegistrationInputDTO;
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

    @PostMapping("/students/register")
    public ResponseEntity<?> registerStudents(@Valid @RequestBody List<StudentRegistrationInputDTO> dtos) {
        service.registerStudents(dtos);
        return ResponseEntity.ok("Students registered successfully");
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentOutputDTO>> getStudents(@RequestParam(required = false) String search,
                                                              @RequestParam(required = false) Long departmentId,
                                                              @RequestParam(required = false) Integer page,
                                                              @RequestParam(required = false) Integer limit) {
        return ResponseEntity.ok(service.getStudents(search, departmentId, page, limit));
    }

    @DeleteMapping("/students/{studentId}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long studentId) {
        service.deleteStudent(studentId);
        return ResponseEntity.ok("Student deleted successfully");
    }

    @GetMapping("/stats")
    public ResponseEntity<SystemStatsDTO> getSystemStats() {
        return ResponseEntity.ok(service.getSystemStats());
    }

    @GetMapping("/professors")
    public ResponseEntity<List<SimpleUserOutputDto>> getProfessors() {
        return ResponseEntity.ok(service.getProfessors());
    }

    @GetMapping("/meetings")
    public ResponseEntity<List<ThesisDefenseMeetingOutputDTO>> getMeetings() {
        return ResponseEntity.ok(service.getMeetings());
    }

    @GetMapping("/meetings/{meetingId}")
    public ResponseEntity<ThesisDefenseMeetingDetailsOutputDTO> getMeeting(@PathVariable Long meetingId) {
        return ResponseEntity.ok(service.getMeeting(meetingId));
    }


}

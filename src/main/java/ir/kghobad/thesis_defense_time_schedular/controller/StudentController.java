package ir.kghobad.thesis_defense_time_schedular.controller;

import ir.kghobad.thesis_defense_time_schedular.model.dto.PhoneUpdateDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingDetailsOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.TimeSlotSelectionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.student.PasswordChangeInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.student.StudentOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;

    @GetMapping("/")
    public ResponseEntity<StudentOutputDTO> getProfile() {
        return ResponseEntity.ok(studentService.getProfile());
    }

    @PostMapping("/create-form")
    public ResponseEntity<?> createForm(@RequestBody ThesisFormInputDTO formDTO) {
        studentService.createThesisForm(formDTO);
        return ResponseEntity.ok("Thesis form created successfully");
    }

    @GetMapping("/forms")
    public ResponseEntity<List<ThesisFormOutputDTO>> getThesisForms() {
        return ResponseEntity.ok(studentService.getThesisForms());
    }

    @GetMapping("/meetings")
    public ResponseEntity<?> listMeetings() {//todo add test to StudentControllerIntegrationTest
        return ResponseEntity.ok(studentService.listMeetings());
    }

    @GetMapping("/professors")
    public ResponseEntity<List<SimpleUserOutputDto>> listProfessors() {//todo add test to StudentControllerIntegrationTest
        return ResponseEntity.ok(studentService.listProfessors());
    }

    @GetMapping("/meetings/{id}")
    public ResponseEntity<ThesisDefenseMeetingDetailsOutputDTO> getMeetingDetails(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getMeetingDetails(id));
    }

    @PostMapping("/time-slots")
    public ResponseEntity<?> chooseTimeSlot(@RequestBody TimeSlotSelectionInputDTO input) {
        studentService.chooseTimeSlot(input);
        return ResponseEntity.ok("Time slot chosen successfully");
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeInputDTO input) {
        studentService.changePassword(input);
        return ResponseEntity.ok("Password changed successfully");
    }

    @PutMapping("/update-phone")
    public ResponseEntity<?> updatePhone(@Valid @RequestBody PhoneUpdateDTO phone) {
        studentService.updatePhone(phone);
        return ResponseEntity.ok("Password changed successfully");
    }
}

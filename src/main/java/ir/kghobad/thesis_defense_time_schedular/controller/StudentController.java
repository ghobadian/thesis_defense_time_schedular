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
    private final StudentService service;

    @GetMapping("/")
    public ResponseEntity<StudentOutputDTO> getProfile() {
        return ResponseEntity.ok(service.getProfile());
    }

    @PostMapping("/create-form")
    public ResponseEntity<?> createForm(@RequestBody ThesisFormInputDTO formDTO) {
        service.createThesisForm(formDTO);
        return ResponseEntity.ok("Thesis form created successfully");
    }

    @GetMapping("/forms")
    public ResponseEntity<List<ThesisFormOutputDTO>> getThesisForms() {
        return ResponseEntity.ok(service.getThesisForms());
    }

    @GetMapping("/meetings")
    public ResponseEntity<?> listMeetings() {//todo add test to StudentControllerIntegrationTest
        return ResponseEntity.ok(service.listMeetings());
    }

    @GetMapping("/professors")
    public ResponseEntity<List<SimpleUserOutputDto>> listProfessors() {//todo add test to StudentControllerIntegrationTest
        return ResponseEntity.ok(service.listProfessors());
    }

    @GetMapping("/meetings/{id}")
    public ResponseEntity<ThesisDefenseMeetingDetailsOutputDTO> getMeetingDetails(@PathVariable Long id) {
        return ResponseEntity.ok(service.getMeetingDetails(id));
    }

    @PostMapping("/time-slots")
    public ResponseEntity<?> chooseTimeSlot(@RequestBody TimeSlotSelectionInputDTO input) {
        service.chooseTimeSlot(input);
        return ResponseEntity.ok("Time slot chosen successfully");
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

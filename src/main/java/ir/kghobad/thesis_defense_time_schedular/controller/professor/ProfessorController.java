package ir.kghobad.thesis_defense_time_schedular.controller.professor;

import ir.kghobad.thesis_defense_time_schedular.model.dto.PhoneUpdateDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.TimeSlotDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.student.PasswordChangeInputDTO;
import ir.kghobad.thesis_defense_time_schedular.service.professor.ProfessorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professor")
public class ProfessorController {
    private final ProfessorService service;

    public ProfessorController(ProfessorService service) {
        this.service = service;
    }

    @GetMapping("/")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.ok(service.getProfile());
    }

    @GetMapping("/timeslots")
    public ResponseEntity<List<TimeSlotDTO>> getMyTimeslots() {
        return ResponseEntity.ok(service.getMyTimeslots());
    }

    @GetMapping("/students")
    public ResponseEntity<?> getMyStudents() {
        return ResponseEntity.ok(service.getMyStudents());
    }

    @GetMapping("/list")
    public ResponseEntity<List<SimpleUserOutputDto>> getProfessors(){
        return ResponseEntity.ok(service.getProfessors());
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

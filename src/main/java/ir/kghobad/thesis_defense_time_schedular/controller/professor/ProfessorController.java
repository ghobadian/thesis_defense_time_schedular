package ir.kghobad.thesis_defense_time_schedular.controller.professor;

import ir.kghobad.thesis_defense_time_schedular.model.dto.*;
import ir.kghobad.thesis_defense_time_schedular.service.professor.ProfessorService;
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
}

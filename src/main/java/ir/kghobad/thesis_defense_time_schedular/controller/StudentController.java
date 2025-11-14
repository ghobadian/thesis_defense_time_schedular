package ir.kghobad.thesis_defense_time_schedular.controller;

import ir.kghobad.thesis_defense_time_schedular.model.dto.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.ThesisFormInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.TimeSlotSelectionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
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
    public ResponseEntity<?> getMeetingDetails(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getMeetingDetails(id));
    }

    @PostMapping("/time-slots")
    public ResponseEntity<?> chooseTimeSlot(@RequestBody TimeSlotSelectionInputDTO input) {
        studentService.chooseTimeSlot(input);
        return ResponseEntity.ok("Time slot chosen successfully");
    }
}

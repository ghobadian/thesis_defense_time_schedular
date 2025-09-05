package ir.kghobad.thesis_defense_time_schedular.controller;

import ir.kghobad.thesis_defense_time_schedular.model.dto.LoginDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.ThesisFormDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.service.StudentService;
import ir.kghobad.thesis_defense_time_schedular.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/student")
public class StudentController {
    private final StudentService studentService;
    private final UserService userService;
    
    public StudentController(StudentService studentService, UserService userService) {
        this.studentService = studentService;
        this.userService = userService;
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        return ResponseEntity.ok(userService.login(loginDTO));
    }
    
    @PostMapping("/create-form")
    public ResponseEntity<?> createForm(
        @RequestParam Long studentId,
        @RequestBody ThesisFormDTO formDTO
    ) {
        ThesisForm form = studentService.createThesisForm(studentId, formDTO);
        return ResponseEntity.ok(form);
    }
}

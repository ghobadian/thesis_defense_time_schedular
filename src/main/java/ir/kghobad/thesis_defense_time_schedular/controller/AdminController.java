package ir.kghobad.thesis_defense_time_schedular.controller;

import ir.kghobad.thesis_defense_time_schedular.model.dto.StudentRegistrationInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final StudentService studentService;
    
    public AdminController(StudentService studentService) {
        this.studentService = studentService;
    }
    
    @PostMapping("/register-student")
    public ResponseEntity<?> registerStudent(@Valid @RequestBody StudentRegistrationInputDTO dto) {
        Student student = studentService.registerStudent(dto);
        return ResponseEntity.ok(student);
    }
    
    @PostMapping("/register-students")
    public ResponseEntity<?> registerStudents(@Valid @RequestBody List<StudentRegistrationInputDTO> dtos) {
        List<Student> students = studentService.registerStudents(dtos);
        return ResponseEntity.ok(students);
    }
}

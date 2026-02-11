package ir.kghobad.thesis_defense_time_schedular.controller.admin;

import ir.kghobad.thesis_defense_time_schedular.model.dto.user.student.StudentOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.student.StudentRegistrationInputDTO;
import ir.kghobad.thesis_defense_time_schedular.service.admin.AdminStudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/students")
@RequiredArgsConstructor
public class AdminStudentController {
    private final AdminStudentService service;

    @PostMapping
    public ResponseEntity<?> registerStudents(@Valid @RequestBody List<StudentRegistrationInputDTO> dtos) {
        service.registerStudents(dtos);
        return ResponseEntity.ok("Students registered successfully");
    }

    @GetMapping
    public ResponseEntity<List<StudentOutputDTO>> getStudents(@RequestParam(required = false) String search,
                                                              @RequestParam(required = false) Long departmentId,
                                                              @RequestParam(required = false) Integer page,
                                                              @RequestParam(required = false) Integer limit,
                                                              @RequestParam(required = false) String studentType) {
        return ResponseEntity.ok(service.getStudents(search, departmentId, page, limit, studentType));
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<StudentOutputDTO> getStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(service.getStudent(studentId));
    }

    @DeleteMapping("/{studentId}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long studentId) {
        service.deleteStudent(studentId);
        return ResponseEntity.ok("Student deleted successfully");
    }

    @PutMapping("/{studentId}")
    public ResponseEntity<String> updateStudent(@PathVariable Long studentId, @RequestBody StudentRegistrationInputDTO input){
        service.updateStudent(studentId, input);
        return ResponseEntity.ok("Student updated successfully");
    }
}

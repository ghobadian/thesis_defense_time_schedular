package ir.kghobad.thesis_defense_time_schedular.controller;

import ir.kghobad.thesis_defense_time_schedular.model.dto.DepartmentDetailOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.StudentRegistrationInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.SystemStatsDTO;
import ir.kghobad.thesis_defense_time_schedular.service.AdminService;
import ir.kghobad.thesis_defense_time_schedular.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final StudentService studentService;
    private final AdminService adminService;
    
    public AdminController(StudentService studentService, AdminService adminService) {
        this.studentService = studentService;
        this.adminService = adminService;
    }
    
    @PostMapping("/register-student")
    public ResponseEntity<?> registerStudent(@Valid @RequestBody StudentRegistrationInputDTO dto) {
        studentService.registerStudent(dto);
        return ResponseEntity.ok("Student registered successfully");
    }
    
    @PostMapping("/register-students")
    public ResponseEntity<?> registerStudents(@Valid @RequestBody Set<StudentRegistrationInputDTO> dtos) {
        studentService.registerStudents(dtos);
        return ResponseEntity.ok("Students registered successfully");
    }

    @GetMapping("/forms")
    public ResponseEntity<?> listForms() {
        return ResponseEntity.ok(adminService.listForms());
    }

    @PostMapping("/forms/{formId}/approve")
    public ResponseEntity<?> approveForm(@PathVariable Long formId) {
        adminService.approveForm(formId);
        return ResponseEntity.ok("Form approved successfully");
    }

    @PostMapping("/forms/{formId}/reject")
    public ResponseEntity<?> rejectForm(@PathVariable Long formId) {
        adminService.rejectForm(formId);
        return ResponseEntity.ok("Admin action performed successfully");
    }

    @GetMapping("/stats")
    public ResponseEntity<SystemStatsDTO> getSystemStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentDetailOutputDTO>> getDepartments() {
        return ResponseEntity.ok(adminService.getDepartments());
    }

    public ResponseEntity<List<SimpleUserOutputDto>> getProfessors() {
        return ResponseEntity.ok(adminService.getProfessors());
    }
}

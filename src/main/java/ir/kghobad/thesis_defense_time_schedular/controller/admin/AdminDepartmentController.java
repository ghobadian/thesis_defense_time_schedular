package ir.kghobad.thesis_defense_time_schedular.controller.admin;

import ir.kghobad.thesis_defense_time_schedular.model.dto.department.DepartmentDetailOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.department.DepartmentInputDTO;
import ir.kghobad.thesis_defense_time_schedular.service.admin.AdminDepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/departments")
@RequiredArgsConstructor
public class AdminDepartmentController {
    private final AdminDepartmentService service;

    @GetMapping
    public ResponseEntity<List<DepartmentDetailOutputDTO>> getDepartments() {
        return ResponseEntity.ok(service.getDepartments());
    }

    @DeleteMapping("/{departmentId}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long departmentId) {
        service.deleteDepartment(departmentId);
        return ResponseEntity.ok("Department deleted successfully");
    }

    @PutMapping("/{departmentId}")
    public ResponseEntity<?> updateDepartment(@PathVariable Long departmentId, @RequestBody DepartmentInputDTO input) {
        service.updateDepartment(departmentId, input);
        return ResponseEntity.ok("Department updated successfully");
    }

    @PostMapping
    public ResponseEntity<?> createDepartment(@RequestBody DepartmentInputDTO input) {
        service.createDepartment(input);
        return ResponseEntity.ok("Department created successfully");
    }
}

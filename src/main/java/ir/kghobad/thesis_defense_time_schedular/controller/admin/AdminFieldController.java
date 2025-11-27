package ir.kghobad.thesis_defense_time_schedular.controller.admin;

import ir.kghobad.thesis_defense_time_schedular.model.dto.field.FieldInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.field.FieldOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.service.admin.AdminFieldService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/fields")
@RequiredArgsConstructor
public class AdminFieldController {
    private final AdminFieldService service;

    @GetMapping
    public ResponseEntity<List<FieldOutputDTO>> getAllFields() {
        return ResponseEntity.ok(service.getAllFields());
    }

    @PostMapping
    public ResponseEntity<String> createField(@Valid @RequestBody FieldInputDTO input) {
        service.createField(input);
        return ResponseEntity.ok("Field created successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateField(@PathVariable Long id, @Valid @RequestBody FieldInputDTO input) {
        service.updateField(id, input);
        return ResponseEntity.ok("Field updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteField(@PathVariable Long id) {
        service.deleteField(id);
        return ResponseEntity.ok("Field deleted successfully");
    }
}

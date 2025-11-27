package ir.kghobad.thesis_defense_time_schedular.controller.admin;

import ir.kghobad.thesis_defense_time_schedular.service.admin.AdminFormService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/forms")
@RequiredArgsConstructor
public class AdminFormController {
    private final AdminFormService service;

    @GetMapping
    public ResponseEntity<?> listForms() {
        return ResponseEntity.ok(service.listForms());
    }

    @PostMapping("/{formId}/approve")
    public ResponseEntity<?> approveForm(@PathVariable Long formId) {
        service.approveForm(formId);
        return ResponseEntity.ok("Form approved successfully");
    }

    @PostMapping("/{formId}/reject")
    public ResponseEntity<?> rejectForm(@PathVariable Long formId) {
        service.rejectForm(formId);
        return ResponseEntity.ok("Admin action performed successfully");
    }

}

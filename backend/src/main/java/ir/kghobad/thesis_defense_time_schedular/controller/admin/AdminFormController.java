package ir.kghobad.thesis_defense_time_schedular.controller.admin;

import ir.kghobad.thesis_defense_time_schedular.model.dto.form.FormRejectionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.RequestRevisionInputDTO;
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

    @PostMapping("/reject")
    public ResponseEntity<?> rejectForm(@RequestBody FormRejectionInputDTO input) {
        service.rejectForm(input);
        return ResponseEntity.ok("Admin action performed successfully");
    }

    @PostMapping("/request-revision")
    public ResponseEntity<?> requestRevision(@RequestBody RequestRevisionInputDTO input) {
        service.requestRevision(input);
        return ResponseEntity.ok("Revision requested successfully");
    }

    @PostMapping("/{formId}/submit-revision")
    public ResponseEntity<?> submitRevision(@PathVariable Long formId) {
        service.submitRevision(formId);
        return ResponseEntity.ok("Revision submitted successfully");
    }

}

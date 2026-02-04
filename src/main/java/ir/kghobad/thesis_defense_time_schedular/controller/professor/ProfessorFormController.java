package ir.kghobad.thesis_defense_time_schedular.controller.professor;

import ir.kghobad.thesis_defense_time_schedular.model.dto.form.FormRejectionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.RequestRevisionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.service.professor.ProfessorFormService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professor/forms")
@RequiredArgsConstructor
public class ProfessorFormController {
    private final ProfessorFormService service;

    @GetMapping
    public ResponseEntity<List<ThesisFormOutputDTO>> getThesisForms() {
        return ResponseEntity.ok(service.getThesisForms());
    }

    @PostMapping("/reject")
    public ResponseEntity<?> rejectForm(@RequestBody FormRejectionInputDTO input) {
        service.rejectForm(input);
        return ResponseEntity.ok("Form rejected");
    }

    @PostMapping("/{formId}/approve")
    public ResponseEntity<?> approveForm(@PathVariable Long formId) {
        service.approveFormAsProfessor(formId);
        return ResponseEntity.ok("Form approved");
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

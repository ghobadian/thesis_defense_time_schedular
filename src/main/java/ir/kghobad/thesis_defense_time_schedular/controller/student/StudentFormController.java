package ir.kghobad.thesis_defense_time_schedular.controller.student;


import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.service.student.StudentFormService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student/forms")
@RequiredArgsConstructor
public class StudentFormController {
    private final StudentFormService formService;

    @PostMapping
    public ResponseEntity<?> createForm(@RequestBody ThesisFormInputDTO formDTO) {
        formService.createThesisForm(formDTO);
        return ResponseEntity.ok("Thesis form created successfully");
    }

    @PutMapping("/{formId}/update")
    public ResponseEntity<?> updateForm(@PathVariable Long formId, @RequestBody ThesisFormInputDTO formDTO) {
        formService.updateThesisForm(formId, formDTO);
        return ResponseEntity.ok("Thesis form updated successfully");
    }

    @GetMapping
    public ResponseEntity<List<ThesisFormOutputDTO>> getThesisForms() {
        return ResponseEntity.ok(formService.getThesisForms());
    }

    @PostMapping("/{formId}/submit-revision")
    public ResponseEntity<?> submitRevision(@PathVariable Long formId) {
        formService.submitRevision(formId);
        return ResponseEntity.ok("Revision submitted successfully");
    }
}

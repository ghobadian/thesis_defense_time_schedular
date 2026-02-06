package ir.kghobad.thesis_defense_time_schedular.service.admin;

import ir.kghobad.thesis_defense_time_schedular.dao.ThesisFormRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.FormRejectionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.RequestRevisionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.service.form.FormService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminFormService implements FormRevisionService {
    private final ThesisFormRepository formRepository;
    private final FormService formService;;

    public List<ThesisFormOutputDTO> listForms() {
        return formRepository.findAllFormsForAdmin().stream().map(ThesisFormOutputDTO::from).toList();
    }

    public void approveForm(Long formId) {
        var form = formRepository.findById(formId).orElseThrow(() -> new IllegalArgumentException("Form not found"));
        if (!form.isApprovedByInstructor()) {
            throw new IllegalStateException("Form must be approved by instructor first");
        }
        updateAcceptedForm(form);
        formRepository.save(form);
    }

    private static void updateAcceptedForm(ThesisForm form) {
        form.setState(FormState.ADMIN_APPROVED);
        updateFormTimeState(form);
    }

    private static void updateFormTimeState(ThesisForm form) {
        LocalDateTime now = LocalDateTime.now();
        form.setUpdateDate(now);
        form.setAdminReviewedAt(now);
    }


    public void rejectForm(FormRejectionInputDTO input) {
        var form = formRepository.findById(input.getFormId()).orElseThrow(() -> new IllegalArgumentException("Form not found"));
        if (!form.isApprovedByInstructor()) {
            throw new IllegalStateException("Form must be approved by instructor first");
        }
        updateRejectedForm(input, form);
        formRepository.save(form);
    }

    private static void updateRejectedForm(FormRejectionInputDTO input, ThesisForm form) {
        form.setState(FormState.ADMIN_REJECTED);
        updateFormTimeState(form);
        form.setRejectionReason(input.getRejectionReason());
    }

    @Override
    public void requestRevision(RequestRevisionInputDTO input) {
        ThesisForm form = formRepository.findById(input.getId())
                .orElseThrow(() -> new EntityNotFoundException("Form not found"));

        validateRevisionState(form);

        FormState newState = switch (input.getTarget()) {
            case STUDENT -> FormState.ADMIN_REVISION_REQUESTED_FOR_STUDENT;
            case INSTRUCTOR -> FormState.ADMIN_REVISION_REQUESTED_FOR_INSTRUCTOR;
            default -> throw new IllegalArgumentException("Admin can only request revision from Student or Instructor");
        };

        form.setState(newState);
        form.setRevisionMessage(input.getMessage());
        form.setRevisionRequestedAt(LocalDateTime.now());
        formRepository.save(form);
    }

    private static void validateRevisionState(ThesisForm form) {
        if (form.getState() != FormState.INSTRUCTOR_APPROVED &&
                form.getState() != FormState.MANAGER_REVISION_REQUESTED_FOR_ADMIN) {
            throw new IllegalStateException("Form must be in INSTRUCTOR_APPROVED state");
        }
    }


    public void submitRevision(Long formId) {
        ThesisForm form = formRepository.findById(formId)
                .orElseThrow(() -> new EntityNotFoundException("Form not found"));

        if (!form.getState().isForAdminRevisionRequested()) {
            throw new IllegalStateException("Only forms requested for admin revision can be submitted");
        }

        formService.submitRevision(form);
    }
}

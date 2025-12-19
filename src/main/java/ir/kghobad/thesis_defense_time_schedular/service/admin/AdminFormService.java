package ir.kghobad.thesis_defense_time_schedular.service.admin;

import ir.kghobad.thesis_defense_time_schedular.dao.ThesisFormRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.FormRejectionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminFormService {
    private final ThesisFormRepository thesisFormRepository;

    public List<ThesisFormOutputDTO> listForms() {
        return thesisFormRepository.findAllInstructorApprovedThesisForms().stream().map(ThesisFormOutputDTO::from).toList();
    }

    public void approveForm(Long formId) {
        var form = thesisFormRepository.findById(formId).orElseThrow(() -> new IllegalArgumentException("Form not found"));
        if (!form.isApprovedByInstructor()) {
            throw new IllegalStateException("Form must be approved by instructor first");
        }
        updateAcceptedForm(form);
        thesisFormRepository.save(form);
    }

    private static void updateAcceptedForm(ThesisForm form) {
        form.setState(FormState.ADMIN_APPROVED);
        updateFormTimeState(form);
    }

    private static void updateFormTimeState(ThesisForm form) {
        Date now = new Date();
        form.setUpdateDate(now);
        form.setAdminReviewedAt(now);
    }


    public void rejectForm(FormRejectionInputDTO input) {
        var form = thesisFormRepository.findById(input.getFormId()).orElseThrow(() -> new IllegalArgumentException("Form not found"));
        if (!form.isApprovedByInstructor()) {
            throw new IllegalStateException("Form must be approved by instructor first");
        }
        updateRejectedForm(input, form);
        thesisFormRepository.save(form);
    }

    private static void updateRejectedForm(FormRejectionInputDTO input, ThesisForm form) {
        form.setState(FormState.ADMIN_REJECTED);
        updateFormTimeState(form);
        form.setRejectionReason(input.getRejectionReason());
    }
}

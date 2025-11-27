package ir.kghobad.thesis_defense_time_schedular.service.admin;

import ir.kghobad.thesis_defense_time_schedular.dao.ThesisFormRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormOutputDTO;
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
        form.setState(FormState.ADMIN_APPROVED);
        form.setUpdateDate(new Date());
        thesisFormRepository.save(form);
    }


    public void rejectForm(Long formId) {
        var form = thesisFormRepository.findById(formId).orElseThrow(() -> new IllegalArgumentException("Form not found"));
        if (!form.isApprovedByInstructor()) {
            throw new IllegalStateException("Form must be approved by instructor first");
        }
        form.setState(FormState.ADMIN_REJECTED);
        form.setUpdateDate(new Date());
        thesisFormRepository.save(form);
    }
}

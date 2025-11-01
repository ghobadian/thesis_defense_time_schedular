package ir.kghobad.thesis_defense_time_schedular.service;

import ir.kghobad.thesis_defense_time_schedular.dao.ThesisFormRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    private final ThesisFormRepository thesisFormRepository;

    public AdminService(ThesisFormRepository thesisFormRepository) {
        this.thesisFormRepository = thesisFormRepository;
    }

    public List<ThesisFormOutputDTO> listForms() {
        return thesisFormRepository.findAllInstructorApprovedThesisForms().stream().map(ThesisFormOutputDTO::from).toList();
    }

    public void approveForm(Long formId) {
        var form = thesisFormRepository.findById(formId).orElseThrow(() -> new IllegalArgumentException("Form not found"));
        if (!form.isApprovedByInstructor()) {
            throw new IllegalStateException("Form must be approved by instructor first");
        }
        form.setState(FormState.ADMIN_APPROVED);
        thesisFormRepository.save(form);
    }


    public void rejectForm(Long formId) {
        var form = thesisFormRepository.findById(formId).orElseThrow(() -> new IllegalArgumentException("Form not found"));
        if (!form.isApprovedByInstructor()) {
            throw new IllegalStateException("Form must be approved by instructor first");
        }
        form.setState(FormState.ADMIN_REJECTED);
        thesisFormRepository.save(form);
    }
}

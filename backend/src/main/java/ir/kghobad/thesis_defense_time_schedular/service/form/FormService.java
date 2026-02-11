package ir.kghobad.thesis_defense_time_schedular.service.form;

import ir.kghobad.thesis_defense_time_schedular.dao.ThesisFormRepository;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class FormService {
    private final ThesisFormRepository formRepository;

    public void submitRevision(ThesisForm form) {
        if (!form.getState().isRevisionRequested()) {
            throw new IllegalStateException("Form is not in a revision state");
        }

        FormState nextState = form.getState().getStateAfterRevisionSubmitted();
        form.setState(nextState);
        form.setRevisionMessage(null);
        form.setRevisionRequestedAt(null);
        formRepository.save(form);
    }
}

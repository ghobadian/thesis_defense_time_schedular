package ir.kghobad.thesis_defense_time_schedular.service.admin;

import ir.kghobad.thesis_defense_time_schedular.model.dto.form.RequestRevisionInputDTO;

public interface FormRevisionService {
    void requestRevision(RequestRevisionInputDTO input);
    void submitRevision(Long formId);
}

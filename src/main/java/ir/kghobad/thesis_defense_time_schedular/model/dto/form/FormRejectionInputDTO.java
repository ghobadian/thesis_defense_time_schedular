package ir.kghobad.thesis_defense_time_schedular.model.dto.form;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FormRejectionInputDTO {
    private Long formId;
    private String rejectionReason;
}

package ir.kghobad.thesis_defense_time_schedular.model.dto.form;

import ir.kghobad.thesis_defense_time_schedular.model.enums.RevisionTarget;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestRevisionInputDTO {
    private Long id;
    private RevisionTarget target;
    private String message;
}

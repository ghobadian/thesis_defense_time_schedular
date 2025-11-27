package ir.kghobad.thesis_defense_time_schedular.model.dto.form;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class FormSuggestionInputDTO {
    private Long formId;
    private List<Long> juryIds;
}

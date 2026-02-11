package ir.kghobad.thesis_defense_time_schedular.model.dto.form;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ThesisFormInputDTO {
    private String title;
    private String abstractText;
    private Long instructorId;
}

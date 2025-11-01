package ir.kghobad.thesis_defense_time_schedular.model.dto;

import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class ThesisFormOutputDTO {
    private String title;
    private String abstractText;
    private Long studentId;


    public static ThesisFormOutputDTO from(ThesisForm input) {
        ThesisFormOutputDTO output = new ThesisFormOutputDTO();
        output.setTitle(input.getTitle());
        output.setAbstractText(input.getAbstractText());
        output.setStudentId(input.getStudent().getId());
        return output;
    }
}

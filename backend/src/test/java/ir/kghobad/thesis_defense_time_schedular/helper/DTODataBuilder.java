package ir.kghobad.thesis_defense_time_schedular.helper;

import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormInputDTO;
import org.springframework.stereotype.Component;

@Component
public class DTODataBuilder {
    public ThesisFormInputDTO createThesisFormInputDTO(String title, String abstractText, Long instructorId) {
        ThesisFormInputDTO dto = new ThesisFormInputDTO();
        dto.setTitle(title);
        dto.setAbstractText(abstractText);
        dto.setInstructorId(instructorId);
        return dto;
    }
}

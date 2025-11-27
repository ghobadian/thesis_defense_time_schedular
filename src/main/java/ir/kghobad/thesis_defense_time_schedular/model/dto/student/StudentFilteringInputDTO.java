package ir.kghobad.thesis_defense_time_schedular.model.dto.student;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentFilteringInputDTO {
    private String search;
    private Long departmentId;
    private Integer page;
    private String limit;
}

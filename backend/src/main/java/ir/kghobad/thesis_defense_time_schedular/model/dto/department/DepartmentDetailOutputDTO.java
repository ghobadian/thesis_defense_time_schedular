package ir.kghobad.thesis_defense_time_schedular.model.dto.department;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepartmentDetailOutputDTO {
    private Long id;
    private String name;
    private Integer studentCount;
    private Integer professorCount;
    private Integer fieldCount;
    private Integer activeThesisCount;
}

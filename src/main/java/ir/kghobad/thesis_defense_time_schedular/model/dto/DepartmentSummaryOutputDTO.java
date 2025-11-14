package ir.kghobad.thesis_defense_time_schedular.model.dto;

import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepartmentSummaryOutputDTO {
    private Long id;
    private String name;

    public static DepartmentSummaryOutputDTO from(Department department) {
        DepartmentSummaryOutputDTO dto = new DepartmentSummaryOutputDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());
        return dto;
    }
}

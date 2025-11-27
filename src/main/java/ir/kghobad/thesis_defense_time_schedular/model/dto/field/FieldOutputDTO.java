package ir.kghobad.thesis_defense_time_schedular.model.dto.field;

import ir.kghobad.thesis_defense_time_schedular.model.dto.department.DepartmentSummaryOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FieldOutputDTO {
    private Long id;
    private String name;
    private DepartmentSummaryOutputDTO department;


    public static FieldOutputDTO from(Field field) {
        FieldOutputDTO dto = new FieldOutputDTO();
        dto.setId(field.getId());
        dto.setName(field.getName());
        dto.setDepartment(DepartmentSummaryOutputDTO.from(field.getDepartment()));
        return dto;
    }

}

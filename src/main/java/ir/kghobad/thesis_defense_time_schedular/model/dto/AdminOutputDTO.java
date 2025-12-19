package ir.kghobad.thesis_defense_time_schedular.model.dto;

import ir.kghobad.thesis_defense_time_schedular.model.dto.department.DepartmentSummaryOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.field.FieldOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Admin;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class AdminOutputDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private FieldOutputDTO field;
    private DepartmentSummaryOutputDTO department;
    private Date creationDate;

    public static AdminOutputDTO from(Admin admin) {
        AdminOutputDTO dto = new AdminOutputDTO();
        dto.setId(admin.getId().toString());
        dto.setFirstName(admin.getFirstName());
        dto.setLastName(admin.getLastName());
        dto.setEmail(admin.getEmail());
        dto.setPhoneNumber(admin.getPhoneNumber());
        dto.setDepartment(DepartmentSummaryOutputDTO.from(admin.getDepartment()));
        dto.setCreationDate(admin.getCreationDate());
        return dto;
    }
}

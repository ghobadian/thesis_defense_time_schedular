package ir.kghobad.thesis_defense_time_schedular.model.dto.user.professor;

import ir.kghobad.thesis_defense_time_schedular.model.dto.department.DepartmentSummaryOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.field.FieldOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ProfessorOutputDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private FieldOutputDTO field;
    private DepartmentSummaryOutputDTO department;
    private LocalDateTime creationDate;
    private boolean isManager;

    public static ProfessorOutputDTO from(Professor professor) {
        ProfessorOutputDTO dto = new ProfessorOutputDTO();
        dto.setId(professor.getId().toString());
        dto.setFirstName(professor.getFirstName());
        dto.setLastName(professor.getLastName());
        dto.setEmail(professor.getEmail());
        dto.setPhoneNumber(professor.getPhoneNumber());
        dto.setField(FieldOutputDTO.from(professor.getField()));
        dto.setDepartment(DepartmentSummaryOutputDTO.from(professor.getDepartment()));
        dto.setCreationDate(professor.getCreationDate());
        dto.setManager(professor.isManager());
        return dto;
    }
}

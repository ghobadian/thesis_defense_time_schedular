package ir.kghobad.thesis_defense_time_schedular.model.dto;

import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StudentOutputDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String studentNumber;
    private FieldOutputDTO field;
    private DepartmentSummaryOutputDTO department;
    private List<ThesisFormOutputDTO> thesisForms;


    public static StudentOutputDTO from(Student student) {
        StudentOutputDTO dto = new StudentOutputDTO();
        dto.setId(student.getId().toString());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setEmail(student.getEmail());
        dto.setPhoneNumber(student.getPhoneNumber());
        dto.setStudentNumber(student.getStudentNumber().toString());
        dto.setField(FieldOutputDTO.from(student.getField()));
        dto.setDepartment(DepartmentSummaryOutputDTO.from(student.getDepartment()));
        dto.setThesisForms(student.getThesisForms());
        return dto;
    }
}

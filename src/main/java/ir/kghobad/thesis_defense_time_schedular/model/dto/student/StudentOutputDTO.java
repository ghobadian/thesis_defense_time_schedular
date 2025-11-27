package ir.kghobad.thesis_defense_time_schedular.model.dto.student;

import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.department.DepartmentSummaryOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.field.FieldOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.Optional;

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
    private Date creationDate;
    private Boolean isGraduated;


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
        dto.setCreationDate(student.getCreationDate());
        dto.setIsGraduated(Optional.ofNullable(student.getGraduationDate()).map(g -> g.after(new Date())).orElse(false));
        return dto;
    }
}

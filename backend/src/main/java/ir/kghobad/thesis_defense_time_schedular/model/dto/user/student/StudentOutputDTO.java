package ir.kghobad.thesis_defense_time_schedular.model.dto.user.student;

import ir.kghobad.thesis_defense_time_schedular.model.dto.user.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.department.DepartmentSummaryOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.field.FieldOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.model.enums.StudentType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
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
    private SimpleUserOutputDto instructor;
    private LocalDateTime creationDate;
    private Boolean isGraduated;
    private StudentType studentType;


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
        dto.setIsGraduated(student.isGraduated());
        dto.setStudentType(student.getStudentType());
        dto.setInstructor(SimpleUserOutputDto.from(student.getInstructor()));
        return dto;
    }
}

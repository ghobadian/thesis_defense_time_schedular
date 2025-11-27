package ir.kghobad.thesis_defense_time_schedular.model.dto.student;

import ir.kghobad.thesis_defense_time_schedular.model.enums.StudentType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentRegistrationInputDTO {
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number should be valid")
    private String phoneNumber;
    
    @NotNull(message = "Student number is required")
    private Long studentNumber;
    
    @NotNull(message = "Student type is required")
    private StudentType studentType;
    
    @NotNull(message = "Department ID is required")
    private Long departmentId;
    
    @NotNull(message = "Field ID is required")
    private Long fieldId;
    
    @NotNull(message = "Instructor ID is required")
    private Long instructorId;
    
    @NotBlank(message = "Password is required")
    private String password;

    public StudentRegistrationInputDTO(String firstName, String lastName, String email, String phoneNumber, Long studentNumber, StudentType studentType, Long departmentId, Long fieldId, Long instructorId, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.studentNumber = studentNumber;
        this.studentType = studentType;
        this.departmentId = departmentId;
        this.fieldId = fieldId;
        this.instructorId = instructorId;
        this.password = password;
    }
}

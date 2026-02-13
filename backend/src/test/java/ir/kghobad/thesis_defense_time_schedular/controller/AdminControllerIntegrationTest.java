package ir.kghobad.thesis_defense_time_schedular.controller;

import com.fasterxml.jackson.databind.JsonNode;
import ir.kghobad.thesis_defense_time_schedular.helper.apiHelper.AdminMockHelper;
import ir.kghobad.thesis_defense_time_schedular.helper.BaseIntegrationTest;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.student.PasswordChangeInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.student.StudentRegistrationInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Admin;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.StudentType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static ir.kghobad.thesis_defense_time_schedular.helper.TestDataBuilder.DEFAULT_PASSWORD;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AdminControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private AdminMockHelper adminMockHelper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testRegisterSingleStudent_Success() throws Exception {
        Department dept = departmentRepository.save(testDataBuilder.createDepartment("Computer Science"));
        Field field = fieldRepository.save(testDataBuilder.createField("Software Engineering", dept));
        Professor instructor = professorRepository.save(
            testDataBuilder.createProfessor("instructor@test.com", "Instructor", "Prof", dept, "09901234567")
        );
        Admin admin = adminRepository.save(testDataBuilder.createAdmin("admin@test.com", "Admin", "User", "09123456789"));
        
        String token = getAuthToken("admin@test.com", DEFAULT_PASSWORD);

        StudentRegistrationInputDTO registrationInputDTO = testDataBuilder.getRegistrationInputDTO(dept, field, instructor);
        adminMockHelper.registerStudents(List.of(registrationInputDTO), token);

        assertEquals(1, studentRepository.count());
        assertEquals(1, professorRepository.count());
        assertEquals(1, departmentRepository.count());
        assertEquals(1, fieldRepository.count());
        assertEquals(1, adminRepository.count());
        String studentName = studentRepository.findByPhoneNumber(registrationInputDTO.getPhoneNumber()).map(Student::getFirstName).orElseThrow();
        assertEquals(registrationInputDTO.getFirstName(), studentName);
    }


    @Test
    public void testRegisterMultipleStudents_Success() throws Exception {//TODO assert that no test uses mockMVC directly
        Department dept = departmentRepository.save(testDataBuilder.createDepartment("Computer Science"));
        Field field = fieldRepository.save(testDataBuilder.createField("Software Engineering", dept));
        Professor instructor = professorRepository.save(
            testDataBuilder.createProfessor("instructor@test.com", "Instructor", "Prof", dept, "09901234567")
        );
        Admin admin = adminRepository.save(testDataBuilder.createAdmin("admin@test.com", "Admin", "User", "09123456789"));
        
        String token = getAuthToken("admin@test.com", DEFAULT_PASSWORD);
        
        List<StudentRegistrationInputDTO> dtos = Arrays.asList(
            new StudentRegistrationInputDTO(
                "Student", "One", "student1@test.com", "09121234567",
                12345L, StudentType.MASTER, dept.getId(), field.getId(),
                instructor.getId(), DEFAULT_PASSWORD
            ),
            new StudentRegistrationInputDTO(
                "Student", "Two", "student2@test.com", "09121234568",
                12346L, StudentType.PHD, dept.getId(), field.getId(),
                instructor.getId(), DEFAULT_PASSWORD
            )
        );

        adminMockHelper.registerStudents(dtos, token);
        

        assertEquals(2, studentRepository.count());
    }
    
    @Test
    public void testRegisterStudent_Unauthorized() throws Exception {
        StudentRegistrationInputDTO dto = new StudentRegistrationInputDTO(
            "Student", "One", "student1@test.com", "09121234567",
            12345L, StudentType.MASTER, 1L, 1L, 1L, DEFAULT_PASSWORD
        );


        mockMvc.perform(post("/admin/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testListForms() throws Exception {
        Department dept = departmentRepository.save(testDataBuilder.createDepartment("Computer Science"));
        Field field = fieldRepository.save(testDataBuilder.createField("Software Engineering", dept));
        Professor instructor = professorRepository.save(
                testDataBuilder.createProfessor("instructor@test.com", "Instructor", "Prof", dept, "09901234567")
        );
        Student student1 = studentRepository.save(testDataBuilder.createStudent("student1@test.com", "Student", "One", 12345L,
                StudentType.MASTER, dept, field, instructor, "09121234567"));
        ThesisForm submittedForm = thesisFormRepository.save(testDataBuilder.createThesisForm("Form 1", "abstract", student1, instructor, FormState.SUBMITTED, LocalDateTime.now(), field));
        ThesisForm instructorApprovedForm = thesisFormRepository.save(testDataBuilder.createThesisForm("Form 2", "abstract", student1, instructor, FormState.INSTRUCTOR_APPROVED, LocalDateTime.now(), field));
        ThesisForm adminApprovedForm = thesisFormRepository.save(testDataBuilder.createThesisForm("Form 3", "abstract", student1, instructor, FormState.ADMIN_APPROVED, LocalDateTime.now(), field));
        ThesisForm adminRejectedForm = thesisFormRepository.save(testDataBuilder.createThesisForm("Form 4", "abstract", student1, instructor, FormState.ADMIN_REJECTED, LocalDateTime.now(), field));
        ThesisForm managerApprovedForm = thesisFormRepository.save(testDataBuilder.createThesisForm("Form 5", "abstract", student1, instructor, FormState.MANAGER_APPROVED, LocalDateTime.now(), field));

        adminRepository.save(testDataBuilder.createAdmin("admin@test.com", "Admin", "User", "09123456789"));
        String token = getAuthToken("admin@test.com", DEFAULT_PASSWORD);

        MockHttpServletResponse authorization = mockMvc.perform(get("/admin/forms")
                        .header("Authorization", "Bearer " + token)
                )
                .andExpect(status().isOk())
                .andReturn().getResponse();
        JsonNode result = objectMapper.readTree(authorization.getContentAsString());
        assertEquals(2, result.size());
        assertEquals(instructorApprovedForm.getTitle(), result.get(0).get("title").asText());
        assertEquals(instructorApprovedForm.getStudent().getId(), result.get(0).get("studentId").longValue());
        assertEquals(instructorApprovedForm.getAbstractText(), result.get(0).get("abstractText").asText());

        assertEquals(adminRejectedForm.getTitle(), result.get(1).get("title").asText());
        assertEquals(adminRejectedForm.getStudent().getId(), result.get(1).get("studentId").longValue());
        assertEquals(adminRejectedForm.getAbstractText(), result.get(1).get("abstractText").asText());
    }

    @Test
    public void testChangePassword() throws Exception {
        adminRepository.save(testDataBuilder.createAdmin("admin@test.com", "Admin", "User", "09123456789"));
        String token = getAuthToken("admin@test.com", DEFAULT_PASSWORD);

        PasswordChangeInputDTO input = new PasswordChangeInputDTO();
        input.setCurrentPassword(DEFAULT_PASSWORD);
        String newPassword = "password1234";
        input.setNewPassword(newPassword);
        adminMockHelper.changePassword(input, token);

        Admin admin = adminRepository.findByEmail("admin@test.com").orElseThrow();
        assertTrue(passwordEncoder.matches(newPassword, admin.getPassword()));
    }
}

package ir.kghobad.thesis_defense_time_schedular.controller;

import com.fasterxml.jackson.databind.JsonNode;
import ir.kghobad.thesis_defense_time_schedular.model.dto.student.StudentRegistrationInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Admin;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.StudentType;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static ir.kghobad.thesis_defense_time_schedular.helper.TestDataBuilder.DEFAULT_PASSWORD;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AdminControllerIntegrationTest extends BaseIntegrationTest {
    
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
        mockMvc.perform(post("/admin/register-student")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationInputDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Student registered successfully"));

        assertEquals(1, studentRepository.count());
        assertEquals(1, professorRepository.count());
        assertEquals(1, departmentRepository.count());
        assertEquals(1, fieldRepository.count());
        assertEquals(1, adminRepository.count());
        String studentName = studentRepository.findByPhoneNumber(registrationInputDTO.getPhoneNumber()).map(Student::getFirstName).orElseThrow();
        assertEquals(registrationInputDTO.getFirstName(), studentName);
    }


    @Test
    public void testRegisterMultipleStudents_Success() throws Exception {
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
        
        mockMvc.perform(post("/admin/register-students")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtos)))
                .andExpect(status().isOk())
                .andExpect(content().string("Students registered successfully"));

        assertEquals(2, studentRepository.count());
    }
    
    @Test
    public void testRegisterStudent_Unauthorized() throws Exception {
        StudentRegistrationInputDTO dto = new StudentRegistrationInputDTO(
            "Student", "One", "student1@test.com", "09121234567",
            12345L, StudentType.MASTER, 1L, 1L, 1L, DEFAULT_PASSWORD
        );
        
        mockMvc.perform(post("/admin/register-student")
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
        ThesisForm submittedForm = thesisFormRepository.save(testDataBuilder.createThesisForm("Form 1", "abstract", student1, instructor, FormState.SUBMITTED, new Date(), field));
        ThesisForm instructorApprovedForm = thesisFormRepository.save(testDataBuilder.createThesisForm("Form 2", "abstract", student1, instructor, FormState.INSTRUCTOR_APPROVED, new Date(), field));
        ThesisForm adminApprovedForm = thesisFormRepository.save(testDataBuilder.createThesisForm("Form 3", "abstract", student1, instructor, FormState.ADMIN_APPROVED, new Date(), field));
        ThesisForm adminRejectedForm = thesisFormRepository.save(testDataBuilder.createThesisForm("Form 4", "abstract", student1, instructor, FormState.ADMIN_REJECTED, new Date(), field));
        ThesisForm managerApprovedForm = thesisFormRepository.save(testDataBuilder.createThesisForm("Form 5", "abstract", student1, instructor, FormState.MANAGER_APPROVED, new Date(), field));

        adminRepository.save(testDataBuilder.createAdmin("admin@test.com", "Admin", "User", "09123456789"));
        String token = getAuthToken("admin@test.com", DEFAULT_PASSWORD);

        MockHttpServletResponse authorization = mockMvc.perform(get("/admin/forms")
                        .header("Authorization", "Bearer " + token)
                )
                .andExpect(status().isOk())
                .andReturn().getResponse();
        JsonNode result = objectMapper.readTree(authorization.getContentAsString());
        assertEquals(1, result.size());
        assertEquals(instructorApprovedForm.getTitle(), result.get(0).get("title").asText());
        assertEquals(instructorApprovedForm.getStudent().getId(), result.get(0).get("studentId").longValue());
        assertEquals(instructorApprovedForm.getAbstractText(), result.get(0).get("abstractText").asText());
    }
}

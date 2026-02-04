package ir.kghobad.thesis_defense_time_schedular.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ir.kghobad.thesis_defense_time_schedular.helper.BaseIntegrationTest;
import ir.kghobad.thesis_defense_time_schedular.helper.StudentMockHelper;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.model.enums.StudentType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static ir.kghobad.thesis_defense_time_schedular.helper.TestDataBuilder.DEFAULT_PASSWORD;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class StudentControllerIntegrationTest extends BaseIntegrationTest {//todo assert that no controller integration test uses mock mvc. all must depend on their own mock helper

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private StudentMockHelper studentMockHelper;

    @Test
    void testCreateThesisForm() throws Exception {

        Department department = testDataBuilder.createDepartment("Computer Science");
        departmentRepository.save(department);

        Field field = testDataBuilder.createField("Software Engineering", department);
        fieldRepository.save(field);

        Professor professor = testDataBuilder.createProfessor(
            "professor@university.edu", "John", "Doe", department, "09123456789"
        );
        professorRepository.save(professor);
        Student student = testDataBuilder.createStudent(
            "student1@university.edu", "Jane", "Smith", 12345L,
            StudentType.MASTER, department, field, professor, "09121234567"
        );
        studentRepository.save(student);

        ThesisFormInputDTO formDTO = dtoDataBuilder.createThesisFormInputDTO(
            "My Master Thesis", "This is the abstract", professor.getId()
        );


        String token = getAuthToken("student1@university.edu", DEFAULT_PASSWORD);
        studentMockHelper.createThesisForm(formDTO, token);
    }
}

package ir.kghobad.thesis_defense_time_schedular.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ir.kghobad.thesis_defense_time_schedular.BaseIntegrationTest;
import ir.kghobad.thesis_defense_time_schedular.model.dto.LoginDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.TimeSlotDTO;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.TimePeriod;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;

import java.util.Arrays;
import java.util.Calendar;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SqlGroup({
    @Sql(scripts = "/test-data/insert-test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD),
    @Sql(scripts = "/test-data/professor-test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD),
    @Sql(scripts = "/test-data/cleanup-test-data.sql", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
})
class ProfessorControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    private final String professorEmail = "hassan.najafi@kntu.ac.ir";
    private final String managerProfessorEmail = "zahra.ebrahimi@kntu.ac.ir";
    private final String password = "password123";

    private String professorToken;
    private String managerToken;

    @BeforeEach
    void setUp() throws Exception {
        professorToken = loginAndGetToken(professorEmail, password);
        managerToken = loginAndGetToken(managerProfessorEmail, password);
    }

    private String loginAndGetToken(String email, String password) throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail(email);
        loginDTO.setPassword(password);

        String response = mockMvc.perform(post("/professor/login")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response).get("token").asText();
    }

    @Test
    void testProfessorLogin() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail(professorEmail);
        loginDTO.setPassword(password);

        mockMvc.perform(post("/professor/login")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.role").value("PROFESSOR"))
                .andExpect(jsonPath("$.email").value(professorEmail));
    }

    @Test
    void testInstructorAcceptForm() throws Exception {
        mockMvc.perform(post("/professor/2/accept-form/1")
                .header("Authorization", "Bearer " + professorToken))
                .andExpect(status().isOk())
                .andExpect(content().string("Form accepted"));

        // Verify form state changed
        mockMvc.perform(get("/professor/forms/1")
                .header("Authorization", "Bearer " + professorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.state").value(FormState.INSTRUCTOR_APPROVED.name()));
    }

    @Test
    void testManagerAcceptForm() throws Exception {
        // First, instructor must approve
        mockMvc.perform(post("/professor/2/accept-form/1")
                .header("Authorization", "Bearer " + professorToken))
                .andExpect(status().isOk());

        // Then manager can approve
        mockMvc.perform(post("/professor/4/accept-form/1")
                .header("Authorization", "Bearer " + managerToken))
                .andExpect(status().isOk())
                .andExpect(content().string("Form accepted"));
    }

    @Test
    void testRejectForm() throws Exception {
        mockMvc.perform(post("/professor/2/reject-form/1")
                .header("Authorization", "Bearer " + professorToken))
                .andExpect(status().isOk())
                .andExpect(content().string("Form rejected"));

        // Verify form state changed
        mockMvc.perform(get("/professor/forms/1")
                .header("Authorization", "Bearer " + professorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.state").value(FormState.INSTRUCTOR_REJECTED.name()));
    }

    @Test
    void testSuggestJuries() throws Exception {
        // Form must be approved by manager first
        insertCustomData("UPDATE thesis_form SET state = 'MANAGER_APPROVED' WHERE id = 1");

        mockMvc.perform(post("/professor/suggest-juries/1")
                .header("Authorization", "Bearer " + professorToken)
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(Arrays.asList(2L, 3L, 4L))))
                .andExpect(status().isOk())
                .andExpect(content().string("Juries suggested"));
    }

    @Test
    void testSpecifyAvailableTime() throws Exception {
        // Create a defense meeting first
        insertCustomData("INSERT INTO thesis_defense_meeting (id, thesis_form_id) VALUES (1, 1)");

        TimeSlotDTO dto = new TimeSlotDTO();
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, 7); // Next week
        dto.setDate(cal.getTime());
        dto.setTimePeriod(TimePeriod.PERIOD_10_30_12_00);
        dto.setMeetingId(1L);

        mockMvc.perform(post("/professor/give-time")
                .param("professorId", "2")
                .header("Authorization", "Bearer " + professorToken)
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().string("Time slot added"));
    }

    @Test
    void testUnauthorizedProfessorAccess() throws Exception {
        // Professor 2 trying to act as Professor 3
        mockMvc.perform(post("/professor/3/accept-form/1")
                .header("Authorization", "Bearer " + professorToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testGetProfessorForms() throws Exception {
        mockMvc.perform(get("/professor/2/forms")
                .header("Authorization", "Bearer " + professorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].instructor.id").value(2));
    }
}

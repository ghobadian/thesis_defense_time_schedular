package ir.kghobad.thesis_defense_time_schedular.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ir.kghobad.thesis_defense_time_schedular.BaseIntegrationTest;
import ir.kghobad.thesis_defense_time_schedular.model.dto.LoginDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.ThesisFormDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class StudentControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testStudentLogin() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("student1@university.edu");
        loginDTO.setPassword("password123");

        mockMvc.perform(post("/student/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.email").value("student1@university.edu"))
                .andExpect(jsonPath("$.role").value("STUDENT"));
    }

    @Test
    void testCreateThesisForm() throws Exception {
        // First login to get token
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("student1@university.edu");
        loginDTO.setPassword("password123");

        String response = mockMvc.perform(post("/student/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String token = objectMapper.readTree(response).get("token").asText();

        // Create thesis form
        ThesisFormDTO formDTO = new ThesisFormDTO();
        formDTO.setTitle("My Master Thesis");
        formDTO.setAbstractText("This is the abstract");

        mockMvc.perform(post("/student/create-form")
                .param("studentId", "5")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(formDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.student.id").value(5))
                .andExpect(jsonPath("$.state").value("DRAFT"));
    }
}

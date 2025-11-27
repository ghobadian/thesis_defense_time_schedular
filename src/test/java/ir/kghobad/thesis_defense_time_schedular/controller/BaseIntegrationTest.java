package ir.kghobad.thesis_defense_time_schedular.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ir.kghobad.thesis_defense_time_schedular.dao.*;
import ir.kghobad.thesis_defense_time_schedular.helper.DTODataBuilder;
import ir.kghobad.thesis_defense_time_schedular.helper.TestDataBuilder;
import ir.kghobad.thesis_defense_time_schedular.model.dto.auth.LoginDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@IntegrationTest
public abstract class BaseIntegrationTest {
    
    @Autowired
    protected MockMvc mockMvc;
    
    @Autowired
    protected ObjectMapper objectMapper;
    
    @Autowired
    protected TestDataBuilder testDataBuilder;

    @Autowired
    @PersistenceContext
    protected EntityManager entityManager;
    
    @Autowired
    protected UserRepository userRepository;
    
    @Autowired
    protected DepartmentRepository departmentRepository;
    
    @Autowired
    protected FieldRepository fieldRepository;
    
    @Autowired
    protected ProfessorRepository professorRepository;
    
    @Autowired
    protected StudentRepository studentRepository;
    
    @Autowired
    protected AdminRepository adminRepository;
    
    @Autowired
    protected ThesisFormRepository thesisFormRepository;
    
    @Autowired
    protected TimeSlotRepository timeSlotRepository;

    @Autowired
    protected ThesisDefenseMeetingRepository thesisDefenseMeetingRepository;

    @Autowired
    protected DTODataBuilder dtoDataBuilder;


    protected String getAuthToken(String email, String password) throws Exception {
        LoginDTO loginDTO = new LoginDTO(email, password);

        MvcResult result = mockMvc.perform(post("/auth/login")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        return objectMapper.readTree(response).get("accessToken").asText();
    }

}

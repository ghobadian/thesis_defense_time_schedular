package ir.kghobad.thesis_defense_time_schedular.controller;

import ir.kghobad.thesis_defense_time_schedular.model.dto.LoginDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.RefreshTokenRequestDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Admin;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static ir.kghobad.thesis_defense_time_schedular.helper.TestDataBuilder.DEFAULT_PASSWORD;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class AuthenticationControllerIntegrationTest extends BaseIntegrationTest {
    
    @Test
    public void testLogin_Success() throws Exception {
        Department dept = testDataBuilder.createDepartment("Computer Science");
        dept = departmentRepository.save(dept);
        Professor professor = professorRepository.save(
            testDataBuilder.createProfessor("prof@test.com", "John", "Doe", dept, "09121234567")
        );
        
        LoginDTO loginDTO = new LoginDTO("prof@test.com", DEFAULT_PASSWORD);
        
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.email").value("prof@test.com"))
                .andExpect(jsonPath("$.role").value("PROFESSOR"))
                .andExpect(jsonPath("$.userId").value(professor.getId()));
    }
    
    @Test
    public void testLogin_InvalidCredentials() throws Exception {
        LoginDTO loginDTO = new LoginDTO("nonexistent@test.com", "wrongpass");
        
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isForbidden());
    }
    
    @Test
    public void testRefreshToken_Success() throws Exception {
        Department dept = departmentRepository.save(testDataBuilder.createDepartment("Computer Science"));
        Admin admin = adminRepository.save(testDataBuilder.createAdmin("admin@test.com", "Admin", "User", "09123456788"));
        
        LoginDTO loginDTO = new LoginDTO("admin@test.com", DEFAULT_PASSWORD);
        
        String loginResponse = mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        
        String refreshToken = objectMapper.readTree(loginResponse).get("refreshToken").asText();
        
        RefreshTokenRequestDTO refreshRequest = new RefreshTokenRequestDTO(refreshToken);
        
        mockMvc.perform(post("/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists());
    }
    

}

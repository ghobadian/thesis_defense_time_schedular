package ir.kghobad.thesis_defense_time_schedular.helper.apiHelper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.TimeSlotSelectionInputDTO;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Component
public class StudentMockHelper {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;

    public StudentMockHelper(MockMvc mockMvc, ObjectMapper objectMapper) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
    }

    // ==================== Student Thesis Form Endpoints ====================

    public ResultActions createThesisForm(ThesisFormInputDTO formDTO, String token) throws Exception {
        return mockMvc.perform(post("/student/forms")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(formDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Thesis form created successfully"));
    }


    public List<ThesisFormOutputDTO> getMyThesisForms(String token) throws Exception {
        String response = mockMvc.perform(get("/student/forms")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)).andReturn().getResponse().getContentAsString();
        return objectMapper.readValue(response, new TypeReference<>() {});
    }


    public List<ThesisDefenseMeetingOutputDTO> getMyDefenseMeeting(String token) throws Exception {
        String response = mockMvc.perform(get("/student/meetings")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)).andReturn().getResponse().getContentAsString();
        return objectMapper.readValue(response, new TypeReference<>() {});
    }


    public ResultActions updateProfile(String firstName, String lastName, String phoneNumber, String token) throws Exception {
        String profileJson = String.format("""
            {
                "firstName": "%s",
                "lastName": "%s",
                "phoneNumber": "%s"
            }
            """, firstName, lastName, phoneNumber);

        return mockMvc.perform(put("/student/profile")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(profileJson));
    }

    public ResultActions changePassword(String currentPassword, String newPassword, String token) throws Exception {
        String passwordJson = String.format("""
            {
                "currentPassword": "%s",
                "newPassword": "%s"
            }
            """, currentPassword, newPassword);

        return mockMvc.perform(put("/student/change-password")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(passwordJson));
    }

    public ResultActions chooseTimeSlot(TimeSlotSelectionInputDTO input, String token) throws Exception {
        return mockMvc.perform(post("/student/meetings/time-slots")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)));
    }
}

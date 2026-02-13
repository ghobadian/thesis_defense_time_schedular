package ir.kghobad.thesis_defense_time_schedular.helper.apiHelper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.AvailableTimeInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.MeetingCompletionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.MeetingCreationInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.MeetingJuriesReassignmentInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import org.springframework.beans.factory.annotation.Autowired;
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
public class ProfessorMockHelper {

    private final MockMvc mockMvc;
    @Autowired
    protected ObjectMapper objectMapper;


    public ProfessorMockHelper(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

    public ResultActions getThesisForms(String token) throws Exception {
        return mockMvc.perform(get("/professor/forms")
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions acceptForm(Long formId, String token) throws Exception {
        return mockMvc.perform(post("/professor/forms/%d/approve".formatted(formId))
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().string("Form approved"));
    }

    public ResultActions acceptFormAsManagerAndCreateMeeting(MeetingCreationInputDTO input, String token) throws Exception {
        return mockMvc.perform(post("/professor/meetings/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input))
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().string("Meeting created"));
    }

    public ResultActions reassignJuries(MeetingJuriesReassignmentInputDTO input, String token) throws Exception {
        return mockMvc.perform(post("/professor/meetings/reassign-juries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input))
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().string("Juries reassigned"));
    }

    public ResultActions rejectForm(Long professorId, Long formId, String token) throws Exception {
        return mockMvc.perform(post("/professor/" + professorId + "/reject-form/" + formId)
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions suggestJuries(Long formId, Long[] juryIds, String token) throws Exception {
        StringBuilder juryIdsJson = new StringBuilder("[");
        if (juryIds != null && juryIds.length > 0) {
            for (int i = 0; i < juryIds.length; i++) {
                juryIdsJson.append(juryIds[i]);
                if (i < juryIds.length - 1) {
                    juryIdsJson.append(", ");
                }
            }
        }
        juryIdsJson.append("]");

        return mockMvc.perform(post("/professor/suggest-juries/" + formId)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(juryIdsJson.toString()));
    }

    // ==================== Professor Availability Management ====================

    public ResultActions getProfessorAvailability(Long professorId, String token) throws Exception {
        return mockMvc.perform(get("/professors/" + professorId + "/availability")
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions updateProfessorAvailability(Long professorId, String token) throws Exception {
        String availabilityJson = """
            {
                "availableSlots": [
                    {
                        "date": "2024-03-10",
                        "timePeriod": "PERIOD_7_30_9_00"
                    },
                    {
                        "date": "2024-03-10",
                        "timePeriod": "PERIOD_9_00_10_30"
                    }
                ]
            }
            """;

        return mockMvc.perform(put("/professors/" + professorId + "/availability")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(availabilityJson));
    }

    public ResultActions specifyAvailableTime(AvailableTimeInputDTO input, String token) throws Exception {
        return mockMvc.perform(post("/professor/meetings/give-time")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk());
    }


    public ResultActions getMySupervisedStudents(String token) throws Exception {
        return mockMvc.perform(get("/professor/my-students")
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions getMySupervisedTheses(String token) throws Exception {
        return mockMvc.perform(get("/professor/my-theses")
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions getMyDefenseMeetings(String token) throws Exception {
        return mockMvc.perform(get("/professor/my-defenses")
                .header("Authorization", "Bearer " + token));
    }

    // ==================== Professor Profile Management ====================

    public ResultActions updateProfile(String firstName, String lastName, String phoneNumber, String token) throws Exception {
        String profileJson = String.format("""
            {
                "firstName": "%s",
                "lastName": "%s",
                "phoneNumber": "%s"
            }
            """, firstName, lastName, phoneNumber);

        return mockMvc.perform(put("/professor/profile")
                .header("Authorization", "Bearer " + token)
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

        return mockMvc.perform(put("/professor/change-password")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(passwordJson));
    }

    public ResultActions giveScore(MeetingCompletionInputDTO inputDto, String jury1Token) throws Exception {
        return mockMvc.perform(post("/professor/meetings/score")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jury1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk());

    }

    public List<Professor> getAllCompetentJuriesForSelection(String token) throws Exception {
        String response = mockMvc.perform(get("/professor/list-competent-juries")
                .header("Authorization", "Bearer " + token)).andReturn().getResponse().getContentAsString();
        return objectMapper.readValue(response, new TypeReference<>() {});
    }
}

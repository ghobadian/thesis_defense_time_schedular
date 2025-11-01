package ir.kghobad.thesis_defense_time_schedular.helper;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@Component
public class ProfessorMockHelper {

    private final MockMvc mockMvc;

    public ProfessorMockHelper(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

    public ResultActions getThesisForms(String token) throws Exception {
        return mockMvc.perform(get("/professor/forms")
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions acceptForm(Long formId, String token) throws Exception {
        return mockMvc.perform(post("/professor/accept-form/" + formId)
                .header("Authorization", "Bearer " + token));
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

    public ResultActions specifyAvailableTime(Long professorId, String date, String timePeriod, String token) throws Exception {
        String timeSlotJson = String.format("""
            {
                "date": "%s",
                "timePeriod": "%s"
            }
            """, date, timePeriod);

        return mockMvc.perform(post("/professor/give-time")
                .param("professorId", professorId.toString())
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(timeSlotJson));
    }

    // ==================== Professor Supervision ====================

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
}

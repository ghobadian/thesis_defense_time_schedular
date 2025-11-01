package ir.kghobad.thesis_defense_time_schedular.helper;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@Component
public class StudentMockHelper {

    private final MockMvc mockMvc;

    public StudentMockHelper(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

    // ==================== Student Thesis Form Endpoints ====================

    public ResultActions createThesisForm(String token) throws Exception {
        String thesisFormJson = """
            {
                "title": "AI-Powered Healthcare Diagnosis System",
                "abstractText": "This thesis investigates the application of artificial intelligence in healthcare diagnosis...",
                "studentId": 9,
                "instructorId": 3,
                "fieldId": 1,
                "suggestedJuryIds": [4, 5]
            }
            """;

        return mockMvc.perform(post("/student/create-form")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(thesisFormJson));
    }

    public ResultActions createThesisFormWithCustomData(String title, String abstractText,
                                                       Long studentId, Long instructorId,
                                                       Long fieldId, Long[] suggestedJuryIds,
                                                       String token) throws Exception {
        StringBuilder juryIdsJson = new StringBuilder("[");
        if (suggestedJuryIds != null && suggestedJuryIds.length > 0) {
            for (int i = 0; i < suggestedJuryIds.length; i++) {
                juryIdsJson.append(suggestedJuryIds[i]);
                if (i < suggestedJuryIds.length - 1) {
                    juryIdsJson.append(", ");
                }
            }
        }
        juryIdsJson.append("]");

        String thesisFormJson = String.format("""
            {
                "title": "%s",
                "abstractText": "%s",
                "studentId": %d,
                "instructorId": %d,
                "fieldId": %d,
                "suggestedJuryIds": %s
            }
            """, title, abstractText, studentId, instructorId, fieldId, juryIdsJson);

        return mockMvc.perform(post("/student/create-form")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(thesisFormJson));
    }

    // ==================== Student View Endpoints ====================

    public ResultActions getMyThesisForms(String token) throws Exception {
        return mockMvc.perform(get("/student/my-forms")
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions getMyThesis(String token) throws Exception {
        return mockMvc.perform(get("/student/my-thesis")
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions getMyDefenseMeeting(String token) throws Exception {
        return mockMvc.perform(get("/student/my-defense")
                .header("Authorization", "Bearer " + token));
    }

    // ==================== Student Profile Endpoints ====================

    public ResultActions updateProfile(String firstName, String lastName, String phoneNumber, String token) throws Exception {
        String profileJson = String.format("""
            {
                "firstName": "%s",
                "lastName": "%s",
                "phoneNumber": "%s"
            }
            """, firstName, lastName, phoneNumber);

        return mockMvc.perform(put("/student/profile")
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

        return mockMvc.perform(put("/student/change-password")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(passwordJson));
    }
}

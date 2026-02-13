package ir.kghobad.thesis_defense_time_schedular.helper.apiHelper;

import com.fasterxml.jackson.databind.ObjectMapper;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.student.PasswordChangeInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.student.StudentRegistrationInputDTO;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;

import static ir.kghobad.thesis_defense_time_schedular.helper.TestDataBuilder.DEFAULT_PASSWORD;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Component
public class AdminMockHelper {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;

    public AdminMockHelper(MockMvc mockMvc, ObjectMapper objectMapper) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
    }

    public ResultActions getAllDepartments(String token) throws Exception {
        return mockMvc.perform(get("/departments")
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions getDepartmentById(Long id, String token) throws Exception {
        return mockMvc.perform(get("/departments/" + id)
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions createDepartment(String name, String token) throws Exception {
        String departmentJson = String.format("""
            {
                "name": "%s"
            }
            """, name);

        return mockMvc.perform(post("/departments")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(departmentJson));
    }

    public ResultActions updateDepartment(Long id, String name, String token) throws Exception {
        String departmentJson = String.format("""
            {
                "name": "%s"
            }
            """, name);

        return mockMvc.perform(put("/departments/" + id)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(departmentJson));
    }

    // ==================== Field Endpoints ====================

    public ResultActions getAllFields(String token) throws Exception {
        return mockMvc.perform(get("/fields")
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions getFieldById(Long id, String token) throws Exception {
        return mockMvc.perform(get("/fields/" + id)
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions createField(String name, String token) throws Exception {
        String fieldJson = String.format("""
            {
                "name": "%s"
            }
            """, name);

        return mockMvc.perform(post("/fields")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(fieldJson));
    }

    // ==================== User Management Endpoints ====================

    public ResultActions getAllUsers(String token) throws Exception {
        return mockMvc.perform(get("/users")
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions getUserById(Long id, String token) throws Exception {
        return mockMvc.perform(get("/users/" + id)
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions createProfessor(String token) throws Exception {
        String professorJson = """
            {
                "firstName": "Mohammad",
                "lastName": "Hosseini",
                "email": "mohammad.hosseini@kntu.ac.ir",
                "phoneNumber": "09381234567",
                "password": %s,
                "departmentId": 1,
                "isManager": false
            }
            """.formatted(DEFAULT_PASSWORD);

        return mockMvc.perform(post("/users/professors")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(professorJson));
    }

    public ResultActions createBachelorStudent(String token) throws Exception {
        String studentJson = """
            {
                "firstName": "Reza",
                "lastName": "Mohammadi",
                "email": "reza.mohammadi@student.kntu.ac.ir",
                "phoneNumber": "09391234567",
                "password": %s,
                "departmentId": 1,
                "studentNumber": "98001237",
                "instructorId": 3,
                "fieldId": 1
            }
            """.formatted(DEFAULT_PASSWORD);

        return mockMvc.perform(post("/users/students/bachelor")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(studentJson));
    }

    public ResultActions createMasterStudent(String token) throws Exception {
        String studentJson = """
            {
                "firstName": "Zahra",
                "lastName": "Ahmadi",
                "email": "zahra.ahmadi@student.kntu.ac.ir",
                "phoneNumber": "09401234567",
                "password": %s,
                "departmentId": 1,
                "studentNumber": "99002004",
                "instructorId": 4,
                "fieldId": 1
            }
            """.formatted(DEFAULT_PASSWORD);

        return mockMvc.perform(post("/users/students/master")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(studentJson));
    }

    public ResultActions createPhDStudent(String token) throws Exception {
        String studentJson = """
            {
                "firstName": "Fateme",
                "lastName": "Moradi",
                "email": "fateme.moradi@student.kntu.ac.ir",
                "phoneNumber": "09411234567",
                "password": %s,
                "departmentId": 2,
                "studentNumber": "97003004",
                "instructorId": 6,
                "fieldId": 5
            }
            """.formatted(DEFAULT_PASSWORD);

        return mockMvc.perform(post("/users/students/phd")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(studentJson));
    }

    public ResultActions registerStudents(List<StudentRegistrationInputDTO> dtos, String token) throws Exception {
        return mockMvc.perform(post("/admin/students")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtos)))
                .andExpect(status().isOk())
                .andExpect(content().string("Students registered successfully"));
    }

    public ResultActions createThesis(Long authorId, Long supervisorId, String token) throws Exception {
        String thesisJson = String.format("""
            {
                "title": "Blockchain-based Supply Chain Management System",
                "abstractText": "This thesis explores the implementation of blockchain technology in supply chain management...",
                "authorId": %d,
                "supervisorId": %d
            }
            """, authorId, supervisorId);

        return mockMvc.perform(post("/thesis")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(thesisJson));
    }

    public ResultActions getThesisById(Long id, String token) throws Exception {
        return mockMvc.perform(get("/thesis/" + id)
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions getThesisFormById(Long id, String token) throws Exception {
        return mockMvc.perform(get("/thesis-forms/" + id)
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions approveThesisFormByInstructor(Long id, String token) throws Exception {
        return mockMvc.perform(put("/thesis-forms/" + id + "/approve/instructor")
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions approveThesisFormByManager(Long id, String token) throws Exception {
        return mockMvc.perform(put("/thesis-forms/" + id + "/approve/manager")
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions updateThesisFormState(Long id, String state, String token) throws Exception {
        String stateJson = String.format("""
            {
                "state": "%s"
            }
            """, state);

        return mockMvc.perform(put("/thesis-forms/" + id + "/state")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(stateJson));
    }

    // ==================== Defense Meeting Management ====================

    public ResultActions createDefenseMeeting(String token) throws Exception {
        String meetingJson = """
            {
                "thesisFormId": 3,
                "selectedDate": "2024-03-15",
                "selectedTime": "PERIOD_9_00_10_30",
                "juryIds": [3, 4, 5, 6]
            }
            """;

        return mockMvc.perform(post("/defense-meetings")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(meetingJson));
    }

    public ResultActions getDefenseMeetingById(Long id, String token) throws Exception {
        return mockMvc.perform(get("/defense-meetings/" + id)
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions getAllDefenseMeetings(String token) throws Exception {
        return mockMvc.perform(get("/defense-meetings")
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions createTimeSlot(String token) throws Exception {
        String timeSlotJson = """
            {
                "date": "2024-03-10",
                "timePeriod": "PERIOD_13_30_15_00",
                "availableProfessorIds": [3, 4, 5]
            }
            """;

        return mockMvc.perform(post("/time-slots")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(timeSlotJson));
    }

    public ResultActions getTimeSlotById(Long id, String token) throws Exception {
        return mockMvc.perform(get("/time-slots/" + id)
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions getAvailableTimeSlots(String date, String token) throws Exception {
        return mockMvc.perform(get("/time-slots/available")
                .param("date", date)
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions updateTimeSlotAvailability(Long id, String token) throws Exception {
        String availabilityJson = """
            {
                "availableProfessorIds": [3, 4, 6, 7]
            }
            """;

        return mockMvc.perform(put("/time-slots/" + id + "/availability")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(availabilityJson));
    }

    // ==================== Report Endpoints ====================

    public ResultActions getDefenseScheduleReport(String startDate, String endDate, String token) throws Exception {
        return mockMvc.perform(get("/reports/defense-schedule")
                .param("startDate", startDate)
                .param("endDate", endDate)
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions getDepartmentStatisticsReport(Long departmentId, String token) throws Exception {
        return mockMvc.perform(get("/reports/department-statistics/" + departmentId)
                .header("Authorization", "Bearer " + token));
    }

    public ResultActions changePassword(PasswordChangeInputDTO input, String token) throws Exception {
        return mockMvc.perform(put("/admin/change-password")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)));
    }
}

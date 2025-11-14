package ir.kghobad.thesis_defense_time_schedular.integration;

import com.fasterxml.jackson.core.type.TypeReference;
import ir.kghobad.thesis_defense_time_schedular.controller.BaseIntegrationTest;
import ir.kghobad.thesis_defense_time_schedular.helper.TestDataBuilder;
import ir.kghobad.thesis_defense_time_schedular.model.dto.*;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import ir.kghobad.thesis_defense_time_schedular.model.entity.TimeSlot;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Admin;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.model.enums.MeetingState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.StudentType;
import ir.kghobad.thesis_defense_time_schedular.model.enums.TimePeriod;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Set;

import static ir.kghobad.thesis_defense_time_schedular.helper.TestDataBuilder.DEFAULT_PASSWORD;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class ThesisDefenseWorkflowIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private TestDataBuilder testDataBuilder;

    @Mock
    private Clock clock;

    private Department computerDepartment;

    private Field softwareEngineeringField;
    private Field aiField;

    private Professor hamedKhanmirza;
    private Professor fatemehRezaei;
    private Professor farnazSheikhi;
    private Professor atenaAbdi;
    private Professor mohammadhadiAlaeiyan;

    private Student kooshaGhobadian;
    private Student parsaYasbolaghi;

    private Admin johnHopkins;


    private String studentToken;
    private String instructorToken;
    private String adminToken;
    private String managerToken;
    private String jury1Token;
    private String jury2Token;

    @BeforeEach
    void setUp() throws Exception {
        studentRepository.deleteAll();
        professorRepository.deleteAll();
        adminRepository.deleteAll();

        computerDepartment = departmentRepository.save(testDataBuilder.createDepartment("Computer Science"));

        softwareEngineeringField = fieldRepository.save(testDataBuilder.createField("Software Engineering", computerDepartment));
        aiField = fieldRepository.save(testDataBuilder.createField("Artificial Intelligence", computerDepartment));

        hamedKhanmirza = professorRepository.save(testDataBuilder.createProfessor("h.khanmirza@kntu.ac.ir", "Hamed", "Khanmirza", computerDepartment, "09901230000"));
        fatemehRezaei = professorRepository.save(testDataBuilder.createProfessor("f.rezaei@kntu.ac.ir", "Fatemeh", "Rezayi", computerDepartment, "09901230001"));
        farnazSheikhi = professorRepository.save(testDataBuilder.createProfessor("f.sheikhi@kntu.ac.ir", "Farnaz", "Sheikhi", computerDepartment, "09901230002"));
        atenaAbdi = professorRepository.save(testDataBuilder.createManager("a.abdi@kntu.ac.ir", "Atena", "Abdi", computerDepartment, "09901230003"));
        mohammadhadiAlaeiyan = professorRepository.save(testDataBuilder.createProfessor("m.alaeiyan@kntu.ac.ir", "Mohammadhadi", "alaeiyan", computerDepartment, "09901230004"));


        kooshaGhobadian = testDataBuilder.createStudent("k.ghobadian@kntu.ac.ir", "Koosha", "Ghobadian", 40008063L, StudentType.BACHELOR, computerDepartment, softwareEngineeringField, hamedKhanmirza, "09901230005");
        parsaYasbolaghi = studentRepository.save(testDataBuilder.createStudent("p.yasbolaghi@kntu.ac.ir", "Parsa", "Yasbolaghi", 40010443L, StudentType.MASTER, computerDepartment, aiField, mohammadhadiAlaeiyan, "09901230006"));

        johnHopkins = adminRepository.save(testDataBuilder.createAdmin("j.hopkins@kntu.ac.ir", "John", "Hopkins", "09901230007"));


        instructorToken = getAuthToken(hamedKhanmirza.getEmail(), DEFAULT_PASSWORD);
        adminToken = getAuthToken(johnHopkins.getEmail(), DEFAULT_PASSWORD);
        managerToken = getAuthToken(atenaAbdi.getEmail(), DEFAULT_PASSWORD);


    }

    @Test
    @DisplayName("Complete thesis defense workflow: Registration → Form Creation → Review → Jury Suggestion → Time Scheduling")
    void testCompleteThesisDefenseWorkflow() throws Exception {
        adminRegistersStudent();
        studentLogsIn();
        studentCreatesThesisForm();
        instructorListsThesisForms();
        instructorAcceptsThesisForm();
        adminAcceptsThesisForm();
        managerAcceptsThesisForm();
        managerSuggestsJuries();
        instructorListsMeetings();
        instructorGivesTime();
        jury1ListsMeetings();
        jury1GivesTime();
        jury2ListsMeetings();
        jury2GivesTime();
        studentListsMeetings();
        studentGetsMeetingDetails();
        studentChoosesTimeSlotWithWrongTimePeriod();
        studentChoosesTimeSlotWithWrongMeetingId();
        studentChoosesTimeSlotWithWrongDate();
        studentChoosesTimeSlotCorrectly();
        managerSchedulesMeeting();
        instructorCompletesMeeting();



        assertEquals(3, timeSlotRepository.count());
        ThesisForm finalForm = thesisFormRepository.findAll().getFirst();
        assertTrue(finalForm.isApprovedByInstructor());
        assertTrue(finalForm.isApprovedByAdmin());
        assertTrue(finalForm.isApprovedByManager());
        assertEquals(hamedKhanmirza.getId(), finalForm.getInstructor().getId());
        assertEquals("k.ghobadian@kntu.ac.ir", finalForm.getStudent().getEmail());

    }

    private void instructorCompletesMeeting() throws Exception {
        LocalDate fixedDate = LocalDate.now().plusDays(14);
        Clock fixedClock = Clock.fixed(
                fixedDate.atStartOfDay(ZoneId.systemDefault()).toInstant(),
                ZoneId.systemDefault()
        );

        when(clock.instant()).thenReturn(fixedClock.instant());
        when(clock.getZone()).thenReturn(fixedClock.getZone());

        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        MeetingCompletionInputDTO inputDto = new MeetingCompletionInputDTO(meeting.getId(), 18.5);
        mockMvc.perform(post("/professor/complete-meeting")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + instructorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk());
        assertEquals(18.5, meeting.getScore());
        assertEquals(MeetingState.COMPLETED, meeting.getState());


    }

    private void managerSchedulesMeeting() throws Exception {
        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        mockMvc.perform(post("/professor/schedule-meeting/" + meeting.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + managerToken))
                .andExpect(status().isOk());
        assertEquals(MeetingState.SCHEDULED, meeting.getState());
    }

    private void studentChoosesTimeSlotCorrectly() throws Exception {
        LocalDate defenseDate = LocalDate.now().plusDays(14);
        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        TimeSlotSelectionInputDTO timeSlotSelectionInputDTO = new TimeSlotSelectionInputDTO(defenseDate, TimePeriod.PERIOD_7_30_9_00, meeting.getId());
        mockMvc.perform(post("/student/time-slots")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(timeSlotSelectionInputDTO)))
                .andExpect(status().isOk());
        TimeSlot selectedTimeSlot = meeting.getSelectedTimeSlot();
        assertEquals(selectedTimeSlot.getTimePeriod(), timeSlotSelectionInputDTO.getTimePeriod());
        assertEquals(selectedTimeSlot.getDefenseMeeting().getId(), timeSlotSelectionInputDTO.getMeetingId());
        assertEquals(selectedTimeSlot.getDate(), timeSlotSelectionInputDTO.getDate());
    }

    private void studentChoosesTimeSlotWithWrongDate() throws Exception {
        LocalDate defenseDate = LocalDate.now().plusDays(28);
        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        TimeSlotSelectionInputDTO timeSlotSelectionInputDTO = new TimeSlotSelectionInputDTO(defenseDate, TimePeriod.PERIOD_7_30_9_00, meeting.getId());
        mockMvc.perform(post("/student/time-slots")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(timeSlotSelectionInputDTO)))
                .andExpect(status().isBadRequest());
    }

    private void studentChoosesTimeSlotWithWrongMeetingId() throws Exception {
        LocalDate defenseDate = LocalDate.now().plusDays(14);
        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        TimeSlotSelectionInputDTO timeSlotSelectionInputDTO = new TimeSlotSelectionInputDTO(defenseDate, TimePeriod.PERIOD_7_30_9_00, meeting.getId() + 1);
        mockMvc.perform(post("/student/time-slots")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(timeSlotSelectionInputDTO)))
                .andExpect(status().isBadRequest());
    }

    private void studentChoosesTimeSlotWithWrongTimePeriod() throws Exception {
        LocalDate defenseDate = LocalDate.now().plusDays(14);
        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        TimeSlotSelectionInputDTO timeSlotSelectionInputDTO = new TimeSlotSelectionInputDTO(defenseDate, TimePeriod.PERIOD_10_30_12_00, meeting.getId());
        mockMvc.perform(post("/student/time-slots")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(timeSlotSelectionInputDTO)))
                .andExpect(status().isBadRequest());


    }

    private void studentGetsMeetingDetails() throws Exception {
        ThesisDefenseMeeting entity = thesisDefenseMeetingRepository.findAll().getFirst();
        String response = mockMvc.perform(get("/student/meetings/" + entity.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        ThesisDefenseMeetingDetailsOutputDTO meeting = objectMapper.readValue(response, new TypeReference<ThesisDefenseMeetingDetailsOutputDTO>() {
        });
        assertEquals(1, meeting.getAvailableTimeSlots().size());
        TimeSlotDTO actualTimeslot = meeting.getAvailableTimeSlots().getFirst();

        LocalDate defenseDate = LocalDate.now().plusDays(14);
        TimeSlotDTO expectedTimeslot = new TimeSlotDTO(defenseDate, TimePeriod.PERIOD_7_30_9_00);
        assertEquals(expectedTimeslot, actualTimeslot);



    }

    private void jury2ListsMeetings() throws Exception {
        jury2Token = getAuthToken(fatemehRezaei.getEmail(), DEFAULT_PASSWORD);

        String response = mockMvc.perform(get("/professor/meetings")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jury2Token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
    }

    private void jury1ListsMeetings() throws Exception {
        jury1Token = getAuthToken(farnazSheikhi.getEmail(), DEFAULT_PASSWORD);

        String response = mockMvc.perform(get("/professor/meetings")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jury1Token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        List<ThesisDefenseMeetingOutputDTO> meetings = objectMapper.readValue(response, new TypeReference<List<ThesisDefenseMeetingOutputDTO>>() {
        });
        assertEquals(1, meetings.size());
        ThesisDefenseMeetingOutputDTO meeting = meetings.getFirst();
        assertEquals("Koosha Ghobadian", meeting.getStudentName());
        assertEquals("Hamed Khanmirza", meeting.getInstructorName());
        assertEquals(MeetingState.JURY_SELECTION.name(), meeting.getState());
        assertEquals("Deep Learning Applications in Medical Image Analysis", meeting.getThesisTitle());
        assertNull(meeting.getSelectedTimeSlot());
    }

    private void instructorListsMeetings() throws Exception {
        String response = mockMvc.perform(get("/professor/meetings")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + instructorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].thesisTitle").value("Deep Learning Applications in Medical Image Analysis"))  // Changed from "title"
                .andExpect(jsonPath("$[0].studentName").value("Koosha Ghobadian"))
                .andExpect(jsonPath("$[0].instructorName").value("Hamed Khanmirza"))
                .andExpect(jsonPath("$[0].state").value("JURY_SELECTION"))
                .andExpect(jsonPath("$[0].score").value(0.0))
                .andExpect(jsonPath("$[0].selectedTimeSlot").isEmpty())
                .andExpect(jsonPath("$", hasSize(1)))
                .andReturn().getResponse().getContentAsString();

    }

    private void studentLogsIn() throws Exception {
        studentToken = getAuthToken(kooshaGhobadian.getEmail(), DEFAULT_PASSWORD);
    }

    private void studentListsMeetings() throws Exception {
        String response = mockMvc.perform(get("/student/meetings")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].thesisFormId").value(1))
                .andExpect(jsonPath("$[0].thesisTitle").value("Deep Learning Applications in Medical Image Analysis"))
                .andExpect(jsonPath("$[0].studentName").value("Koosha Ghobadian"))
                .andExpect(jsonPath("$[0].instructorName").value("Hamed Khanmirza"))
                .andExpect(jsonPath("$[0].state").value("TIME_SELECTION"))
                .andExpect(jsonPath("$[0].score").value(0.0))
                .andExpect(jsonPath("$[0].selectedTimeSlot").isEmpty())
                .andReturn().getResponse().getContentAsString();
    }

    private void jury2GivesTime() throws Exception {
        LocalDate defenseDate = LocalDate.now().plusDays(14);
        TimeSlotDTO t1 = new TimeSlotDTO(defenseDate, TimePeriod.PERIOD_7_30_9_00);
        TimeSlotDTO t2 = new TimeSlotDTO(defenseDate, TimePeriod.PERIOD_9_00_10_30);
        TimeSlotDTO t3 = new TimeSlotDTO(defenseDate.minusDays(1), TimePeriod.PERIOD_15_30_17_00);
        Long meetingId = thesisDefenseMeetingRepository.findAll().getFirst().getId();
        AvailableTimeInputDTO jury2Slot = new AvailableTimeInputDTO(Set.of(t1, t2, t3), meetingId);

        mockMvc.perform(post("/professor/give-time")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jury2Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(jury2Slot)))
                .andExpect(status().isOk());

        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        assertNull(meeting.getSelectedTimeSlot());
        assertEquals(MeetingState.TIME_SELECTION, meeting.getState());
        assertEquals(3, meeting.getAvailableSlots().size());
    }

    private void jury1GivesTime() throws Exception {
        LocalDate defenseDate = LocalDate.now().plusDays(14);
        Long meetingId = thesisDefenseMeetingRepository.findAll().getFirst().getId();
        TimeSlotDTO ts1 = new TimeSlotDTO(defenseDate, TimePeriod.PERIOD_7_30_9_00);
        AvailableTimeInputDTO jury1Slot = new AvailableTimeInputDTO(
                Set.of(ts1), meetingId
        );

        mockMvc.perform(post("/professor/give-time")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jury1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(jury1Slot)))
                .andExpect(status().isOk());

        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        assertEquals(1, meeting.getAvailableSlots().size());
        assertNull(meeting.getSelectedTimeSlot());
        assertEquals(MeetingState.JURY_SELECTION, meeting.getState());
        TimeSlot timeSlot = meeting.getAvailableSlots().stream().findFirst().orElseThrow();
        assertEquals(ts1.getTimePeriod(), timeSlot.getTimePeriod());
        assertEquals(ts1.getDate(), timeSlot.getDate());
        Set<Long> associatedProfessors = timeSlot.getProfessorsIds();
        assertEquals(2, associatedProfessors.size());
        assertTrue(associatedProfessors.contains(hamedKhanmirza.getId()));
        assertTrue(associatedProfessors.contains(farnazSheikhi.getId()));
    }

    private void managerSuggestsJuries() throws Exception {
        Long formId = thesisFormRepository.findAll().getFirst().getId();
        FormSuggestionInputDTO suggestionDTO = new FormSuggestionInputDTO(
                formId, List.of(farnazSheikhi.getId(), fatemehRezaei.getId())
        );

        mockMvc.perform(post("/professor/suggest-juries")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + managerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(suggestionDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Juries suggested"));

        Set<Long> suggestedJuriesIds = thesisFormRepository.findById(formId).orElseThrow().getDefenseMeeting().getSuggestedJuriesIds();
        assertEquals(3, suggestedJuriesIds.size());
        assertTrue(suggestedJuriesIds.contains(hamedKhanmirza.getId()));
    }

    private void managerAcceptsThesisForm() {
        Long formId = thesisFormRepository.findAll().getFirst().getId();
        try {
            mockMvc.perform(post("/professor/accept-form/" + formId)
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + managerToken))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Form accepted"));

            ThesisForm thesisForm = thesisFormRepository.findById(formId).orElseThrow();
            assertThat(thesisForm.isApprovedByManager()).isTrue();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void adminAcceptsThesisForm() throws Exception {
        Long formId = thesisFormRepository.findAll().getFirst().getId();
        mockMvc.perform(post("/admin/forms/{formId}/approve", formId)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(content().string("Form approved successfully"));
    }

    private void instructorAcceptsThesisForm() throws Exception {
        Long formId = thesisFormRepository.findAll().getFirst().getId();

        mockMvc.perform(post("/professor/accept-form/" + formId)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + instructorToken))
                .andExpect(status().isOk())
                .andExpect(content().string("Form accepted"));

        assertThat(thesisFormRepository.findById(formId).orElseThrow().isApprovedByInstructor()).isTrue();
    }

    private void instructorListsThesisForms() throws Exception {
        mockMvc.perform(get("/professor/forms")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + instructorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Deep Learning Applications in Medical Image Analysis"))
                .andExpect(jsonPath("$[0].studentId").exists())
                .andReturn();
    }

    private void studentCreatesThesisForm() throws Exception {
        assertThat(studentToken).isNotEmpty();

        ThesisFormInputDTO thesisFormDTO = new ThesisFormInputDTO(
                "Deep Learning Applications in Medical Image Analysis",
                "This thesis investigates the use of convolutional neural networks and transformer architectures " +
                        "for automated disease detection in medical imaging, specifically focusing on early cancer detection.",
                hamedKhanmirza.getId()
        );

        mockMvc.perform(post("/student/create-form")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(thesisFormDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Thesis form created successfully"));

        assertThat(thesisFormRepository.count()).isEqualTo(1);
        ThesisForm thesisForm = thesisFormRepository.findById(1L).orElseThrow();
        assertNotNull(thesisForm.getField());

    }

    private void adminRegistersStudent() throws Exception {

        StudentRegistrationInputDTO studentDTO = new StudentRegistrationInputDTO(
                kooshaGhobadian.getFirstName(),
                kooshaGhobadian.getLastName(),
                kooshaGhobadian.getEmail(),
                kooshaGhobadian.getPhoneNumber(),
                kooshaGhobadian.getStudentNumber(),
                kooshaGhobadian.getStudentType(),
                kooshaGhobadian.getDepartment().getId(),
                kooshaGhobadian.getField().getId(),
                kooshaGhobadian.getInstructor().getId(),
                DEFAULT_PASSWORD
        );

        mockMvc.perform(post("/admin/register-student")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(studentDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Student registered successfully"));

        assertThat(studentRepository.findByEmail(kooshaGhobadian.getEmail())).isPresent();
    }

    private void instructorGivesTime() throws Exception {
        LocalDate defenseDate = LocalDate.now().plusDays(14);

        Long meetingId = thesisDefenseMeetingRepository.findAll().getFirst().getId();
        TimeSlotDTO timeslotDto = new TimeSlotDTO(defenseDate, TimePeriod.PERIOD_7_30_9_00);
        AvailableTimeInputDTO instructorSlot = new AvailableTimeInputDTO(
                Set.of(timeslotDto), meetingId
        );
        mockMvc.perform(post("/professor/give-time")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + instructorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(instructorSlot)))
                .andExpect(status().isOk());
        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        assertEquals(3, meeting.getSuggestedJuriesIds().size());
        Set<TimeSlot> availableSlots = meeting.getAvailableSlots();
        assertEquals(1, availableSlots.size());
        TimeSlot dbTimeslot = availableSlots.stream().findFirst().orElseThrow();
        assertEquals(hamedKhanmirza.getId(), dbTimeslot.getProfessorsIds().stream().findFirst().orElseThrow());
        assertEquals(timeslotDto.getTimePeriod(), dbTimeslot.getTimePeriod());
        assertEquals(timeslotDto.getDate(), dbTimeslot.getDate());
    }

//    @Test
//    @DisplayName("Workflow with form rejection scenario")
//    void testThesisDefenseWorkflowWithRejection() throws Exception {
//        // Setup admin and register student
//        createAdmin("admin@kntu.ac.ir", "AdminPass123!");
//        String adminToken = getAuthToken("admin@kntu.ac.ir", "AdminPass123!");
//
//        StudentRegistrationInputDTO studentDTO = new StudentRegistrationInputDTO(
//                "Bob",
//                "Smith",
//                "bob.smith@kntu.ac.ir",
//                "+989121234568",
//                2002L,
//                StudentType.MASTER,
//                computerDepartment.getId(),
//                softwareEngineeringField.getId(),
//                instructor.getId(),
//                DEFAULT_PASSWORD
//        );
//
//        mockMvc.perform(post("/admin/register-student")
//                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(studentDTO)))
//                .andExpect(status().isOk());
//
//        String studentToken = getAuthToken("bob.smith@kntu.ac.ir", DEFAULT_PASSWORD);
//
//        ThesisFormInputDTO thesisFormDTO = new ThesisFormInputDTO(
//                "Incomplete Research Proposal",
//                "This abstract is too short and lacks depth.",
//                instructor.getId(),
//                Set.of(jury1.getId(), jury2.getId())
//        );
//
//        mockMvc.perform(post("/student/create-form")
//                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(thesisFormDTO)))
//                .andExpect(status().isOk());
//
//        String instructorToken = getAuthToken("instructor@kntu.ac.ir", "InstructorPass123!");
//        Long formId = thesisFormRepository.findAll().get(0).getId();
//
//        mockMvc.perform(post("/professor/reject-form/" + formId)
//                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + instructorToken))
//                .andExpect(status().isOk())
//                .andExpect(content().string("Form rejected"));
//
//        ThesisForm rejectedForm = thesisFormRepository.findById(formId).orElseThrow();
//        assertThat(rejectedForm.isRejected()).isTrue();
//        assertThat(rejectedForm.isAccepted()).isFalse();
//    }
//
//    @Test
//    @DisplayName("Workflow with multiple students submitting forms")
//    void testMultipleStudentsWorkflow() throws Exception {
//        // Setup admin
//        String adminToken = getAuthToken("admin@kntu.ac.ir", "AdminPass123!");
//
//        // Register multiple students
//        for (int i = 1; i <= 3; i++) {
//            StudentRegistrationInputDTO studentDTO = new StudentRegistrationInputDTO(
//                    "Student" + i,
//                    "Test",
//                    "student" + i + "@kntu.ac.ir",
//                    "+98912345678" + i,
//                    3000L + i,
//                    StudentType.PHD,
//                    computerDepartment.getId(),
//                    softwareEngineeringField.getId(),
//                    instructor.getId(),
//                    DEFAULT_PASSWORD
//            );
//
//            mockMvc.perform(post("/admin/register-student")
//                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
//                            .contentType(MediaType.APPLICATION_JSON)
//                            .content(objectMapper.writeValueAsString(studentDTO)))
//                    .andExpect(status().isOk());
//        }
//
//        // Each student creates a form
//        for (int i = 1; i <= 3; i++) {
//            String studentToken = getAuthToken("student" + i + "@kntu.ac.ir", DEFAULT_PASSWORD);
//
//            ThesisFormInputDTO formDTO = new ThesisFormInputDTO(
//                    "Thesis Title " + i,
//                    "Abstract for thesis number " + i,
//                    instructor.getId(),
//                    Set.of(jury1.getId(), jury2.getId())
//            );
//
//            mockMvc.perform(post("/student/create-form")
//                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken)
//                            .contentType(MediaType.APPLICATION_JSON)
//                            .content(objectMapper.writeValueAsString(formDTO)))
//                    .andExpect(status().isOk());
//        }
//
//        // Verify all forms were created
//        assertThat(thesisFormRepository.count()).isEqualTo(3);
//
//        // Professor can see all forms
//        String instructorToken = getAuthToken("instructor@kntu.ac.ir", "InstructorPass123!");
//        mockMvc.perform(get("/professor/forms")
//                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + instructorToken))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$", hasSize(3)));
//    }
//
//    @Test
//    @DisplayName("Workflow ensuring token expiration and refresh")
//    void testWorkflowWithTokenRefresh() throws Exception {
//        // Register student
//        createAdmin("admin@kntu.ac.ir", "AdminPass123!");
//        String adminToken = getAuthToken("admin@kntu.ac.ir", "AdminPass123!");
//
//        StudentRegistrationInputDTO studentDTO = new StudentRegistrationInputDTO(
//                "TokenTest",
//                "User",
//                "tokentest@kntu.ac.ir",
//                "+989121234560",
//                4001L,
//                StudentType.MASTER,
//                computerDepartment.getId(),
//                softwareEngineeringField.getId(),
//                instructor.getId(),
//                DEFAULT_PASSWORD
//        );
//
//        mockMvc.perform(post("/admin/register-student")
//                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(studentDTO)))
//                .andExpect(status().isOk());
//
//        // Login and get tokens
//        LoginDTO loginDTO = new LoginDTO("tokentest@kntu.ac.ir", DEFAULT_PASSWORD);
//        MvcResult loginResult = mockMvc.perform(post("/auth/login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(loginDTO)))
//                .andExpect(status().isOk())
//                .andReturn();
//
//        AuthResponseDTO authResponse = objectMapper.readValue(
//                loginResult.getResponse().getContentAsString(),
//                AuthResponseDTO.class
//        );
//
//        // Use access token
//        String accessToken = authResponse.getAccessToken();
//        ThesisFormInputDTO formDTO = new ThesisFormInputDTO(
//                "Test with Token",
//                "Testing token lifecycle",
//                instructor.getId(),
//                Set.of(jury1.getId(), jury2.getId())
//        );
//
//        mockMvc.perform(post("/student/create-form")
//                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(formDTO)))
//                .andExpect(status().isOk());
//
//        // Refresh token
//        RefreshTokenRequestDTO refreshRequest = new RefreshTokenRequestDTO(authResponse.getRefreshToken());
//        MvcResult refreshResult = mockMvc.perform(post("/auth/refresh")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(refreshRequest)))
//                .andExpect(status().isOk())
//                .andReturn();
//
//        AuthResponseDTO newAuthResponse = objectMapper.readValue(
//                refreshResult.getResponse().getContentAsString(),
//                AuthResponseDTO.class
//        );
//
//        // Verify new token is different
//        assertThat(newAuthResponse.getAccessToken()).isNotEqualTo(accessToken);
//
//        // Use new token successfully
//        mockMvc.perform(post("/student/create-form")
//                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + newAuthResponse.getAccessToken())
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(formDTO)))
//                .andExpect(status().isBadRequest()); // Should fail because form already exists
//    }
}

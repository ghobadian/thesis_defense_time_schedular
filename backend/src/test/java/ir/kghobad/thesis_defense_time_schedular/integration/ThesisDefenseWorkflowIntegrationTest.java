package ir.kghobad.thesis_defense_time_schedular.integration;

import com.fasterxml.jackson.core.type.TypeReference;
import ir.kghobad.thesis_defense_time_schedular.helper.*;
import ir.kghobad.thesis_defense_time_schedular.helper.apiHelper.AdminMockHelper;
import ir.kghobad.thesis_defense_time_schedular.helper.apiHelper.ProfessorMockHelper;
import ir.kghobad.thesis_defense_time_schedular.helper.apiHelper.StudentMockHelper;
import ir.kghobad.thesis_defense_time_schedular.model.dto.TimeSlotDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.*;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.student.StudentRegistrationInputDTO;
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
    @Autowired
    private ProfessorMockHelper professorMockHelper;
    @Autowired
    private StudentMockHelper studentMockHelper;
    @Autowired
    private AdminMockHelper adminMockHelper;

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

        mockTimeToAFixedDate();
    }

    private void mockTimeToAFixedDate() {
        LocalDate fixedDate = LocalDate.now().plusDays(14);
        Clock fixedClock = Clock.fixed(
                fixedDate.atStartOfDay(ZoneId.systemDefault()).toInstant(),
                ZoneId.systemDefault()
        );

        when(clock.instant()).thenReturn(fixedClock.instant());
        when(clock.getZone()).thenReturn(fixedClock.getZone());
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
        managerAcceptsFormAndSuggestsJuries();
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
        jury1GivesScore();
        jury2GivesScore();
        instructorGivesScore();
        studentChecksFinalScore();


        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        assertEquals(MeetingState.COMPLETED, meeting.getState());
        assertEquals(3, timeSlotRepository.count());
        ThesisForm finalForm = thesisFormRepository.findAll().getFirst();
        assertTrue(finalForm.isApprovedByInstructor());
        assertTrue(finalForm.isApprovedByAdmin());
        assertTrue(finalForm.isApprovedByManager());
        assertEquals(hamedKhanmirza.getId(), finalForm.getInstructor().getId());
        assertEquals("k.ghobadian@kntu.ac.ir", finalForm.getStudent().getEmail());

    }

    private void jury1GivesScore() throws Exception {
        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        MeetingCompletionInputDTO inputDto = new MeetingCompletionInputDTO(meeting.getId(), 18.0);

        professorMockHelper.giveScore(inputDto, jury1Token);

        assertNull(meeting.getScore());
    }

    private void jury2GivesScore() throws Exception {
        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        MeetingCompletionInputDTO inputDto = new MeetingCompletionInputDTO(meeting.getId(), 20.0);

        professorMockHelper.giveScore(inputDto, jury2Token);

        assertNull(meeting.getScore());
    }

    private void instructorGivesScore() throws Exception {
        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        MeetingCompletionInputDTO inputDto = new MeetingCompletionInputDTO(meeting.getId(), 20.0);

        professorMockHelper.giveScore(inputDto, instructorToken);

        assertEquals(19.33, meeting.getScore(), 0.01);
    }

    private void studentChecksFinalScore() throws Exception {
        List<ThesisDefenseMeetingOutputDTO> meetings = studentMockHelper.getMyDefenseMeeting(studentToken);
        ThesisDefenseMeetingOutputDTO meeting = meetings.getFirst();
        assertEquals(19.33, meeting.getScore(), 0.01);
    }

    private void managerSchedulesMeeting() throws Exception {
        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();

        MeetingScheduleInputDTO input = new MeetingScheduleInputDTO();
        input.setMeetingId(meeting.getId());
        input.setLocation("In your mom's house");

        mockMvc.perform(post("/professor/meetings/schedule")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + managerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk());

        assertEquals(MeetingState.SCHEDULED, meeting.getState());
        assertEquals("In your mom's house", meeting.getLocation());
    }

    private void studentChoosesTimeSlotCorrectly() throws Exception {
        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        TimeSlotSelectionInputDTO timeSlotSelectionInputDTO = new TimeSlotSelectionInputDTO(1L, meeting.getId());

        studentMockHelper.chooseTimeSlot(timeSlotSelectionInputDTO, studentToken)
                .andExpect(status().isOk());

        TimeSlot selectedTimeSlot = meeting.getSelectedTimeSlot();
        assertEquals(selectedTimeSlot.getId(), timeSlotSelectionInputDTO.getTimeSlotId());
        assertEquals(selectedTimeSlot.getDefenseMeeting().getId(), timeSlotSelectionInputDTO.getMeetingId());
    }

    private void studentChoosesTimeSlotWithWrongDate() throws Exception {
        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        TimeSlotSelectionInputDTO timeSlotSelectionInputDTO = new TimeSlotSelectionInputDTO(99L, meeting.getId());
        studentMockHelper.chooseTimeSlot(timeSlotSelectionInputDTO, studentToken)
                .andExpect(status().isBadRequest());
    }

    private void studentChoosesTimeSlotWithWrongMeetingId() throws Exception {
        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        TimeSlotSelectionInputDTO timeSlotSelectionInputDTO = new TimeSlotSelectionInputDTO(3L, meeting.getId() + 1);
        studentMockHelper.chooseTimeSlot(timeSlotSelectionInputDTO, studentToken)
                .andExpect(status().isBadRequest());
    }

    private void studentChoosesTimeSlotWithWrongTimePeriod() throws Exception {
        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        TimeSlotSelectionInputDTO timeSlotSelectionInputDTO = new TimeSlotSelectionInputDTO(4L, meeting.getId());
        studentMockHelper.chooseTimeSlot(timeSlotSelectionInputDTO, studentToken)
                .andExpect(status().isBadRequest());
    }

    private void studentGetsMeetingDetails() throws Exception {
        ThesisDefenseMeeting entity = thesisDefenseMeetingRepository.findAll().getFirst();
        String response = mockMvc.perform(get("/student/meetings/" + entity.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        ThesisDefenseMeetingDetailsOutputDTO meeting = objectMapper.readValue(response, new TypeReference<>() {});
        assertEquals(1, meeting.getAvailableTimeSlots().size());
        TimeSlotDTO actualTimeslot = meeting.getAvailableTimeSlots().getFirst();

        LocalDate defenseDate = LocalDate.now().plusDays(14);
        TimeSlotDTO expectedTimeslot = new TimeSlotDTO(actualTimeslot.getId()
                , defenseDate, TimePeriod.PERIOD_7_30_9_00);
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
        assertEquals("Koosha Ghobadian", meeting.getThesis().getStudentFirstName() + " " + meeting.getThesis().getStudentLastName());
        assertEquals(MeetingState.JURIES_SELECTED.name(), meeting.getState());
        assertEquals("Deep Learning Applications in Medical Image Analysis", meeting.getThesis().getTitle());
        assertNull(meeting.getSelectedTimeSlot());
    }

    private void instructorListsMeetings() throws Exception {
        String contentAsString = mockMvc.perform(get("/professor/meetings")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + instructorToken))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        List<ThesisDefenseMeetingOutputDTO> meetings = objectMapper.readValue(contentAsString, new TypeReference<List<ThesisDefenseMeetingOutputDTO>>() {
        });
        ThesisDefenseMeetingOutputDTO meeting = meetings.getFirst();
        assertEquals(MeetingState.JURIES_SELECTED.toString(), meeting.getState());
        assertEquals("Deep Learning Applications in Medical Image Analysis", meeting.getThesis().getTitle());
        assertEquals("Koosha", meeting.getThesis().getStudentFirstName());
        assertEquals("Ghobadian", meeting.getThesis().getStudentLastName());
        assertEquals("Hamed", meeting.getThesis().getInstructorFirstName());
        assertEquals("Khanmirza", meeting.getThesis().getInstructorLastName());
        assertNull(meeting.getScore());
        assertNull(meeting.getSelectedTimeSlot());
    }

    private void studentLogsIn() throws Exception {
        studentToken = getAuthToken(kooshaGhobadian.getEmail(), DEFAULT_PASSWORD);
    }

    private void studentListsMeetings() throws Exception {
        String response = mockMvc.perform(get("/student/meetings")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();


//                .andExpect(jsonPath("$").isArray())
//                .andExpect(jsonPath("$", hasSize(1)))
//                .andExpect(jsonPath("$[0].id").value(1))
//                .andExpect(jsonPath("$[0].thesisFormId").value(1))
//                .andExpect(jsonPath("$[0].thesisTitle").value("Deep Learning Applications in Medical Image Analysis"))
//                .andExpect(jsonPath("$[0].studentName").value("Koosha Ghobadian"))
//                .andExpect(jsonPath("$[0].instructorName").value("Hamed Khanmirza"))
//                .andExpect(jsonPath("$[0].state").value("JURIES_SPECIFIED_TIME"))
//                .andExpect(jsonPath("$[0].score").value(0.0))
//                .andExpect(jsonPath("$[0].selectedTimeSlot").isEmpty())
//                .andReturn().getResponse().getContentAsString();
    }

    private void jury2GivesTime() throws Exception {
        LocalDate defenseDate = LocalDate.now().plusDays(14);
        TimeSlotDTO t1 = new TimeSlotDTO(5L, defenseDate, TimePeriod.PERIOD_7_30_9_00);
        TimeSlotDTO t2 = new TimeSlotDTO(5L, defenseDate, TimePeriod.PERIOD_9_00_10_30);
        TimeSlotDTO t3 = new TimeSlotDTO(5L, defenseDate.minusDays(1), TimePeriod.PERIOD_15_30_17_00);
        Long meetingId = thesisDefenseMeetingRepository.findAll().getFirst().getId();
        AvailableTimeInputDTO jury2Slot = new AvailableTimeInputDTO(Set.of(t1, t2, t3), meetingId);

        professorMockHelper.specifyAvailableTime(jury2Slot, jury2Token);

        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        assertNull(meeting.getSelectedTimeSlot());
        assertEquals(MeetingState.JURIES_SPECIFIED_TIME, meeting.getState());
        assertEquals(3, meeting.getAvailableSlots().size());
    }

    private void jury1GivesTime() throws Exception {
        LocalDate defenseDate = LocalDate.now().plusDays(14);
        Long meetingId = thesisDefenseMeetingRepository.findAll().getFirst().getId();
        TimeSlotDTO ts1 = new TimeSlotDTO(5L, defenseDate, TimePeriod.PERIOD_7_30_9_00);
        AvailableTimeInputDTO jury1Slot = new AvailableTimeInputDTO(
                Set.of(ts1), meetingId
        );


        professorMockHelper.specifyAvailableTime(jury1Slot, jury1Token);

        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        assertEquals(1, meeting.getAvailableSlots().size());
        assertNull(meeting.getSelectedTimeSlot());
        assertEquals(MeetingState.JURIES_SELECTED, meeting.getState());
        TimeSlot timeSlot = meeting.getAvailableSlots().stream().findFirst().orElseThrow();
        assertEquals(ts1.getTimePeriod(), timeSlot.getTimePeriod());
        assertEquals(ts1.getDate(), timeSlot.getDate());
        Set<Long> associatedProfessors = timeSlot.getProfessorsIds();
        assertEquals(2, associatedProfessors.size());
        assertTrue(associatedProfessors.contains(hamedKhanmirza.getId()));
        assertTrue(associatedProfessors.contains(farnazSheikhi.getId()));
    }

    private void managerAcceptsFormAndSuggestsJuries() throws Exception {
        Long formId = thesisFormRepository.findAll().getFirst().getId();
        MeetingCreationInputDTO input = new MeetingCreationInputDTO();
        input.setFormId(formId);
        input.setJuryIds(Set.of(farnazSheikhi.getId(), fatemehRezaei.getId()));

        professorMockHelper.acceptFormAsManagerAndCreateMeeting(input, managerToken);

        Set<Long> suggestedJuriesIds = thesisFormRepository.findById(formId).orElseThrow().getDefenseMeeting().getSuggestedJuriesIds();
        assertEquals(3, suggestedJuriesIds.size());
        assertTrue(suggestedJuriesIds.contains(hamedKhanmirza.getId()));

        List<ThesisDefenseMeeting> meetings = thesisDefenseMeetingRepository.findAll();
        assertEquals(1, meetings.size());
        ThesisDefenseMeeting meeting = meetings.getFirst();
        assertNull(meeting.getScore());
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

        professorMockHelper.acceptForm(formId, instructorToken);

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

        studentMockHelper.createThesisForm(thesisFormDTO, studentToken);

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

        adminMockHelper.registerStudents(List.of(studentDTO), adminToken);

        assertThat(studentRepository.findByEmail(kooshaGhobadian.getEmail())).isPresent();
    }

    private void instructorGivesTime() throws Exception {
        LocalDate defenseDate = LocalDate.now().plusDays(14);

        Long meetingId = thesisDefenseMeetingRepository.findAll().getFirst().getId();
        TimeSlotDTO timeslotDto = new TimeSlotDTO(5L, defenseDate, TimePeriod.PERIOD_7_30_9_00);
        AvailableTimeInputDTO instructorSlot = new AvailableTimeInputDTO(
                Set.of(timeslotDto), meetingId
        );
        professorMockHelper.specifyAvailableTime(instructorSlot, instructorToken);

        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        assertEquals(3, meeting.getSuggestedJuriesIds().size());
        Set<TimeSlot> availableSlots = meeting.getAvailableSlots();
        assertEquals(1, availableSlots.size());
        TimeSlot dbTimeslot = availableSlots.stream().findFirst().orElseThrow();
        assertEquals(hamedKhanmirza.getId(), dbTimeslot.getProfessorsIds().stream().findFirst().orElseThrow());
        assertEquals(timeslotDto.getTimePeriod(), dbTimeslot.getTimePeriod());
        assertEquals(timeslotDto.getDate(), dbTimeslot.getDate());
    }
}

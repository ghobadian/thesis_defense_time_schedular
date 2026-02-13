package ir.kghobad.thesis_defense_time_schedular.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import ir.kghobad.thesis_defense_time_schedular.helper.BaseIntegrationTest;
import ir.kghobad.thesis_defense_time_schedular.helper.apiHelper.ProfessorMockHelper;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.MeetingJuriesReassignmentInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.TimeSlotDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.AvailableTimeInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.MeetingCreationInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.MeetingState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.StudentType;
import ir.kghobad.thesis_defense_time_schedular.model.enums.TimePeriod;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static ir.kghobad.thesis_defense_time_schedular.helper.TestDataBuilder.DEFAULT_PASSWORD;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class ProfessorControllerIntegrationTest extends BaseIntegrationTest {
    @Autowired
    private ProfessorMockHelper professorMockHelper;

    
    @Test
    public void testGetThesisForms_Success() throws Exception {
        Department dept = departmentRepository.save(testDataBuilder.createDepartment("Computer Science"));
        Field field = fieldRepository.save(testDataBuilder.createField("Software Engineering", dept));
        Professor instructor = professorRepository.save(testDataBuilder.createProfessor("instructor@test.com",
                "hamid", "sadeghi", dept, "09123854232"));
        Student student1 = studentRepository.save(testDataBuilder.createStudent("student1@test.com", "Student", "One", 12345L,
                StudentType.MASTER, dept, field, instructor, "09121234567"));
        Student student2 = studentRepository.save(
            testDataBuilder.createStudent("student2@test.com", "Student", "Two", 
                12346L, StudentType.PHD, dept, field, instructor, "09121234569")
        );
        
        ThesisForm form1 = new ThesisForm();
        form1.setTitle("Thesis 1");
        form1.setAbstractText("Abstract 1");
        form1.setStudent(student1);
        form1.setInstructor(instructor);
        form1.setState(FormState.SUBMITTED);
        thesisFormRepository.save(form1);
        
        ThesisForm form2 = new ThesisForm();
        form2.setTitle("Thesis 2");
        form2.setAbstractText("Abstract 2");
        form2.setStudent(student2);
        form2.setInstructor(instructor);
        form2.setState(FormState.SUBMITTED);
        thesisFormRepository.save(form2);
        
        String token = getAuthToken("instructor@test.com", DEFAULT_PASSWORD);
        
        mockMvc.perform(get("/professor/forms")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title").value("Thesis 1"))
                .andExpect(jsonPath("$[1].title").value("Thesis 2"));
    }



    @Test
    public void testAcceptForm_Success() throws Exception {
        Department dept = departmentRepository.save(testDataBuilder.createDepartment("Computer Science"));
        Field field = fieldRepository.save(testDataBuilder.createField("Software Engineering", dept));
        
        Professor instructor = professorRepository.save(
            testDataBuilder.createProfessor("instructor@test.com","david", "jones", dept, "09123854231")
        );
        
        Student student = studentRepository.save(
            testDataBuilder.createStudent("student@test.com", "Student", "User", 
                12345L, StudentType.MASTER, dept, field, instructor, "09121234564")
        );
        
        ThesisForm form = new ThesisForm();
        form.setTitle("Test Thesis");
        form.setAbstractText("Test Abstract");
        form.setStudent(student);
        form.setInstructor(instructor);
        form.setState(FormState.SUBMITTED);
        form = thesisFormRepository.save(form);
        
        String token = getAuthToken("instructor@test.com", DEFAULT_PASSWORD);

        professorMockHelper.acceptForm(form.getId(), token);

        
        ThesisForm updatedForm = thesisFormRepository.findById(form.getId()).orElseThrow();
        assert(updatedForm.getState() == FormState.INSTRUCTOR_APPROVED);
    }
    
    @Test
    public void testSuggestJuries_Success() throws Exception {
        Department dept = departmentRepository.save(testDataBuilder.createDepartment("Computer Science"));
        Field field = fieldRepository.save(testDataBuilder.createField("Software Engineering", dept));
        
        Professor manager = professorRepository.save(
            testDataBuilder.createManager("manager@test.com", "inst", "instl", dept, "09123854234")
        );
        Professor jury1 = professorRepository.save(
            testDataBuilder.createProfessor("jury1@test.com", "inst", "inst", dept, "09123854235")
        );
        Professor jury2 = professorRepository.save(
            testDataBuilder.createProfessor("jury2@test.com", "inst", "inst", dept, "09123854236")
        );
        
        Student student = studentRepository.save(
            testDataBuilder.createStudent("student@test.com", "Student", "User", 
                12345L, StudentType.MASTER, dept, field, manager, "09121234562")
        );
        
        ThesisForm form = new ThesisForm();
        form.setTitle("Test Thesis");
        form.setAbstractText("Test Abstract");
        form.setStudent(student);
        form.setInstructor(manager);
        form.setState(FormState.ADMIN_APPROVED);
        form = thesisFormRepository.save(form);
        
        String token = getAuthToken("manager@test.com", DEFAULT_PASSWORD);

        MeetingCreationInputDTO input = new MeetingCreationInputDTO();
        input.setFormId(form.getId());
        input.setJuryIds(Set.of(jury1.getId(), jury2.getId()));
        professorMockHelper.acceptFormAsManagerAndCreateMeeting(input, token);

        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        assertNotNull(meeting);
        assertEquals(form.getTitle(), meeting.getThesisForm().getTitle());
        List<SimpleUserOutputDto> suggestedJuries = meeting.getSuggestedJuries();
        assertEquals(3, suggestedJuries.size());
        assertTrue(suggestedJuries.stream().anyMatch(s -> s.getId().equals(manager.getId())));
        assertTrue(suggestedJuries.stream().anyMatch(s -> s.getId().equals(jury1.getId())));
        assertTrue(suggestedJuries.stream().anyMatch(s -> s.getId().equals(jury2.getId())));
        assertEquals(MeetingState.JURIES_SELECTED, meeting.getState());


        MeetingJuriesReassignmentInputDTO juriesReassignmentInputDTO = new MeetingJuriesReassignmentInputDTO();
        juriesReassignmentInputDTO.setMeetingId(meeting.getId());
        juriesReassignmentInputDTO.setJuryIds(Set.of(jury1.getId()));
        professorMockHelper.reassignJuries(juriesReassignmentInputDTO, token);

        meeting = thesisDefenseMeetingRepository.findAll().getFirst();
        suggestedJuries = meeting.getSuggestedJuries();
        assertEquals(1, suggestedJuries.size());
        assertFalse(suggestedJuries.stream().anyMatch(s -> s.getId().equals(manager.getId())));
        assertTrue(suggestedJuries.stream().anyMatch(s -> s.getId().equals(jury1.getId())));
        assertFalse(suggestedJuries.stream().anyMatch(s -> s.getId().equals(jury2.getId())));

    }

    @Test
    public void testGiveTime_Success() throws Exception {
        Department dept = departmentRepository.save(testDataBuilder.createDepartment("Computer Science"));
        Professor professor = professorRepository.save(
            testDataBuilder.createProfessor("prof@test.com", "mari", "rose", dept, "09123854233")
        );

        Field field = fieldRepository.save(testDataBuilder.createField("Software Engineering", dept));

        Student student = studentRepository.save(
                testDataBuilder.createStudent("student@test.com", "Student", "User",
                        12345L, StudentType.MASTER, dept, field, professor, "09121234562")
        );
        ThesisForm form = thesisFormRepository.save(testDataBuilder.createThesisForm(
                "Test Thesis", "Test Abstract", student, professor, FormState.INSTRUCTOR_APPROVED, LocalDateTime.now(), null
        ));

        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.save(testDataBuilder.createThesisDefenseMeeting(new ArrayList<>(), List.of(professor), form));

        String token = getAuthToken("prof@test.com", DEFAULT_PASSWORD);
        
        AvailableTimeInputDTO availableTimeInputDTo = new AvailableTimeInputDTO();
        availableTimeInputDTo.setTimeSlots(Set.of(new TimeSlotDTO(1L, LocalDate.now().plusDays(7), TimePeriod.PERIOD_7_30_9_00)));
        availableTimeInputDTo.setMeetingId(professor.getId());
        availableTimeInputDTo.setMeetingId(meeting.getId());
        
        mockMvc.perform(post("/professor/meetings/give-time")
                .param("professorId", professor.getId().toString())
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(availableTimeInputDTo)))
                .andExpect(status().isOk())
                .andExpect(content().string("Time slot added"));
    }

    @Test
    public void testGetAllCompetentJuriesForSelection() throws Exception {
        Department deptCE = departmentRepository.save(testDataBuilder.createDepartment("Computer Science"));
        Department deptIE = departmentRepository.save(testDataBuilder.createDepartment("Industrial Engineering"));
        Department deptEE = departmentRepository.save(testDataBuilder.createDepartment("Electrical Engineering"));
        Professor professorCE1 = testDataBuilder.createProfessor("prof1@test.com", "CE", "rose", deptCE, "09123854233");
        Professor professorCE2 = testDataBuilder.createProfessor("prof2@test.com", "CE", "rose", deptCE, "09123854234");
        Professor professorCE3 = testDataBuilder.createProfessor("prof3@test.com", "CE", "rose", deptCE, "09123854235");
        Professor professorIE1 = testDataBuilder.createProfessor("prof4@test.com", "IE", "rose", deptIE, "09123854236");
        Professor professorIE2 = testDataBuilder.createProfessor("prof5@test.com", "IE", "rose", deptIE, "09123854237");
        Professor professorIE3 = testDataBuilder.createProfessor("prof6@test.com", "IE", "rose", deptIE, "09123854238");
        Professor professorEE1 = testDataBuilder.createProfessor("prof7@test.com", "EE", "rose", deptEE, "09123854239");
        Professor professorEE2 = testDataBuilder.createProfessor("prof8@test.com", "EE", "rose", deptEE, "09123854240");
        Professor professorEE3 = testDataBuilder.createProfessor("prof9@test.com", "EE", "rose", deptEE, "09123854241");
        Professor managerCE = testDataBuilder.createManager("manager@test.com", "CE", "rose", deptEE, "09123854242");
        List<Professor> professors = List.of(professorCE1, professorCE2, professorCE3,
                professorIE1,professorIE2,professorIE3,
                professorEE1,professorEE2,professorEE3);
        deptCE.addUser(professorCE1);
        deptCE.addUser(professorCE2);
        deptCE.addUser(professorCE3);
        deptIE.addUser(professorIE1);
        deptIE.addUser(professorIE2);
        deptIE.addUser(professorIE3);
        deptEE.addUser(professorEE1);
        deptEE.addUser(professorEE2);
        deptEE.addUser(professorEE3);
        deptCE.addUser(managerCE);
        departmentRepository.saveAll(List.of(deptCE, deptIE, deptEE));
        professorRepository.saveAll(professors);
        managerCE = professorRepository.save(managerCE);

        String token = getAuthToken(managerCE.getEmail(), DEFAULT_PASSWORD);

        List<Professor> allCompetentJuriesForSelection = professorMockHelper.getAllCompetentJuriesForSelection(token);

        allCompetentJuriesForSelection.forEach(p -> assertEquals("CE", p.getFirstName()));
    }
}

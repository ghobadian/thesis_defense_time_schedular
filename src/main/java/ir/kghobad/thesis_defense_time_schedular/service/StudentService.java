package ir.kghobad.thesis_defense_time_schedular.service;

import ir.kghobad.thesis_defense_time_schedular.dao.*;
import ir.kghobad.thesis_defense_time_schedular.exception.ThesisFormLimitExceededException;
import ir.kghobad.thesis_defense_time_schedular.model.dto.*;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingDetailsOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.TimeSlotSelectionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import ir.kghobad.thesis_defense_time_schedular.model.entity.TimeSlot;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.MeetingState;
import ir.kghobad.thesis_defense_time_schedular.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class StudentService {
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final ThesisFormRepository thesisFormRepository;
    private final ThesisDefenseMeetingRepository thesisDefenseMeetingRepository;
    private final JwtUtil jwtUtil;
    private final TimeSlotRepository timeSlotRepository;

    @Value("${rate-limit.max-submitted-forms}")
    private int maxSubmittedForms;

    public void createThesisForm(ThesisFormInputDTO dto) {
        Long studentId = jwtUtil.getCurrentUserId();
        double submittedFormsCount = thesisFormRepository.countByStudentIdAndState(studentId, FormState.SUBMITTED);
        if (submittedFormsCount >= maxSubmittedForms) {
            throw new ThesisFormLimitExceededException(
                    String.format("Maximum limit of %d submitted forms reached. " +
                                    "Please wait for your existing forms to be processed.",
                            maxSubmittedForms)
            );
        }
        Student student = studentRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));

        Professor thesisInstructor = professorRepository.findById(dto.getInstructorId()).orElseThrow(() -> new RuntimeException("Instructor not found"));

        ThesisForm form = new ThesisForm();
        form.setTitle(dto.getTitle());
        form.setAbstractText(dto.getAbstractText());
        form.setStudent(student);
        form.setInstructor(thesisInstructor);
        form.setState(FormState.SUBMITTED);
        form.setSubmissionDate(new Date());
        form.setUpdateDate(new Date());
        form.setStudentType(student.getStudentType());
        form.setField(student.getField());

        thesisFormRepository.save(form);
    }

    public List<ThesisDefenseMeetingOutputDTO> listMeetings() {
        return thesisDefenseMeetingRepository.findByStudentId(jwtUtil.getCurrentUserId()).stream()
                .map(ThesisDefenseMeetingOutputDTO::from).toList();
    }

    public ThesisDefenseMeetingDetailsOutputDTO getMeetingDetails(Long id) {
        ThesisDefenseMeeting meeting = getById(id).orElseThrow();
        ThesisDefenseMeetingDetailsOutputDTO outputDto = ThesisDefenseMeetingDetailsOutputDTO.from(meeting);
        outputDto.setAvailableTimeSlots(getSharedAvailableTimeSlots(meeting));
        return outputDto;
    }

    public List<TimeSlotDTO> getSharedAvailableTimeSlots(ThesisDefenseMeeting meeting) {
        Set<Long> suggestedJuriesIds = meeting.getSuggestedJuriesIds();
        return meeting.getAvailableSlots().stream()
                .filter(timeSlot -> timeSlot.getProfessorsIds().containsAll(suggestedJuriesIds))
                .sorted()
                .map(TimeSlotDTO::from)
                .collect(Collectors.toList());
    }

    private Optional<ThesisDefenseMeeting> getById(Long id) {
        return thesisDefenseMeetingRepository.findById(id);
    }

    public void chooseTimeSlot(TimeSlotSelectionInputDTO input) {
        ThesisDefenseMeeting meeting = thesisDefenseMeetingRepository.findById(input.getMeetingId()).orElseThrow();
        TimeSlot timeslot = timeSlotRepository.findById(input.getTimeSlotId())
                .orElseThrow(() -> {
                    log.error("The specified Timeslot is not available. Request: {}", input);
                    return new IllegalArgumentException("The specified Timeslot is not available");
                });

        if (!meeting.getThesisForm().getStudent().getId().equals(jwtUtil.getCurrentUserId())) {
            throw new AuthorizationDeniedException("You are not authorized to choose a time slot for this meeting");
        }

        if (meeting.getState() != MeetingState.JURIES_SPECIFIED_TIME) {
            throw new IllegalStateException("Time slot selection is not allowed in the current meeting state");
        }

        meeting.setSelectedTimeSlot(timeslot);
        meeting.setState(MeetingState.STUDENT_SPECIFIED_TIME);
        thesisDefenseMeetingRepository.save(meeting);
    }

    public List<ThesisFormOutputDTO> getThesisForms() {
        return thesisFormRepository.findByStudentId(jwtUtil.getCurrentUserId()).stream()
                .map(ThesisFormOutputDTO::from).toList();
    }

    public List<SimpleUserOutputDto> listProfessors() {
        Long currentUserId = jwtUtil.getCurrentUserId();
        Student student = studentRepository.findById(currentUserId).orElseThrow();
        return professorRepository.findAllByDepartmentId(student.getDepartment().getId())
                .stream().map(SimpleUserOutputDto::from).toList();
    }
}

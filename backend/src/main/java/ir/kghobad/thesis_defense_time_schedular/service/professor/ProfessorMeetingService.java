package ir.kghobad.thesis_defense_time_schedular.service.professor;

import ir.kghobad.thesis_defense_time_schedular.dao.ProfessorRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.ThesisDefenseMeetingRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.ThesisFormRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.TimeSlotRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.JuryMemberAvailability;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.TimeSlotDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.*;
import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import ir.kghobad.thesis_defense_time_schedular.model.entity.TimeSlot;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.MeetingState;
import ir.kghobad.thesis_defense_time_schedular.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Log4j2
public class ProfessorMeetingService {
    private final ThesisDefenseMeetingRepository meetingRepository;
    private final ThesisFormRepository thesisFormRepository;
    private final JwtUtil jwtUtil;
    private final Clock clock;
    private final ProfessorRepository professorRepository;
    private final TimeSlotRepository timeSlotRepository;

    @Value("${app.max-future-days}")
    private long maxFutureDays;

    public List<ThesisDefenseMeetingOutputDTO> getMeetings() {
        return getDBMeetings().stream().map(ThesisDefenseMeetingOutputDTO::from).toList();
    }

    private List<ThesisDefenseMeeting> getDBMeetings() {
        Long currentUserId = jwtUtil.getCurrentUserId();
        return professorRepository.isManager(currentUserId) ?
                meetingRepository.findByManagerId(currentUserId) :
                meetingRepository.findByJuryId(currentUserId);
    }

    @Transactional
    public void acceptFormAsManagerAndCreateMeeting(MeetingCreationInputDTO input) {
        ThesisForm form = thesisFormRepository.findById(input.getFormId())
                .orElseThrow(() -> new RuntimeException("Form not found. Can't Accept Form"));

        if(!professorRepository.existsManagerById(jwtUtil.getCurrentUserId())) {
            throw new UsernameNotFoundException("Manager with this id not found");
        }

        ThesisDefenseMeeting meeting = approveFormAsManager(form);
        input.getJuryIds().add(form.getInstructor().getId());
        suggestJuries(meeting, input.getJuryIds());
    }

    private void suggestJuries(ThesisDefenseMeeting meeting, Set<Long> juryIds) {
        List<Professor> juries = professorRepository.findAllById(juryIds);
        meeting.clearJuries();
        meetingRepository.flush();
        meeting.addJury(juries);
        meeting.setUpdateDate(LocalDateTime.now());

        log.info("Juries suggested for meeting. Meeting: {}, Juries: {}, by manager id: {}", meeting, juries, jwtUtil.getCurrentUserId());
        meetingRepository.save(meeting);
        log.info("Meeting saved after suggesting juries. Meeting: {}, by manager id: {}", meeting, jwtUtil.getCurrentUserId());
    }

    public void specifyAvailableTime(AvailableTimeInputDTO dto) {
        Long currentUserId = jwtUtil.getCurrentUserId();
        Professor professor = professorRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        ThesisDefenseMeeting meeting = meetingRepository.findById(dto.getMeetingId())
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        if (!meeting.getSuggestedJuriesIds().contains(professor.getId())) {
            throw new AuthorizationDeniedException("You are not allowed to add time slot for this meeting");
        }

        timeSlotRepository.deleteAssociationsByDefenseMeetingIdAndProfessorId(dto.getMeetingId(), currentUserId);

        dto.getTimeSlots().forEach(timeSlotDTO -> {
            validateTimeSlot(timeSlotDTO);

            TimeSlot timeSlot = timeSlotRepository
                    .findByDateAndTimePeriodAndDefenseMeeting_Id(
                            timeSlotDTO.getDate(),
                            timeSlotDTO.getTimePeriod(),
                            meeting.getId())
                    .orElseGet(() -> {
                        TimeSlot newSlot = new TimeSlot();
                        newSlot.setDate(timeSlotDTO.getDate());
                        newSlot.setTimePeriod(timeSlotDTO.getTimePeriod());
                        newSlot.setDefenseMeeting(meeting);
                        return timeSlotRepository.save(newSlot);
                    });

            timeSlot.addAvailableProfessor(professor);
            timeSlotRepository.save(timeSlot);
            addTimeSlot(meeting, timeSlot);
            meetingRepository.save(meeting);
        });

        timeSlotRepository.flush();
        meetingRepository.flush();

        boolean allJuriesSpecified = meeting.getSuggestedJuriesIds().stream()
                .allMatch(juryId -> timeSlotRepository.existsByMeetingIdAndJuryId(meeting.getId(), juryId));
        if (allJuriesSpecified) {
            log.debug("All juries are specified. changing meeting state to JURIES_SPECIFIED_TIME");
            meeting.setState(MeetingState.JURIES_SPECIFIED_TIME);
            meeting.setUpdateDate(LocalDateTime.now());
            meetingRepository.save(meeting);
        }
    }

    public void specifyAvailableTime(AvailableTimeRangeInputDTO dto) {
        // TODO
    }

    public void addTimeSlot(ThesisDefenseMeeting meeting, TimeSlot timeSlot) {
        if (meeting.containsTimeSlot(timeSlot)) {
            log.warn("Meeting already contains timeslot. Meeting: {}, timeslot: {}, professor id: {}", meeting, timeSlot, jwtUtil.getCurrentUserId());
            return;
        }
        meeting.addTimeSlot(timeSlot);
        timeSlot.setDefenseMeeting(meeting);
        log.info("Timeslot given. Meeting: {}, timeslot: {}, professor id: {}", meeting, timeSlot, jwtUtil.getCurrentUserId());
    }

    private void validateTimeSlot(TimeSlotDTO timeSlot) {
        if (timeSlot.getDate().isAfter(LocalDate.now(clock).plusDays(maxFutureDays))) {
            throw new IllegalArgumentException("Time slot date must be within %d days from now".formatted(maxFutureDays));
        }

        if (timeSlot.getDate().isBefore(LocalDate.now(clock))) {
            throw new IllegalArgumentException("Time slot date must be in the future");
        }
    }

    private ThesisDefenseMeeting approveFormAsManager(ThesisForm form) {
        if (form.getState() != FormState.ADMIN_APPROVED) {
            throw new IllegalStateException("Form is not in a state that can be approved by manager. Valid state: %s. Current state: %s".formatted(FormState.ADMIN_APPROVED, form.getState()));
        }
        ThesisDefenseMeeting meeting = new ThesisDefenseMeeting();
        meeting.setThesisForm(form);

        form.setState(FormState.MANAGER_APPROVED);
        form.setDefenseMeeting(meeting);
        LocalDateTime now = LocalDateTime.now();
        form.setUpdateDate(now);
        form.setManagerReviewedAt(now);

        meetingRepository.save(meeting);
        thesisFormRepository.save(form);

        return meeting;
    }

    public ThesisDefenseMeetingOutputDTO getMeeting(Long id) {
        return ThesisDefenseMeetingOutputDTO.from(meetingRepository.findById(id).orElseThrow());
    }

    @Transactional(readOnly = true)
    public MeetingTimeSlotsOutputDto getMeetingTimeSlots(Long meetingId) {
        ThesisDefenseMeeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        Professor currentProfessor = professorRepository.findById(jwtUtil.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        Set<Long> suggestedJuriesIds = meeting.getSuggestedJuriesIds();
        if (!suggestedJuriesIds.contains(currentProfessor.getId()) && !currentProfessor.isManager()) {
            throw new AuthorizationDeniedException("You are not allowed to view this meeting");
        }

        List<SimpleUserOutputDto> juryMembers = meeting.getSuggestedJuries();

        List<JuryMemberAvailability> juryMemberTimeSlots = juryMembers.stream()
                .map(jury -> {
                    List<TimeSlotDTO> juryTimeSlots = timeSlotRepository.findByDefenseMeetingIdAndJuryId(meetingId, jury.getId()).stream().map(TimeSlotDTO::from).toList();
                    return new JuryMemberAvailability(jury, juryTimeSlots);
                }).toList();

        List<TimeSlotDTO> intersections = timeSlotRepository.findIntersections(suggestedJuriesIds, suggestedJuriesIds.size(), meeting.getId())
                .stream()
                .map(TimeSlotDTO::from)
                .toList();

        return new MeetingTimeSlotsOutputDto(meeting.getId(), juryMemberTimeSlots, intersections);
    }

    public void completeMeeting(MeetingCompletionInputDTO input) {
        Professor professor = professorRepository.findById(jwtUtil.getCurrentUserId()).orElseThrow();

        ThesisDefenseMeeting meeting = meetingRepository.findById(input.getMeetingId())
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        if (!meeting.getSuggestedJuriesIds().contains(professor.getId())) {
            throw new AuthorizationDeniedException("You are not allowed to complete this meeting");
        }

        if (meeting.getState() != MeetingState.SCHEDULED) {
            throw new IllegalStateException("Only scheduled meetings can be completed");
        }


        LocalDate meetingDate = meeting.getSelectedTimeSlot().getDate();
        LocalDate now = LocalDate.now(clock);
        if (meetingDate.isBefore(now)) {
            log.warn("Meeting date has passed. meeting date: {}, now: {}, meeting: {}", meetingDate, now, meeting);
        }

        meeting.updateProfessorScore(professor, input.getScore());
        if (meeting.allProfessorsScored()) {
            meeting.setScore(meeting.calculateAverageScore());
            meeting.setState(MeetingState.COMPLETED);
            log.info("All professors have scored the meeting. Meeting: {}, average score: {}", meeting, meeting.getScore());
        }

        meeting.setUpdateDate(LocalDateTime.now());
        meetingRepository.save(meeting);
    }

    public void cancelMeeting(Long meetingId) {
        Professor manager = professorRepository.findById(jwtUtil.getCurrentUserId()).orElseThrow();
        if (!manager.isManager()) {
            throw new AuthorizationDeniedException("Only managers can cancel meetings");
        }

        ThesisDefenseMeeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        if (meeting.getState() != MeetingState.SCHEDULED) {
            throw new IllegalStateException("Only scheduled meetings can be cancelled");
        }

        meeting.setState(MeetingState.CANCELED);
        meeting.setUpdateDate(LocalDateTime.now());
        meetingRepository.save(meeting);
    }

    public List<TimeSlotDTO> getMyMeetingTimeSlots(Long meetingId) {
        return timeSlotRepository.findByDefenseMeetingIdAndJuryId(meetingId, jwtUtil.getCurrentUserId())
                .stream().map(TimeSlotDTO::from).toList();
    }

    public void scheduleMeeting(MeetingScheduleInputDTO input) {
        if (!professorRepository.existsManagerById(jwtUtil.getCurrentUserId())) {
            throw new AuthorizationDeniedException("Only managers can schedule meetings");
        }

        ThesisDefenseMeeting meeting = meetingRepository.findById(input.getMeetingId()).orElseThrow();

        if (meeting.getState() != MeetingState.STUDENT_SPECIFIED_TIME) {
            meeting.getState().throwException();
        }

        if (meeting.getSelectedTimeSlot() == null) {
            throw new IllegalStateException("No time slot has been selected for this meeting");
        }

        meeting.setState(MeetingState.SCHEDULED);
        meeting.setUpdateDate(LocalDateTime.now());
        meeting.setLocation(input.getLocation());
        meetingRepository.save(meeting);//todo fix this. logic is flawed. only if student has chosen the time, manager can set location and update meeting state
    }

    public void reassignJuries(MeetingJuriesReassignmentInputDTO input) {
        if (!professorRepository.existsManagerById(jwtUtil.getCurrentUserId())) {
            throw new AuthorizationDeniedException("Only managers can schedule meetings");
        }

        ThesisDefenseMeeting meeting = meetingRepository.findById(input.getMeetingId()).orElseThrow();
        suggestJuries(meeting, input.getJuryIds());
    }
}

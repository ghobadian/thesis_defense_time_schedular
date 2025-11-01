package ir.kghobad.thesis_defense_time_schedular.service;

import ir.kghobad.thesis_defense_time_schedular.dao.ProfessorRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.ThesisDefenseMeetingRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.ThesisFormRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.TimeSlotRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.*;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class ProfessorService {
    private final ProfessorRepository professorRepository;
    private final ThesisFormRepository thesisFormRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final ThesisDefenseMeetingRepository defenseMeetingRepository;
    private final JwtUtil jwtUtil;
    private final Clock clock;


    @Value("${app.max-future-days:30}")
    private long maxFutureDays;


    public void acceptForm(Long formId) {
        Professor professor = professorRepository.findById(jwtUtil.getCurrentUserId())
            .orElseThrow(() -> new RuntimeException("Professor not found"));
            
        ThesisForm form = thesisFormRepository.findById(formId)
            .orElseThrow(() -> new RuntimeException("Form not found. Can't Accept Form"));

        if (!professor.equals(form.getInstructor()) && !professor.isManager()) {
            throw new AuthorizationDeniedException("You are not allowed to approve this form");
        }

        if (professor.isManager()) {
            if (form.getState() != FormState.ADMIN_APPROVED) {
                throw new IllegalStateException("Form is not in a state that can be approved by manager. Valid state: %s. Current state: %s".formatted(FormState.ADMIN_APPROVED));
            }
            ThesisDefenseMeeting meeting = new ThesisDefenseMeeting();
            meeting.setThesisForm(form);
            meeting.addJury(form.getInstructor());

            form.setState(FormState.MANAGER_APPROVED);
            form.setDefenseMeeting(meeting);
            defenseMeetingRepository.save(meeting);
        } else if (professor.equals(form.getInstructor())) {
            if (form.getState() != FormState.SUBMITTED) {// TODO use state design pattern instead
                throw new IllegalStateException("Form is not in a state that can be approved by instructor. Valid state: %s. Current state: %s".formatted(FormState.SUBMITTED, form.getState()));
            }
            form.setState(FormState.INSTRUCTOR_APPROVED);
        }
        
        thesisFormRepository.save(form);
    }

    public void rejectForm(Long formId) {
        Professor professor = professorRepository.findById(jwtUtil.getCurrentUserId())
            .orElseThrow(() -> new RuntimeException("Professor not found"));
            
        ThesisForm form = thesisFormRepository.findById(formId)
            .orElseThrow(() -> new RuntimeException("Form not found. Can't reject Form"));
            
        if (professor.equals(form.getInstructor())) {
            form.setState(FormState.INSTRUCTOR_REJECTED);
        } else if (professor.isManager()) {
            form.setState(FormState.MANAGER_REJECTED);
        } else {
            throw new AuthorizationDeniedException("You are not allowed to reject this form");
        }
        
        thesisFormRepository.save(form);
    }

    public void suggestJuries(FormSuggestionInputDTO input) {
        Professor manager = professorRepository.findById(jwtUtil.getCurrentUserId()).orElseThrow();
        if (!manager.isManager()) {
            throw new AuthorizationDeniedException("Only managers can suggest juries");
        }

        ThesisDefenseMeeting meeting = defenseMeetingRepository.findById(input.getMeetingId())
                .orElseThrow(() -> new RuntimeException("Meeting not found . Id: " + input.getMeetingId()));

        List<Professor> juries = professorRepository.findAllById(input.getJuryIds());
        meeting.addJury(juries);

        defenseMeetingRepository.save(meeting);
    }

    public void specifyAvailableTime(AvailableTimeInputDTO dto) {
        Professor professor = professorRepository.findById(jwtUtil.getCurrentUserId())
            .orElseThrow(() -> new RuntimeException("Professor not found"));
            
        ThesisDefenseMeeting meeting = defenseMeetingRepository.findById(dto.getMeetingId())
            .orElseThrow(() -> new RuntimeException("Meeting not found"));

        if (!meeting.getSuggestedJuriesIds().contains(professor.getId())) {
            throw new AuthorizationDeniedException("You are not allowed to add time slot for this meeting");
        }

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

            if (timeSlot.hasProfessor(professor)) {
                throw new IllegalArgumentException("You have already specified this time slot");
            }


            timeSlot.addAvailableProfessor(professor);
            timeSlotRepository.save(timeSlot);
            addTimeSlot(meeting, timeSlot);
            defenseMeetingRepository.save(meeting);
        });

        timeSlotRepository.flush();
        defenseMeetingRepository.flush();

        boolean allJuriesSpecified = meeting.getSuggestedJuriesIds().stream()
                .allMatch(juryId -> timeSlotRepository.existsByMeetingIdAndJuryId(meeting.getId(), juryId));
        if (allJuriesSpecified) {
            meeting.setState(MeetingState.TIME_SELECTION);
            defenseMeetingRepository.save(meeting);
        }
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

    private static TimeSlot updateTimeSlot(TimeSlot ts, Professor professor) {
        if (ts.hasProfessor(professor)) {
            throw new IllegalArgumentException("You have already specified this time slot");
        }
        ts.addAvailableProfessor(professor);
        return ts;
    }

    private TimeSlot createTimeSlot(TimeSlotDTO timeSlotDTO, ThesisDefenseMeeting meeting, Professor professor) {
        TimeSlot ts = new TimeSlot();
        ts.setDate(timeSlotDTO.getDate());
        ts.setTimePeriod(timeSlotDTO.getTimePeriod());
        ts.setDefenseMeeting(meeting);
        ts.addAvailableProfessor(professor);
        return ts;
    }

    private void validateTimeSlot(TimeSlotDTO timeSlot) {
        if (timeSlot.getDate().isAfter(LocalDate.now(clock).plusDays(maxFutureDays))) {
            throw new IllegalArgumentException("Time slot date must be within %d days from now".formatted(maxFutureDays));
        }

        if (timeSlot.getDate().isBefore(LocalDate.now(clock))) {
            throw new IllegalArgumentException("Time slot date must be in the future");
        }
    }

    public List<ThesisFormOutputDTO> getThesisForms() {
        Long currentUserId = jwtUtil.getCurrentUserId();
        FormState formState = professorRepository.isManager(currentUserId) ? FormState.ADMIN_APPROVED : FormState.SUBMITTED;
        return thesisFormRepository.findAllByInstructorIdAndState(currentUserId, formState)
                .stream().map(ThesisFormOutputDTO::from).toList();
    }

    public void scheduleMeeting(Long meetingId) {
        Professor manager = professorRepository.findById(jwtUtil.getCurrentUserId()).orElseThrow();
        if (!manager.isManager()) {
            throw new AuthorizationDeniedException("Only managers can schedule meetings");
        }

        ThesisDefenseMeeting meeting = defenseMeetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        if (meeting.getState() != MeetingState.TIME_SELECTION) {
            throw new IllegalStateException("Meeting is not in time selection state");
        }

        if (meeting.getSelectedTimeSlot() == null) {
            throw new IllegalStateException("No time slot has been selected for this meeting");
        }

        meeting.setState(MeetingState.SCHEDULED);
        defenseMeetingRepository.save(meeting);
    }

    public void cancelMeeting(Long meetingId) {
        Professor manager = professorRepository.findById(jwtUtil.getCurrentUserId()).orElseThrow();
        if (!manager.isManager()) {
            throw new AuthorizationDeniedException("Only managers can cancel meetings");
        }

        ThesisDefenseMeeting meeting = defenseMeetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        if (meeting.getState() != MeetingState.SCHEDULED) {
            throw new IllegalStateException("Only scheduled meetings can be cancelled");
        }

        meeting.setState(MeetingState.CANCELED);
        defenseMeetingRepository.save(meeting);
    }


    public void completeMeeting(MeetingCompletionInputDTO input) {
        Professor professor = professorRepository.findById(jwtUtil.getCurrentUserId()).orElseThrow();

        ThesisDefenseMeeting meeting = defenseMeetingRepository.findById(input.getMeetingId())
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        if (!meeting.getSuggestedJuriesIds().contains(professor.getId())) {
            throw new AuthorizationDeniedException("You are not allowed to complete this meeting");
        }

        if (meeting.getState() != MeetingState.SCHEDULED) {
            throw new IllegalStateException("Only scheduled meetings can be completed");
        }

        LocalDate meetingDate = meeting.getSelectedTimeSlot().getDate();
        LocalDate now = LocalDate.now(clock);
        if (!meetingDate.equals(now)) {
            if (meetingDate.isBefore(now)) {
                log.warn("Meeting date has passed. meeting date: {}, now: {}, meeting: {}", meetingDate, now, meeting);
            } else {
                log.warn("Meeting date haven't come yet. meeting date: {}, now: {}, meeting: {}", meetingDate, now, meeting);
            }
        }

        meeting.setState(MeetingState.COMPLETED);
        meeting.setScore(input.getScore());
        defenseMeetingRepository.save(meeting);
    }

    public List<ThesisDefenseMeetingOutputDTO> getMeetings() {
        Long currentUserId = jwtUtil.getCurrentUserId();
        return defenseMeetingRepository.findByJuryId(currentUserId)
                .stream().map(ThesisDefenseMeetingOutputDTO::from).toList();
    }
}

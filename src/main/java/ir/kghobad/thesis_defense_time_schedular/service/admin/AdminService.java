package ir.kghobad.thesis_defense_time_schedular.service.admin;

import ir.kghobad.thesis_defense_time_schedular.dao.*;
import ir.kghobad.thesis_defense_time_schedular.model.dto.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.SystemStatsDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingDetailsOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.MeetingState;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {// TODO check security of deletion and update apis
    private final ThesisFormRepository thesisFormRepository;
    private final ThesisDefenseMeetingRepository meetingRepository;
    private final DepartmentRepository departmentRepository;
    private final FieldRepository fieldRepository;
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;


    public SystemStatsDTO getSystemStats() {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);

        return SystemStatsDTO.builder()
                .totalStudents(studentRepository.count())
                .totalProfessors(professorRepository.count())
                .activeProfessors(professorRepository.countActiveProfessors(oneMonthAgo))
                .totalThesisForms(thesisFormRepository.count())
                .pendingForms(thesisFormRepository.countByState(FormState.SUBMITTED))
                .instructorApprovedForms(thesisFormRepository.countByState(FormState.INSTRUCTOR_APPROVED))
                .adminApprovedForms(thesisFormRepository.countByState(FormState.ADMIN_APPROVED))
                .managerApprovedForms(thesisFormRepository.countByState(FormState.MANAGER_APPROVED))
                .instructorRejectedForms(thesisFormRepository.countByState(FormState.INSTRUCTOR_REJECTED))
                .adminRejectedForms(thesisFormRepository.countByState(FormState.ADMIN_REJECTED))
                .managerRejectedForms(thesisFormRepository.countByState(FormState.MANAGER_REJECTED))
                .totalMeetings(meetingRepository.count())
                .upcomingMeetings(meetingRepository.countUpcoming(LocalDate.now(), MeetingState.SCHEDULED))
                .completedMeetings(meetingRepository.countByState(MeetingState.COMPLETED))
                .activeSessions(0L) // TODO: Implement session tracking
                .departmentCount(departmentRepository.count())
                .fieldCount(fieldRepository.count())
                .build();
    }

    public List<SimpleUserOutputDto> getProfessors() {
        return professorRepository.findAll().stream().map(SimpleUserOutputDto::from).toList();
    }

    public List<ThesisDefenseMeetingOutputDTO> getMeetings() {
        return meetingRepository.findAll().stream().map(ThesisDefenseMeetingOutputDTO::from).toList();
    }

    public ThesisDefenseMeetingDetailsOutputDTO getMeeting(Long meetingId) {
        return meetingRepository.findById(meetingId).map(ThesisDefenseMeetingDetailsOutputDTO::from).orElseThrow();
    }
}

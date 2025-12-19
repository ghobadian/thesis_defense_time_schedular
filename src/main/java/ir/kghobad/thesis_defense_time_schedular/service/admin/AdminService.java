package ir.kghobad.thesis_defense_time_schedular.service.admin;

import ir.kghobad.thesis_defense_time_schedular.dao.*;
import ir.kghobad.thesis_defense_time_schedular.model.dto.AdminOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.PhoneUpdateDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.SystemStatsDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingDetailsOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.student.PasswordChangeInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Admin;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.MeetingState;
import ir.kghobad.thesis_defense_time_schedular.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final JwtUtil jwtUtil;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;


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

    public AdminOutputDTO getProfile() {
        return AdminOutputDTO.from(adminRepository.findById(jwtUtil.getCurrentUserId()).orElseThrow());
    }

    public void updatePhone(PhoneUpdateDTO phone) {
        if (adminRepository.existsByPhoneNumber(phone.getPhoneNumber())) {
            throw new RuntimeException("Phone Number is already used by another user");
        }

        Admin admin = adminRepository.findById(jwtUtil.getCurrentUserId()).orElseThrow();
        admin.setPhoneNumber(phone.getPhoneNumber());
        adminRepository.save(admin);
    }

    public void changePassword(PasswordChangeInputDTO input) {
        Admin admin = adminRepository.findById(jwtUtil.getCurrentUserId()).orElseThrow();
        boolean matches = passwordEncoder.matches(input.getCurrentPassword(), admin.getPassword());
        if (!matches) {
            throw new RuntimeException("Wrong password");
        }
        admin.setPassword(passwordEncoder.encode(input.getNewPassword()));
    }
}

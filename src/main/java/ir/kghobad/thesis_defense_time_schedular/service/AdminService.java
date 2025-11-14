package ir.kghobad.thesis_defense_time_schedular.service;

import ir.kghobad.thesis_defense_time_schedular.dao.*;
import ir.kghobad.thesis_defense_time_schedular.model.dto.DepartmentDetailOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.SystemStatsDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.MeetingState;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final ThesisFormRepository thesisFormRepository;
    private final ThesisDefenseMeetingRepository meetingRepository;
    private final DepartmentRepository departmentRepository;
    private final FieldRepository fieldRepository;
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;


    public List<ThesisFormOutputDTO> listForms() {
        return thesisFormRepository.findAllInstructorApprovedThesisForms().stream().map(ThesisFormOutputDTO::from).toList();
    }

    public void approveForm(Long formId) {
        var form = thesisFormRepository.findById(formId).orElseThrow(() -> new IllegalArgumentException("Form not found"));
        if (!form.isApprovedByInstructor()) {
            throw new IllegalStateException("Form must be approved by instructor first");
        }
        form.setState(FormState.ADMIN_APPROVED);
        form.setUpdateDate(new Date());
        thesisFormRepository.save(form);
    }


    public void rejectForm(Long formId) {
        var form = thesisFormRepository.findById(formId).orElseThrow(() -> new IllegalArgumentException("Form not found"));
        if (!form.isApprovedByInstructor()) {
            throw new IllegalStateException("Form must be approved by instructor first");
        }
        form.setState(FormState.ADMIN_REJECTED);
        form.setUpdateDate(new Date());
        thesisFormRepository.save(form);
    }

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

    public List<DepartmentDetailOutputDTO> getDepartments() {
        return departmentRepository.findAll().stream().map(this::toDepartmentDetail).toList();
    }

    private DepartmentDetailOutputDTO toDepartmentDetail(Department department) {
        DepartmentDetailOutputDTO dto = new DepartmentDetailOutputDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setStudentCount(studentRepository.countByDepartmentId(department.getId()));
        dto.setProfessorCount(professorRepository.countByDepartmentId(department.getId()));
        dto.setFieldCount(fieldRepository.countByDepartmentId(department.getId()));
        List<FormState> activeStates = List.of(FormState.SUBMITTED, FormState.INSTRUCTOR_APPROVED, FormState.ADMIN_APPROVED, FormState.MANAGER_APPROVED);
        dto.setActiveThesisCount(thesisFormRepository.countByStudent_DepartmentIdAndStateIn(department.getId(), activeStates));
        return dto;

    }

    public List<SimpleUserOutputDto> getProfessors() {
        return professorRepository.findAll().stream().map(SimpleUserOutputDto::from).toList();
    }
}

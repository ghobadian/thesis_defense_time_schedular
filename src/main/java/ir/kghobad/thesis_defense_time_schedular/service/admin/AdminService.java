package ir.kghobad.thesis_defense_time_schedular.service.admin;

import ir.kghobad.thesis_defense_time_schedular.dao.*;
import ir.kghobad.thesis_defense_time_schedular.model.dto.*;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingDetailsOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.student.StudentOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.student.StudentRegistrationInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.BachelorStudent;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.MasterStudent;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.PhDStudent;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.MeetingState;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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


    public List<StudentOutputDTO> getStudents(String search, Long departmentId, Integer page, Integer limit) {
        Specification<Student> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (departmentId != null) {
                predicates.add(cb.equal(root.get("department").get("id"), departmentId));
            }

            if (StringUtils.hasText(search)) {
                String searchLike = "%" + search.toLowerCase() + "%";

                Predicate firstNameMatch = cb.like(cb.lower(root.get("firstName")), searchLike);
                Predicate lastNameMatch = cb.like(cb.lower(root.get("lastName")), searchLike);
                Predicate studentNumberMatch = cb.like(root.get("studentNumber").as(String.class), searchLike);

                predicates.add(cb.or(firstNameMatch, lastNameMatch, studentNumberMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        page = (page != null && page >= 0) ? page : 0;
        int size = limit == null ? 10 : limit;

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        return studentRepository.findAll(spec, pageable)
                .stream()
                .map(StudentOutputDTO::from)
                .toList();
    }

    public void deleteStudent(Long studentId) {
        studentRepository.deleteById(studentId);
    }

    public void registerStudent(StudentRegistrationInputDTO dto) {//TODO move to adminService
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        ;
        Field field = fieldRepository.findById(dto.getFieldId())
                .orElseThrow(() -> new RuntimeException("Field not found"));

        Professor instructor = professorRepository.findById(dto.getInstructorId())
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        Student student = switch (dto.getStudentType()) {
            case BACHELOR -> new BachelorStudent();
            case MASTER -> new MasterStudent();
            case PHD -> new PhDStudent();
        };

        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setEmail(dto.getEmail());
        student.setPhoneNumber(dto.getPhoneNumber());
        student.setPassword(passwordEncoder.encode(dto.getPassword()));
        student.setStudentNumber(dto.getStudentNumber());
        student.setDepartment(department);
        student.setField(field);
        student.setEnabled(true);
        field.addStudent(student);
        student.setInstructor(instructor);


        studentRepository.save(student);
    }

    public void registerStudents(List<StudentRegistrationInputDTO> studentRegistrationForms) {//TODO move to adminService
        studentRegistrationForms.forEach(this::registerStudent);
    }
}

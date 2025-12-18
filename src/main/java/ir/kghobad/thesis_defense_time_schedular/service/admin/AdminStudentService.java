package ir.kghobad.thesis_defense_time_schedular.service.admin;

import ir.kghobad.thesis_defense_time_schedular.dao.*;
import ir.kghobad.thesis_defense_time_schedular.model.dto.student.StudentOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.student.StudentRegistrationInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.BachelorStudent;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.MasterStudent;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.PhDStudent;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

@Service
@RequiredArgsConstructor
public class AdminStudentService {
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;
    private final FieldRepository fieldRepository;
    private final ProfessorRepository professorRepository;

    public void registerStudent(StudentRegistrationInputDTO dto) {
        Student student = switch (dto.getStudentType()) {
            case BACHELOR -> new BachelorStudent();
            case MASTER -> new MasterStudent();
            case PHD -> new PhDStudent();
        };

        applyStudentData(student, dto, false);
        studentRepository.save(student);
    }

    public void registerStudents(List<StudentRegistrationInputDTO> studentRegistrationForms) {
        studentRegistrationForms.forEach(this::registerStudent);
    }

    public void updateStudent(Long studentId, StudentRegistrationInputDTO input) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        applyStudentData(student, input, true);
        studentRepository.save(student);
    }

    private void applyStudentData(Student student, StudentRegistrationInputDTO dto, boolean skipEmptyFields) {
        applyIfValid(dto.getFirstName(), skipEmptyFields, student::setFirstName);
        applyIfValid(dto.getLastName(), skipEmptyFields, student::setLastName);
        applyIfValid(dto.getEmail(), skipEmptyFields, student::setEmail);
        applyIfValid(dto.getPhoneNumber(), skipEmptyFields, student::setPhoneNumber);

        if (!skipEmptyFields || StringUtils.hasText(dto.getPassword())) {
            student.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        if (!skipEmptyFields || (dto.getStudentNumber() != null && dto.getStudentNumber() > 0)) {
            student.setStudentNumber(dto.getStudentNumber());
        }

        if (!skipEmptyFields || dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            student.setDepartment(department);
        }

        if (!skipEmptyFields || dto.getFieldId() != null) {
            Field field = fieldRepository.findById(dto.getFieldId())
                    .orElseThrow(() -> new RuntimeException("Field not found"));
            if (skipEmptyFields && student.getField() != null && !student.getField().getId().equals(field.getId())) {
                student.getDepartment().removeUser(student);
            }
            student.setField(field);
            field.addStudent(student);
        }

        if (!skipEmptyFields || dto.getInstructorId() != null) {
            Professor instructor = professorRepository.findById(dto.getInstructorId())
                    .orElseThrow(() -> new RuntimeException("Instructor not found"));
            student.setInstructor(instructor);
        }

        if (!skipEmptyFields) {
            student.setEnabled(true);
        }
    }

    private void applyIfValid(String value, boolean skipEmpty, Consumer<String> setter) {
        if (!skipEmpty || StringUtils.hasText(value)) {
            setter.accept(value);
        }
    }

    public List<StudentOutputDTO> getStudents(String search, Long departmentId, Integer page,
                                              Integer limit, String studentType) {
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

            if (StringUtils.hasText(studentType)) {
                Class<? extends Student> studentClass = switch (studentType.toUpperCase()) {
                    case "BACHELOR" -> BachelorStudent.class;
                    case "MASTER" -> MasterStudent.class;
                    case "PHD" -> PhDStudent.class;
                    default -> null;
                };

                if (studentClass != null) {
                    predicates.add(cb.equal(root.type(), studentClass));
                }
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

    public StudentOutputDTO getStudent(Long studentId) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        return StudentOutputDTO.from(student);
    }
}

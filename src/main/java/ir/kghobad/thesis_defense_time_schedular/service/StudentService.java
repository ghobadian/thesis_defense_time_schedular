package ir.kghobad.thesis_defense_time_schedular.service;

import ir.kghobad.thesis_defense_time_schedular.dao.*;
import ir.kghobad.thesis_defense_time_schedular.model.dto.StudentRegistrationInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.ThesisFormDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.*;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.*;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.BachelorStudent;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.MasterStudent;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.PhDStudent;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.StudentType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentService {
    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final FieldRepository fieldRepository;
    private final ProfessorRepository professorRepository;
    private final ThesisFormRepository thesisFormRepository;
    private final PasswordEncoder passwordEncoder;
    
    public StudentService(
        StudentRepository studentRepository,
        DepartmentRepository departmentRepository,
        FieldRepository fieldRepository,
        ProfessorRepository professorRepository,
        ThesisFormRepository thesisFormRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
        this.fieldRepository = fieldRepository;
        this.professorRepository = professorRepository;
        this.thesisFormRepository = thesisFormRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public Student registerStudent(StudentRegistrationInputDTO dto) {
        Department department = departmentRepository.findById(dto.getDepartmentId())
            .orElseThrow(() -> new RuntimeException("Department not found"));
            
        Field field = fieldRepository.findById(dto.getFieldId())
            .orElseThrow(() -> new RuntimeException("Field not found"));
            
        Professor instructor = professorRepository.findById(dto.getInstructorId())
            .orElseThrow(() -> new RuntimeException("Instructor not found"));
        
        Student student = switch (dto.getStudentType()) {
            case BACHELOR -> new BachelorStudent();
            case MASTER -> new MasterStudent();
            case PHD -> new PhDStudent();
            default -> throw new RuntimeException("Invalid student type");
        };

        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setEmail(dto.getEmail());
        student.setPhoneNumber(dto.getPhoneNumber());
        student.setPassword(passwordEncoder.encode(dto.getPassword()));
        student.setStudentNumber(dto.getStudentNumber());
        student.setDepartment(department);
        student.setField(field);
        student.setInstructor(instructor);
        
        return studentRepository.save(student);
    }
    
    public List<Student> registerStudents(List<StudentRegistrationInputDTO> dtos) {
        return dtos.stream()
            .map(this::registerStudent)
            .collect(Collectors.toList());
    }
    
    public ThesisForm createThesisForm(Long studentId, ThesisFormDTO dto) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
            
        ThesisForm form = new ThesisForm();
        form.setStudentType(findStudentType(student));
        form.setStudent(student);
        form.setInstructor(student.getInstructor());
        form.setState(FormState.DRAFT);
        form.setSubmissionDate(new Date());
        
        return thesisFormRepository.save(form);
    }

    private StudentType findStudentType(Student student) {
        return switch (student) {
            case BachelorStudent bachelorStudent -> StudentType.BACHELOR;
            case MasterStudent masterStudent -> StudentType.MASTER;
            case PhDStudent phDStudent -> StudentType.PHD;
            case null, default -> throw new RuntimeException("Student type not supported yet");
        };
    }
}

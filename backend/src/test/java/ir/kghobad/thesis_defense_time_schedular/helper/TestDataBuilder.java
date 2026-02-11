package ir.kghobad.thesis_defense_time_schedular.helper;

import ir.kghobad.thesis_defense_time_schedular.model.dto.user.student.StudentRegistrationInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import ir.kghobad.thesis_defense_time_schedular.model.entity.TimeSlot;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Admin;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.BachelorStudent;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.MasterStudent;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.PhDStudent;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.StudentType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class TestDataBuilder {
    public static final String DEFAULT_PASSWORD = "testpass123";

    
    private final PasswordEncoder passwordEncoder;
    
    public TestDataBuilder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    
    public Department createDepartment(String name) {
        Department department = new Department();
        department.setName(name);
        return department;
    }
    
    public Field createField(String name, Department department) {
        Field field = new Field();
        field.setName(name);
        field.setDepartment(department);
        return field;
    }
    
    public Professor createProfessor(String email, String firstName, String lastName, Department department, String phone) {
        Professor professor = new Professor();
        professor.setEmail(email);
        professor.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
        professor.setFirstName(firstName);
        professor.setLastName(lastName);
        professor.setPhoneNumber(phone);
        professor.setDepartment(department);
        professor.setEnabled(true);
        return professor;
    }

    public Professor createManager(String email, String firstName, String lastName, Department department, String phone) {
        Professor manager = createProfessor(email, firstName, lastName, department, phone);
        manager.setManager(true);
        return manager;
    }
    
    public Student createStudent(String email, String firstName, String lastName, 
                                Long studentNumber, StudentType type, 
                                Department department, Field field, Professor instructor, String phone) {
        Student student = switch (type) {
            case BACHELOR -> new BachelorStudent();
            case MASTER -> new MasterStudent();
            case PHD -> new PhDStudent();
        };
        student.setEmail(email);
        student.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
        student.setFirstName(firstName);
        student.setLastName(lastName);
        student.setPhoneNumber(phone);
        student.setStudentNumber(studentNumber);
        student.setDepartment(department);
        student.setField(field);
        student.setInstructor(instructor);
        student.setEnabled(true);
        return student;
    }



    public Admin createAdmin(String email, String firstName, String lastName, String phone) {
        Admin admin = new Admin();
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
        admin.setFirstName(firstName);
        admin.setLastName(lastName);
        admin.setPhoneNumber(phone);
        admin.setEnabled(true);
        return admin;
    }

    public StudentRegistrationInputDTO getRegistrationInputDTO(Department dept, Field field, Professor instructor) {
        return new StudentRegistrationInputDTO(
                "Student", "One", "student1@test.com", "09121234567",
                12345L, StudentType.MASTER, dept.getId(), field.getId(),
                instructor.getId(), DEFAULT_PASSWORD
        );
    }

    public ThesisDefenseMeeting createThesisDefenseMeeting(List<TimeSlot> timeSlots, List<Professor> juries, ThesisForm form) {
        ThesisDefenseMeeting meeting = new ThesisDefenseMeeting();
        timeSlots.forEach(t -> {
            meeting.addTimeSlot(t);
            t.setDefenseMeeting(meeting);
        });
        meeting.addJury(juries);
        meeting.setThesisForm(form);
        return meeting;
    }

    public ThesisForm createThesisForm(String title, String abstractText, Student student, Professor instructor,
                                       FormState state, LocalDateTime submissionDate, Field field) {
        ThesisForm thesisForm = new ThesisForm();
        thesisForm.setTitle(title);
        thesisForm.setAbstractText(abstractText);
        thesisForm.setStudent(student);
        thesisForm.setInstructor(instructor);
        thesisForm.setState(state);
        thesisForm.setSubmissionDate(submissionDate);
        thesisForm.setUpdateDate(submissionDate);
        thesisForm.setField(field);
        thesisForm.setStudentType(student.getStudentType());
        return thesisForm;
    }

}

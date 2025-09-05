package ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform;

import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.StudentType;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "thesis_form")
public class ThesisForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "instructor_id", nullable = false)
    private Professor instructor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FormState state;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "submission_date")
    private Date submissionDate;

    @ManyToMany
    @JoinTable(
            name = "thesis_form_suggested_juries",
            joinColumns = @JoinColumn(name = "thesis_form_id"),
            inverseJoinColumns = @JoinColumn(name = "professor_id")
    )
    private List<Professor> suggestedJuries;

    @OneToOne(mappedBy = "thesisForm")
    private ThesisDefenseMeeting defenseMeeting;

    @ManyToOne
    @JoinColumn(name = "field_id")
    private Field field;

    @Column
    @Enumerated(EnumType.STRING)
    private StudentType studentType;

    public ThesisForm(Long id, Student student, Professor instructor, FormState state, Date submissionDate, List<Professor> suggestedJuries, ThesisDefenseMeeting defenseMeeting, Field field, StudentType studentType) {
        this.id = id;
        this.student = student;
        this.instructor = instructor;
        this.state = state;
        this.submissionDate = submissionDate;
        this.suggestedJuries = suggestedJuries;
        this.defenseMeeting = defenseMeeting;
        this.field = field;
        this.studentType = studentType;
    }

    public ThesisForm() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Professor getInstructor() {
        return instructor;
    }

    public void setInstructor(Professor instructor) {
        this.instructor = instructor;
    }

    public FormState getState() {
        return state;
    }

    public void setState(FormState state) {
        this.state = state;
    }

    public Date getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(Date submissionDate) {
        this.submissionDate = submissionDate;
    }

    public List<Professor> getSuggestedJuries() {
        return suggestedJuries;
    }

    public void setSuggestedJuries(List<Professor> suggestedJuries) {
        this.suggestedJuries = suggestedJuries;
    }

    public ThesisDefenseMeeting getDefenseMeeting() {
        return defenseMeeting;
    }

    public void setDefenseMeeting(ThesisDefenseMeeting defenseMeeting) {
        this.defenseMeeting = defenseMeeting;
    }

    public Field getField() {
        return field;
    }

    public void setField(Field field) {
        this.field = field;
    }

    public StudentType getStudentType() {
        return studentType;
    }

    public void setStudentType(StudentType studentType) {
        this.studentType = studentType;
    }
}
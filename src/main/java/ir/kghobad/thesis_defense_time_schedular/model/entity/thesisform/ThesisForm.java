package ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.model.enums.StudentType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "thesis_form")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class ThesisForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter
    @Getter
    private Long id;

    @Column(name = "title")
    @Setter
    @Getter
    private String title;

    @Column(name = "abstract_text")
    @Setter
    @Getter
    private String abstractText;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @Setter
    @Getter
    private Student student;

    @ManyToOne
    @JoinColumn(name = "instructor_id", nullable = false)
    @Setter
    @Getter
    private Professor instructor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Setter
    @Getter
    private FormState state;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "submission_date")
    @Setter
    @Getter
    private Date submissionDate;

    @OneToOne(mappedBy = "thesisForm", cascade = CascadeType.ALL, orphanRemoval = true)
    @Setter
    @Getter
    private ThesisDefenseMeeting defenseMeeting;

    @ManyToOne
    @JoinColumn(name = "field_id")
    @Setter
    @Getter
    private Field field;

    @Column
    @Enumerated(EnumType.STRING)
    @Setter
    @Getter
    private StudentType studentType;

    public ThesisForm(Long id,
                      Student student,
                      Professor instructor,
                      FormState state,
                      Date submissionDate,
                      ThesisDefenseMeeting defenseMeeting,
                      Field field) {
        this.id = id;
        this.student = student;
        this.instructor = instructor;
        this.state = state;
        this.submissionDate = submissionDate;
        this.defenseMeeting = defenseMeeting;
        this.field = field;
        this.studentType = student.getStudentType();
    }

    public ThesisForm() {

    }

    public boolean isApprovedByInstructor() {
        return this.state == FormState.INSTRUCTOR_APPROVED || isApprovedByAdmin() || isApprovedByManager();
    }

    public boolean isApprovedByAdmin() {
        return this.state == FormState.ADMIN_APPROVED || isApprovedByManager();
    }

    public boolean isApprovedByManager() {
        return this.state == FormState.MANAGER_APPROVED;
    }


}
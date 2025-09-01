package ir.kghobad.thesis_defense_time_schedular.model.entity;

import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Student;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "thesis_form")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "form_type", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class ThesisForm {
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
            name = "thesis_form_juries",
            joinColumns = @JoinColumn(name = "form_id"),
            inverseJoinColumns = @JoinColumn(name = "professor_id")
    )
    private List<Professor> suggestedJuries;

    @OneToOne(mappedBy = "thesisForm")
    private ThesisDefenseMeeting defenseMeeting;
}
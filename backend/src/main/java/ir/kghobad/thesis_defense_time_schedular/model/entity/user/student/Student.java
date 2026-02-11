package ir.kghobad.thesis_defense_time_schedular.model.entity.user.student;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.User;
import ir.kghobad.thesis_defense_time_schedular.model.enums.Role;
import ir.kghobad.thesis_defense_time_schedular.model.enums.StudentType;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
@Table(name = "student")
@Inheritance(strategy = InheritanceType.JOINED)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@EqualsAndHashCode(callSuper = true)
public abstract class Student extends User {
    @Column(name = "student_number", unique = true, nullable = false)
    @Getter
    @Setter
    private Long studentNumber;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    @Getter
    @Setter
    private Professor instructor;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ThesisForm> thesisForms = new HashSet<>(16);

    @Column(name = "graduation_date")
    @Getter
    @Setter
    private LocalDateTime graduationDate;


    public Student(Long id,
                   String firstName,
                   String lastName,
                   String email,
                   String phoneNumber,
                   String password,
                   Department department,
                   boolean enabled,
                   Long studentNumber,
                   Professor instructor,
                   Field field) {
        super(id, firstName, lastName, email, phoneNumber, password, department, field, enabled, LocalDateTime.now());
        this.studentNumber = studentNumber;
        this.instructor = instructor;
    }

    public Student() {
        super();
    }

    public void addThesisForm(ThesisForm thesisForm) {
        if (!this.thesisForms.contains(thesisForm)) {
            thesisForms.add(thesisForm);
            thesisForm.setStudent(this);
        }
    }

    public void removeThesisForm(ThesisForm thesisForm) {
        if (this.thesisForms.contains(thesisForm)) {
            thesisForms.remove(thesisForm);
            thesisForm.setStudent(null);
        }
    }

    public StudentType getStudentType() {
        return switch (this) {
            case BachelorStudent bachelorStudent -> StudentType.BACHELOR;
            case MasterStudent masterStudent -> StudentType.MASTER;
            case PhDStudent phDStudent -> StudentType.PHD;
            default -> throw new IllegalStateException("Unknown student type");
        };
    }

    @Override
    public Role getRole() {
        return Role.STUDENT;
    }

    public List<ThesisFormOutputDTO> getThesisForms() {
        return thesisForms.stream().map(ThesisFormOutputDTO::from).toList();
    }

    public boolean isGraduated() {
        return this.graduationDate != null && this.graduationDate.isBefore(LocalDateTime.now());
    }



}
package ir.kghobad.thesis_defense_time_schedular.model.entity.user;

import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "student")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "student_type", discriminatorType = DiscriminatorType.STRING)
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public abstract class Student extends User {
    @Column(name = "student_number", unique = true, nullable = false)
    private Long studentNumber;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private Professor instructor;

    @ManyToOne
    @JoinColumn(name = "field_id")
    private Field field;
}
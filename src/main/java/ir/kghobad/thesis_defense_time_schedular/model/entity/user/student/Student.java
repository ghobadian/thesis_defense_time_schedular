package ir.kghobad.thesis_defense_time_schedular.model.entity.user.student;

import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.User;
import jakarta.persistence.*;

import java.util.Objects;


@Entity
@Table(name = "student")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Student extends User {
    @Column(name = "student_number", unique = true, nullable = false)
    private Long studentNumber;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private Professor instructor;

    @ManyToOne
    @JoinColumn(name = "field_id")
    private Field field;


    public Student(Long studentNumber, Professor instructor, Field field) {
        this.studentNumber = studentNumber;
        this.instructor = instructor;
        this.field = field;
    }

    public Student() {
        super();
    }

    public Long getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(Long studentNumber) {
        this.studentNumber = studentNumber;
    }

    public Professor getInstructor() {
        return instructor;
    }

    public void setInstructor(Professor instructor) {
        this.instructor = instructor;
    }

    public Field getField() {
        return field;
    }

    public void setField(Field field) {
        this.field = field;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Student student = (Student) o;
        return Objects.equals(studentNumber, student.studentNumber) && Objects.equals(instructor, student.instructor) && Objects.equals(field, student.field);
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentNumber, instructor, field);
    }
}
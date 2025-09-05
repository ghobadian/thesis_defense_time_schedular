package ir.kghobad.thesis_defense_time_schedular.model.entity.user.student;

import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "bachelor_student")
public class BachelorStudent extends Student {

    public BachelorStudent(Long studentNumber, Professor instructor, Field field) {
        super(studentNumber, instructor, field);
    }

    public BachelorStudent() {

    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        return super.equals(obj);
    }
}
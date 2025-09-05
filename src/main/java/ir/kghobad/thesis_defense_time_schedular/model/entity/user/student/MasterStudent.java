package ir.kghobad.thesis_defense_time_schedular.model.entity.user.student;

import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import jakarta.persistence.Table;
import jakarta.persistence.Entity;

@Entity
@Table(name = "master_student")
public class MasterStudent extends Student {
    public MasterStudent(Long studentNumber, Professor instructor, Field field) {
        super(studentNumber, instructor, field);
    }

    public MasterStudent() {

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
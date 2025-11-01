package ir.kghobad.thesis_defense_time_schedular.model.entity.user.student;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import jakarta.persistence.Table;
import jakarta.persistence.Entity;

@Entity
@Table(name = "master_student")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class MasterStudent extends Student {
    public MasterStudent(Long id, String firstName, String lastName, String email, String phoneNumber, String password, Department department, boolean enabled, Long studentNumber, Professor instructor, Field field) {
        super(id, firstName, lastName, email, phoneNumber, password, department, enabled, studentNumber, instructor, field);
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
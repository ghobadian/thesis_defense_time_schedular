package ir.kghobad.thesis_defense_time_schedular.model.entity.user;

import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;


@Entity
@Table(name = "admin")
@DiscriminatorValue("ADMIN")
public class Admin extends User {


    public Admin(Long id, String firstName, String lastName, String email, String phoneNumber, String password, Department department) {
        super(id, firstName, lastName, email, phoneNumber, password, department);
    }

    public Admin() {

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
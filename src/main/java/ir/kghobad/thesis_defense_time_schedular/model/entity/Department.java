package ir.kghobad.thesis_defense_time_schedular.model.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "department")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Setter
    private Long id;

    @Column(nullable = false, unique = true)
    @Getter
    @Setter
    private String name;

    @OneToMany(mappedBy = "department")
    private final Set<User> users = new HashSet<>();

    @OneToMany(mappedBy = "department")
    private final Set<Field> fields = new HashSet<>(16);

    public Department(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Department() {
    }

    public void addUser(User user) {
        if (!this.users.contains(user)) {
            users.add(user);
            user.setDepartment(this);
        }
    }

    public void removeUser(User user) {
        if (this.users.contains(user)) {
            users.remove(user);
            user.setDepartment(null);
        }
    }

    public void addField(Field field) {
        if (!this.fields.contains(field)) {
            fields.add(field);
            field.setDepartment(this);
        }
    }

    public void removeField(Field field) {
        if (this.fields.contains(field)) {
            fields.remove(field);
            field.setDepartment(null);
        }
    }
}
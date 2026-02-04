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
@Table(name = "field")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")

public class Field {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Setter
    private Long id;
    
    @Column(nullable = false)
    @Getter
    @Setter
    private String name;

    @Column(nullable = false)
    @Getter
    @Setter
    private boolean active = true;

    @ManyToOne
    @JoinColumn(name = "department_id")
    @Getter
    @Setter
    private Department department;

    @OneToMany(mappedBy = "field")
    private final Set<User> users = new HashSet<>();

    public Field(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Field() {

    }

    public void addUser(User user) {
        if (!this.users.contains(user)) {
            users.add(user);
            user.setField(this);
        }
    }
}
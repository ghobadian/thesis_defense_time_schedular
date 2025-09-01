package ir.kghobad.thesis_defense_time_schedular.model.entity.user;

import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisForm;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@Table(name = "professor")
@DiscriminatorValue("PROFESSOR")
@Data
@EqualsAndHashCode(callSuper = true)
public class Professor extends User {

    @Column(name = "is_manager")
    private boolean isManager;

    @OneToMany(mappedBy = "instructor")
    private List<Student> students;

    @OneToMany(mappedBy = "instructor")
    private List<ThesisForm> supervisedForms;

    @ManyToMany(mappedBy = "suggestedJuries")
    private List<ThesisForm> juryForms;


}
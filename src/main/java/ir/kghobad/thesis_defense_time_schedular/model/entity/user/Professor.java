package ir.kghobad.thesis_defense_time_schedular.model.entity.user;

import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import jakarta.persistence.*;

import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "professor")
@DiscriminatorValue("PROFESSOR")
public class Professor extends User {

    @Column(name = "is_manager")
    private boolean isManager;

    @OneToMany(mappedBy = "instructor")
    private List<Student> students;

    @OneToMany(mappedBy = "instructor")
    private List<ThesisForm> supervisedForms;

    @ManyToMany(mappedBy = "suggestedJuries")
    private List<ThesisForm> juryForms;

    public Professor(boolean isManager, List<Student> students, List<ThesisForm> supervisedForms, List<ThesisForm> juryForms) {
        this.isManager = isManager;
        this.students = students;
        this.supervisedForms = supervisedForms;
        this.juryForms = juryForms;
    }

    public Professor() {

    }

    public boolean isManager() {
        return isManager;
    }

    public void setManager(boolean manager) {
        isManager = manager;
    }

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }

    public List<ThesisForm> getSupervisedForms() {
        return supervisedForms;
    }

    public void setSupervisedForms(List<ThesisForm> supervisedForms) {
        this.supervisedForms = supervisedForms;
    }

    public List<ThesisForm> getJuryForms() {
        return juryForms;
    }

    public void setJuryForms(List<ThesisForm> juryForms) {
        this.juryForms = juryForms;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Professor professor = (Professor) o;
        return isManager == professor.isManager && Objects.equals(students, professor.students) && Objects.equals(supervisedForms, professor.supervisedForms) && Objects.equals(juryForms, professor.juryForms);
    }

    @Override
    public int hashCode() {
        return Objects.hash(isManager, students, supervisedForms, juryForms);
    }
}
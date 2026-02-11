package ir.kghobad.thesis_defense_time_schedular.model.entity.user;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import ir.kghobad.thesis_defense_time_schedular.model.entity.TimeSlot;
import ir.kghobad.thesis_defense_time_schedular.model.entity.association.DefenseMeetingProfessorAssociation;
import ir.kghobad.thesis_defense_time_schedular.model.entity.association.TimeSlotProfessorAssociation;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.model.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "professor")
@DiscriminatorValue("PROFESSOR")
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@AllArgsConstructor
@NoArgsConstructor
public class Professor extends User {

    @Setter
    @Column(name = "is_manager")
    @Getter
    private boolean manager;

    @OneToMany(mappedBy = "instructor")
    private final Set<Student> students = new HashSet<>(512);

    @OneToMany(mappedBy = "instructor")
    private final Set<ThesisForm> supervisedForms = new HashSet<>(512);

    @OneToMany(mappedBy = "professor")
    private final Set<DefenseMeetingProfessorAssociation> defenseMeetingProfessorAssociations = new HashSet<>(512);

    @OneToMany(mappedBy = "professor", cascade = CascadeType.ALL, orphanRemoval = true)
    private final Set<TimeSlotProfessorAssociation> timeSlotProfessorAssociations = new HashSet<>(1024);

    @Override
    public Role getRole() {
        return isManager() ? Role.MANAGER : Role.PROFESSOR;
    }


    public void addStudent(Student student) {
        students.add(student);
        student.setInstructor(this);
    }

    public void removeStudent(Student student) {
        students.remove(student);
        student.setInstructor(null);
    }

    public void addSupervisedForm(ThesisForm form) {
        supervisedForms.add(form);
        form.setInstructor(this);
    }

    public void removeSupervisedForm(ThesisForm form) {
        supervisedForms.remove(form);
        form.setInstructor(null);
    }


    public void addMeeting(ThesisDefenseMeeting meeting) {
        DefenseMeetingProfessorAssociation association = findOrCreateAssociation(meeting);
        if (!this.defenseMeetingProfessorAssociations.contains(association)) {
            this.defenseMeetingProfessorAssociations.add(association);
            meeting.addJury(this);
        }
    }

    private DefenseMeetingProfessorAssociation findOrCreateAssociation(ThesisDefenseMeeting meeting) {
        return this.defenseMeetingProfessorAssociations.stream()
                .filter(a -> a.getDefenseMeeting().equals(meeting))
                .findFirst()
                .orElseGet(() -> {
                    DefenseMeetingProfessorAssociation newAssoc = new DefenseMeetingProfessorAssociation();
                    newAssoc.setDefenseMeeting(meeting);
                    newAssoc.setProfessor(this);
                    return newAssoc;
                });
    }

    public void removeMeeting(ThesisDefenseMeeting meeting) {
        DefenseMeetingProfessorAssociation association = new DefenseMeetingProfessorAssociation();
        association.setDefenseMeeting(meeting);
        association.setProfessor(this);
        if (this.defenseMeetingProfessorAssociations.contains(association)) {
            this.defenseMeetingProfessorAssociations.remove(association);
            meeting.removeJury(this);
        }
    }

    public void removeAvailableSlot(TimeSlot slot) {
        TimeSlotProfessorAssociation association = new TimeSlotProfessorAssociation();
        association.setTimeSlot(slot);
        association.setProfessor(this);
        if (this.timeSlotProfessorAssociations.contains(association)) {
            this.timeSlotProfessorAssociations.remove(association);
            slot.removeAvailableProfessor(this);
        }
    }

    public void addTimeSlotAssociation(TimeSlotProfessorAssociation association) {
        this.timeSlotProfessorAssociations.add(association);
    }

    public void addMeetingProfessorAssociation(DefenseMeetingProfessorAssociation association) {
        this.defenseMeetingProfessorAssociations.add(association);
    }

    public void removeMeetingProfessorAssociation(DefenseMeetingProfessorAssociation association) {
        this.defenseMeetingProfessorAssociations.remove(association);
    }

    public boolean containsAssociation(DefenseMeetingProfessorAssociation association) {
        return this.defenseMeetingProfessorAssociations.contains(association);
    }
}
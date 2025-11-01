package ir.kghobad.thesis_defense_time_schedular.model.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import ir.kghobad.thesis_defense_time_schedular.model.entity.association.DefenseMeetingProfessorAssociation;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.User;
import ir.kghobad.thesis_defense_time_schedular.model.enums.MeetingState;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.*;
import java.util.stream.Collectors;

@Entity
@Table(name = "thesis_defense_meeting")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@ToString(of = {"id"})
public class ThesisDefenseMeeting {
    @Setter
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @OneToOne
    @JoinColumn(name = "thesis_form_id", nullable = false)
    private ThesisForm thesisForm;
    

    @OneToMany(mappedBy = "defenseMeeting", cascade = CascadeType.ALL, orphanRemoval = true)
    private final Set<DefenseMeetingProfessorAssociation> defenseMeetingProfessorAssociations = new HashSet<>(8);

    @OneToOne(cascade = CascadeType.ALL)
    @Getter
    @Setter
    private TimeSlot selectedTimeSlot;
    
    @OneToMany(mappedBy = "defenseMeeting", cascade = CascadeType.ALL)
    private final Set<TimeSlot> availableSlots =  new HashSet<>(64);

    @Getter
    @Setter
    private double score;

    @Getter
    @Setter
    private MeetingState state = MeetingState.JURY_SELECTION;

    public ThesisDefenseMeeting(Long id, ThesisForm thesisForm, MeetingState state) {
        this.id = id;
        this.thesisForm = thesisForm;
        this.state = state;
    }

    public ThesisDefenseMeeting() {

    }

    public boolean containsTimeSlot(TimeSlot timeSlot) {
        return this.availableSlots.contains(timeSlot);
    }

    public void removeTimeSlot(TimeSlot timeSlot) {
        availableSlots.remove(timeSlot);
    }

    public void addJury(Professor professor) {
        DefenseMeetingProfessorAssociation association = new DefenseMeetingProfessorAssociation();
        association.setDefenseMeeting(this);
        association.setProfessor(professor);
        if (!this.defenseMeetingProfessorAssociations.contains(association)) {
            this.defenseMeetingProfessorAssociations.add(association);
            professor.addMeeting(this);
        }
    }

    public void removeJury(Professor professor) {
        DefenseMeetingProfessorAssociation association = new DefenseMeetingProfessorAssociation();
        association.setDefenseMeeting(this);
        association.setProfessor(professor);
        if (this.defenseMeetingProfessorAssociations.contains(association)) {
            this.defenseMeetingProfessorAssociations.remove(association);
            professor.removeMeeting(this);
        }
    }


    public void addJury(List<Professor> juries) {
        juries.forEach(this::addJury);
    }


    public Set<Long> getSuggestedJuriesIds() {
        return defenseMeetingProfessorAssociations.stream()
                .map(DefenseMeetingProfessorAssociation::getProfessor)
                .map(User::getId).collect(Collectors.toSet());
    }

    public Set<TimeSlot> getAvailableSlots() {
        return Collections.unmodifiableSet(availableSlots);
    }

    public void addTimeSlot(TimeSlot timeSlot) {
        this.availableSlots.add(timeSlot);
    }


}
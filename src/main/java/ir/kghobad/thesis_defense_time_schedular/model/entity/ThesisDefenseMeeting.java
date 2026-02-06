package ir.kghobad.thesis_defense_time_schedular.model.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.entity.association.DefenseMeetingProfessorAssociation;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.User;
import ir.kghobad.thesis_defense_time_schedular.model.enums.MeetingState;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Table(name = "thesis_defense_meeting")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@ToString(of = {"id"})
@EqualsAndHashCode(of = {"id"})
@AllArgsConstructor
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
    @Column(nullable = false)
    private final Set<DefenseMeetingProfessorAssociation> defenseMeetingProfessorAssociations = new HashSet<>(8);

    @OneToOne(cascade = CascadeType.ALL)
    @Getter
    @Setter
    private TimeSlot selectedTimeSlot;
    
    @OneToMany(mappedBy = "defenseMeeting", cascade = CascadeType.ALL)
    @Column(nullable = false)
    private final Set<TimeSlot> availableSlots =  new HashSet<>(64);

    @Getter
    @Setter
    @Column(name = "score")
    private Double score;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MeetingState state = MeetingState.JURIES_SELECTED;


    @Setter
    private String location;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "submission_date")
    @Setter
    @Getter
    private LocalDateTime submissionDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "update_date")
    @Setter
    @Getter
    private LocalDateTime updateDate;

    public ThesisDefenseMeeting() {
        this.submissionDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
    }


    public boolean containsTimeSlot(TimeSlot timeSlot) {
        return this.availableSlots.contains(timeSlot);
    }

    public void removeTimeSlot(TimeSlot timeSlot) {
        availableSlots.remove(timeSlot);
    }

    public void addJury(Professor professor) {
        boolean alreadyExists = this.defenseMeetingProfessorAssociations.stream()
                .anyMatch(a -> a.getProfessor().getId().equals(professor.getId()));

        if (alreadyExists) {
            return;
        }

        DefenseMeetingProfessorAssociation association = new DefenseMeetingProfessorAssociation();
        association.setDefenseMeeting(this);
        association.setProfessor(professor);

        this.defenseMeetingProfessorAssociations.add(association);

        if (!professor.containsAssociation(association)) {
            professor.addMeetingProfessorAssociation(association);
        }
    }

    private DefenseMeetingProfessorAssociation findOrCreateAssociation(Professor professor) {
        return this.defenseMeetingProfessorAssociations.stream()
                .filter(a -> a.getProfessor().equals(professor))
                .findFirst()
                .orElseGet(() -> {
                    DefenseMeetingProfessorAssociation newAssoc = new DefenseMeetingProfessorAssociation();
                    newAssoc.setDefenseMeeting(this);
                    newAssoc.setProfessor(professor);
                    return newAssoc;
                });
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

    public List<SimpleUserOutputDto> getSuggestedJuries() {
        return defenseMeetingProfessorAssociations.stream()
                .map(DefenseMeetingProfessorAssociation::getProfessor)
                .map(SimpleUserOutputDto::from).toList();
    }

    public Map<Long, Double> getJuriesWithScores() {
        Map<Long, Double> juryScores = new HashMap<>();
        for (DefenseMeetingProfessorAssociation association : defenseMeetingProfessorAssociations) {
            juryScores.put(association.getProfessor().getId(), association.getScore());
        }
        return juryScores;
    }

    public Set<TimeSlot> getAvailableSlots() {
        return Collections.unmodifiableSet(availableSlots);
    }

    public void addTimeSlot(TimeSlot timeSlot) {
        this.availableSlots.add(timeSlot);
    }

    public String getLocation() {
        if (List.of(MeetingState.SCHEDULED, MeetingState.COMPLETED).contains(state) && location == null) {
            throw new RuntimeException("location can't be null for scheduled or completed meetings");
        }
        return location;
    }

    public boolean allProfessorsScored() {
        for (DefenseMeetingProfessorAssociation association : defenseMeetingProfessorAssociations) {
            if (association.getScore() == null) {
                return false;
            }
        }
        return true;
    }

    public double calculateAverageScore() {
        double totalScore = 0.0;
        int count = 0;
        for (DefenseMeetingProfessorAssociation association : defenseMeetingProfessorAssociations) {
            if (association.getScore() != null) {
                totalScore += association.getScore();
                count++;
            }
        }
        return count == 0 ? 0.0 : totalScore / count;
    }

    public void updateProfessorScore(Professor professor, Double score) {
        for (DefenseMeetingProfessorAssociation association : defenseMeetingProfessorAssociations) {
            if (association.getProfessor().equals(professor)) {
                association.setScore(score);
                return;
            }
        }
        throw new NoSuchElementException("Professor not found in this meeting's juries");
    }
}


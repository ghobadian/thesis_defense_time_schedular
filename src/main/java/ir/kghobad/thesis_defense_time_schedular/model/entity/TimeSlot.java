package ir.kghobad.thesis_defense_time_schedular.model.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import ir.kghobad.thesis_defense_time_schedular.model.entity.association.TimeSlotProfessorAssociation;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.enums.TimePeriod;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "time_slot", uniqueConstraints = {
        @UniqueConstraint(
                name = "uk_timeslot_date_period_meeting",
                columnNames = {"date", "time_period", "defense_meeting_id"}
        )
}, indexes = {
        @Index(
                name = "idx_timeslot_date_period_meeting",
                columnList = "defense_meeting_id, date, time_period")}
        )
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@ToString(of = {"date", "timePeriod", "defenseMeeting"})
public class TimeSlot implements Comparable<TimeSlot> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Setter
    private Long id;
    
    @Column(name = "date", nullable = false)
    @Getter
    @Setter
    private LocalDate date;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "time_period", nullable = false)
    @Getter
    @Setter
    private TimePeriod timePeriod;

    @OneToMany(mappedBy = "timeSlot", cascade = CascadeType.ALL, orphanRemoval = true)
    private final Set<TimeSlotProfessorAssociation> timeSlotProfessorAssociations = new HashSet<>(64);
    
    @ManyToOne
    @JoinColumn(name = "defense_meeting_id")
    @Getter
    @Setter
    private ThesisDefenseMeeting defenseMeeting;

    public TimeSlot(Long id,
                    LocalDate date,
                    TimePeriod timePeriod,
                    ThesisDefenseMeeting defenseMeeting) {
        this.id = id;
        this.date = date;
        this.timePeriod = timePeriod;
        this.defenseMeeting = defenseMeeting;
    }

    public TimeSlot() {

    }

    public void addAvailableProfessor(Professor professor) {
        TimeSlotProfessorAssociation association = new TimeSlotProfessorAssociation();
        association.setProfessor(professor);
        association.setTimeSlot(this);
        if (!this.timeSlotProfessorAssociations.contains(association)) {
            this.timeSlotProfessorAssociations.add(association);
            professor.addTimeSlotAssociation(association);
        }
    }




    public void removeAvailableProfessor(Professor professor) {
        TimeSlotProfessorAssociation association = new TimeSlotProfessorAssociation();
        association.setProfessor(professor);
        association.setTimeSlot(this);
        if (this.timeSlotProfessorAssociations.contains(association)) {
            this.timeSlotProfessorAssociations.remove(association);
            professor.removeAvailableSlot(this);
        }
    }

    public Set<Long> getProfessorsIds() {
        return this.timeSlotProfessorAssociations.stream()
                .map(association -> association.getProfessor().getId())
                .collect(Collectors.toSet());
    }

    public boolean isProfessorAvailable(Long id) {
        return this.timeSlotProfessorAssociations.stream()
                .anyMatch(association -> association.getProfessor().getId().equals(id));
    }

    @Override
    public int compareTo(TimeSlot other) {
        int dateComparison = this.date.compareTo(other.date);

        if (dateComparison != 0) {
            return dateComparison;
        }

        return this.timePeriod.compareTo(other.timePeriod);
    }

    public boolean hasProfessor(Professor professor) {
        return this.timeSlotProfessorAssociations.stream()
                .anyMatch(association -> association.getProfessor().equals(professor));
    }

    @Override
    public boolean equals(Object object) {
        if (!(object instanceof TimeSlot timeSlot)) return false;
        return Objects.equals(date, timeSlot.date) &&
                timePeriod == timeSlot.timePeriod &&
                defenseMeeting.getId().longValue() == timeSlot.defenseMeeting.getId().longValue();
    }

    @Override
    public int hashCode() {
        return Objects.hash(date, timePeriod, defenseMeeting.getId());
    }


}
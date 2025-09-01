package ir.kghobad.thesis_defense_time_schedular.model.entity;

import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.enums.TimePeriod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "time_slot")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Temporal(TemporalType.DATE)
    private Date date;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "time_period")
    private TimePeriod timePeriod;
    
    @ManyToMany
    @JoinTable(
        name = "time_slot_available_professors",
        joinColumns = @JoinColumn(name = "time_slot_id"),
        inverseJoinColumns = @JoinColumn(name = "professor_id")
    )
    private List<Professor> availableProfessors;
    
    @ManyToOne
    @JoinColumn(name = "defense_meeting_id")
    private ThesisDefenseMeeting defenseMeeting;
}
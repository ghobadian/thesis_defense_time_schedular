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
@Table(name = "thesis_defense_meeting")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThesisDefenseMeeting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "thesis_form_id", nullable = false)
    private ThesisForm thesisForm;
    
    @ManyToMany
    @JoinTable(
        name = "defense_meeting_juries",
        joinColumns = @JoinColumn(name = "meeting_id"),
        inverseJoinColumns = @JoinColumn(name = "professor_id")
    )
    private List<Professor> juries;
    
    @Temporal(TemporalType.DATE)
    @Column(name = "selected_date")
    private Date selectedDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "selected_time")
    private TimePeriod selectedTime;
    
    @OneToMany(mappedBy = "defenseMeeting", cascade = CascadeType.ALL)
    private List<TimeSlot> availableSlots;
}
package ir.kghobad.thesis_defense_time_schedular.model.entity;

import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.enums.TimePeriod;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "time_slot")
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

    public TimeSlot(Long id, Date date, TimePeriod timePeriod, List<Professor> availableProfessors, ThesisDefenseMeeting defenseMeeting) {
        this.id = id;
        this.date = date;
        this.timePeriod = timePeriod;
        this.availableProfessors = availableProfessors;
        this.defenseMeeting = defenseMeeting;
    }

    public TimeSlot() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public TimePeriod getTimePeriod() {
        return timePeriod;
    }

    public void setTimePeriod(TimePeriod timePeriod) {
        this.timePeriod = timePeriod;
    }

    public List<Professor> getAvailableProfessors() {
        return availableProfessors;
    }

    public void setAvailableProfessors(List<Professor> availableProfessors) {
        this.availableProfessors = availableProfessors;
    }

    public ThesisDefenseMeeting getDefenseMeeting() {
        return defenseMeeting;
    }

    public void setDefenseMeeting(ThesisDefenseMeeting defenseMeeting) {
        this.defenseMeeting = defenseMeeting;
    }
}
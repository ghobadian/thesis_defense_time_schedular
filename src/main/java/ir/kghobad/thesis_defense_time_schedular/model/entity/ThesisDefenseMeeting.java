package ir.kghobad.thesis_defense_time_schedular.model.entity;

import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.enums.TimePeriod;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "thesis_defense_meeting")
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

    public ThesisDefenseMeeting(Long id, ThesisForm thesisForm, List<Professor> juries, Date selectedDate, TimePeriod selectedTime, List<TimeSlot> availableSlots) {
        this.id = id;
        this.thesisForm = thesisForm;
        this.juries = juries;
        this.selectedDate = selectedDate;
        this.selectedTime = selectedTime;
        this.availableSlots = availableSlots;
    }

    public ThesisDefenseMeeting() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ThesisForm getThesisForm() {
        return thesisForm;
    }

    public void setThesisForm(ThesisForm thesisForm) {
        this.thesisForm = thesisForm;
    }

    public List<Professor> getJuries() {
        return juries;
    }

    public void setJuries(List<Professor> juries) {
        this.juries = juries;
    }

    public Date getSelectedDate() {
        return selectedDate;
    }

    public void setSelectedDate(Date selectedDate) {
        this.selectedDate = selectedDate;
    }

    public TimePeriod getSelectedTime() {
        return selectedTime;
    }

    public void setSelectedTime(TimePeriod selectedTime) {
        this.selectedTime = selectedTime;
    }

    public List<TimeSlot> getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(List<TimeSlot> availableSlots) {
        this.availableSlots = availableSlots;
    }
}
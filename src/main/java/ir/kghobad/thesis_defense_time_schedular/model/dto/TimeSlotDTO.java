package ir.kghobad.thesis_defense_time_schedular.model.dto;

import ir.kghobad.thesis_defense_time_schedular.model.enums.TimePeriod;
import java.util.Date;

public class TimeSlotDTO {
    private Date date;
    private TimePeriod timePeriod;
    private Long professorId;
    private Long meetingId;

    public TimeSlotDTO(Date date, TimePeriod timePeriod, Long professorId, Long meetingId) {
        this.date = date;
        this.timePeriod = timePeriod;
        this.professorId = professorId;
        this.meetingId = meetingId;
    }

    public TimeSlotDTO() {
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

    public Long getProfessorId() {
        return professorId;
    }

    public void setProfessorId(Long professorId) {
        this.professorId = professorId;
    }

    public Long getMeetingId() {
        return meetingId;
    }

    public void setMeetingId(Long meetingId) {
        this.meetingId = meetingId;
    }
}
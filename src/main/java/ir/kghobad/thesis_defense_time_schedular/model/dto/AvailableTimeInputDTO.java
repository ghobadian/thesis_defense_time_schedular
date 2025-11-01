package ir.kghobad.thesis_defense_time_schedular.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class AvailableTimeInputDTO {

    private Set<TimeSlotDTO> timeSlots;
    private Long meetingId;

    public AvailableTimeInputDTO(Set<TimeSlotDTO> timeSlots, Long meetingId) {
        this.timeSlots = timeSlots;
        this.meetingId = meetingId;
    }

    public AvailableTimeInputDTO() {
    }

}
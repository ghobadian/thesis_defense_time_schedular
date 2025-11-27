package ir.kghobad.thesis_defense_time_schedular.model.dto.meeting;

import ir.kghobad.thesis_defense_time_schedular.model.dto.JuryMemberAvailability;
import ir.kghobad.thesis_defense_time_schedular.model.dto.TimeSlotDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class MeetingTimeSlotsOutputDto {
    private Long meetingId;
    private List<JuryMemberAvailability> juryMemberTimeSlots;
    private List<TimeSlotDTO> intersections;
}

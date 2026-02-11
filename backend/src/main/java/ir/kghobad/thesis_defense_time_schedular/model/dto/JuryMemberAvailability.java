package ir.kghobad.thesis_defense_time_schedular.model.dto;

import ir.kghobad.thesis_defense_time_schedular.model.dto.user.SimpleUserOutputDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
public class JuryMemberAvailability {
    private SimpleUserOutputDto user;
    private List<TimeSlotDTO> timeslots;

}

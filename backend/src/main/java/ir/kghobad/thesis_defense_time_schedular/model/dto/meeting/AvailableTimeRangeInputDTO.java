package ir.kghobad.thesis_defense_time_schedular.model.dto.meeting;

import ir.kghobad.thesis_defense_time_schedular.model.dto.TimeRangeDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AvailableTimeRangeInputDTO {

    private Set<TimeRangeDTO> timeRanges;
    private Long meetingId;

}
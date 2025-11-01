package ir.kghobad.thesis_defense_time_schedular.model.dto;

import ir.kghobad.thesis_defense_time_schedular.model.enums.TimePeriod;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class TimeSlotSelectionInputDTO {
    private LocalDate date;
    private TimePeriod timePeriod;
    private Long meetingId;

    public TimeSlotSelectionInputDTO() {
    }
}

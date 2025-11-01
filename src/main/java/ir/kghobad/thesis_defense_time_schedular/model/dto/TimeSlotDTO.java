package ir.kghobad.thesis_defense_time_schedular.model.dto;

import ir.kghobad.thesis_defense_time_schedular.model.entity.TimeSlot;
import ir.kghobad.thesis_defense_time_schedular.model.enums.TimePeriod;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@EqualsAndHashCode
public class TimeSlotDTO {
    private LocalDate date;
    private TimePeriod timePeriod;

    public static TimeSlotDTO from(TimeSlot ts) {
        return new TimeSlotDTO(
                ts.getDate(),
                ts.getTimePeriod()
        );
    }
}

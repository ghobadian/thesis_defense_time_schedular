package ir.kghobad.thesis_defense_time_schedular.model.dto;

import ir.kghobad.thesis_defense_time_schedular.model.entity.TimeSlot;
import ir.kghobad.thesis_defense_time_schedular.model.enums.TimePeriod;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class TimeSlotDTO {
    private Long id;
    private LocalDate date;
    private TimePeriod timePeriod;

    public static TimeSlotDTO from(TimeSlot ts) {
        return new TimeSlotDTO(
                ts.getId(),
                ts.getDate(),
                ts.getTimePeriod()
        );
    }
}

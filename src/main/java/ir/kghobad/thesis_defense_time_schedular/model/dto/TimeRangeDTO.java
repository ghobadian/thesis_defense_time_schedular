package ir.kghobad.thesis_defense_time_schedular.model.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@ToString
public class TimeRangeDTO {
    private LocalDateTime from;
    private LocalDateTime to;
}

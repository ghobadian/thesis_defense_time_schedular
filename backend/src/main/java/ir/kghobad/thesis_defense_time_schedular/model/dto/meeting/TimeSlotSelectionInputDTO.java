package ir.kghobad.thesis_defense_time_schedular.model.dto.meeting;

import jakarta.validation.constraints.NotNull;
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
    @NotNull
    private Long timeSlotId;
    @NotNull
    private Long meetingId;
}

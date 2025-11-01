package ir.kghobad.thesis_defense_time_schedular.model.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MeetingCompletionInputDTO {
    private Long meetingId;
    @Min(0) @Max(20)
    private Double score;

    public MeetingCompletionInputDTO(Long meetingId, Double score) {
        this.meetingId = meetingId;
        this.score = score;
    }
}

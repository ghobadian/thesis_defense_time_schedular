package ir.kghobad.thesis_defense_time_schedular.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MeetingScheduleInputDTO {
    private Long meetingId;
    private String location;
}

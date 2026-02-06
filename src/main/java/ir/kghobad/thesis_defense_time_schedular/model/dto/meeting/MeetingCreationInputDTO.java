package ir.kghobad.thesis_defense_time_schedular.model.dto.meeting;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class MeetingCreationInputDTO {
    private Long formId;
    private Set<Long> juryIds;
}

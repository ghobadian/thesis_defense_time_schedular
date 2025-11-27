package ir.kghobad.thesis_defense_time_schedular.model.dto.meeting;

import ir.kghobad.thesis_defense_time_schedular.model.dto.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.TimeSlotDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ThesisDefenseMeetingOutputDTO {
    private Long id;
    private ThesisFormOutputDTO thesis;
    private String state;
    private Double score;
    private TimeSlotDTO selectedTimeSlot;
    private List<SimpleUserOutputDto> juryMembers;
    private String location;
    private String createdAt;


    public static ThesisDefenseMeetingOutputDTO from(ThesisDefenseMeeting meeting) {
        ThesisDefenseMeetingOutputDTO dto = new ThesisDefenseMeetingOutputDTO();
        dto.setId(meeting.getId());
        dto.setState(meeting.getState().name());
        dto.setScore(meeting.getScore());
        if (meeting.getSelectedTimeSlot() != null) {
            dto.setSelectedTimeSlot(TimeSlotDTO.from(meeting.getSelectedTimeSlot()));
        }
        dto.setThesis(ThesisFormOutputDTO.from(meeting.getThesisForm()));
        dto.setJuryMembers(meeting.getSuggestedJuries());
        dto.setLocation(meeting.getLocation());
        dto.setCreatedAt(meeting.getSubmissionDate().toString());
        return dto;
    }

}

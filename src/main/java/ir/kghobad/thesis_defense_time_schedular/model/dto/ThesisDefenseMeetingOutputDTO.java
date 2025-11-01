package ir.kghobad.thesis_defense_time_schedular.model.dto;

import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ThesisDefenseMeetingOutputDTO {
    private Long id;
    private Long thesisFormId;
    private String thesisTitle;
    private String studentName;
    private String instructorName;
    private String state;
    private Double score;
    private TimeSlotDTO selectedTimeSlot;


    public static ThesisDefenseMeetingOutputDTO from(ThesisDefenseMeeting meeting) {
        ThesisDefenseMeetingOutputDTO dto = new ThesisDefenseMeetingOutputDTO();
        dto.setId(meeting.getId());
        dto.setThesisFormId(meeting.getThesisForm().getId());
        dto.setThesisTitle(meeting.getThesisForm().getTitle());
        dto.setStudentName(meeting.getThesisForm().getStudent().getFullName());
        dto.setInstructorName(meeting.getThesisForm().getInstructor().getFullName());
        dto.setState(meeting.getState().name());
        dto.setScore(meeting.getScore());
        if (meeting.getSelectedTimeSlot() != null) {
            dto.setSelectedTimeSlot(TimeSlotDTO.from(meeting.getSelectedTimeSlot()));
        }
        return dto;
    }

}

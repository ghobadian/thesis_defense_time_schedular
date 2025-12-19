package ir.kghobad.thesis_defense_time_schedular.model.dto.meeting;

import ir.kghobad.thesis_defense_time_schedular.model.dto.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.TimeSlotDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ThesisDefenseMeetingDetailsOutputDTO {
    private Long meetingId;
    private String title;
    private String description;
    private String studentName;
    private String studentEmail;
    private String instructorName;
    private String instructorEmail;
    private String departmentName;
    private String fieldName;
    private String meetingStatus;
    private String selectedTimeSlot;
    private List<TimeSlotDTO> availableTimeSlots;
    private Map<Long, Double> juriesScores;
    private List<SimpleUserOutputDto> juryMembers;

    public static ThesisDefenseMeetingDetailsOutputDTO from(ThesisDefenseMeeting meeting) {
        ThesisDefenseMeetingDetailsOutputDTO dto = new ThesisDefenseMeetingDetailsOutputDTO();
        dto.setMeetingId(meeting.getId());
        dto.setTitle(meeting.getThesisForm().getTitle());
        dto.setDescription(meeting.getThesisForm().getAbstractText());
        dto.setStudentName(meeting.getThesisForm().getStudent().getFullName());
        dto.setStudentEmail(meeting.getThesisForm().getStudent().getEmail());
        dto.setInstructorName(meeting.getThesisForm().getInstructor().getFullName());
        dto.setInstructorEmail(meeting.getThesisForm().getInstructor().getEmail());
        dto.setDepartmentName(meeting.getThesisForm().getField().getDepartment().getName());
        dto.setFieldName(meeting.getThesisForm().getField().getName());
        dto.setMeetingStatus(meeting.getState().name());
        dto.setSelectedTimeSlot(meeting.getSelectedTimeSlot() != null ? meeting.getSelectedTimeSlot().toString() : null);
        dto.setJuryMembers(meeting.getSuggestedJuries());
        dto.setJuriesScores(meeting.getJuriesWithScores());
        return dto;
    }
}

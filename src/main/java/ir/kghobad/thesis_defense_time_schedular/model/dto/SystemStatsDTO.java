package ir.kghobad.thesis_defense_time_schedular.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SystemStatsDTO {
    private Long totalStudents;
    private Long totalProfessors;
    private Long activeProfessors;
    private Long totalThesisForms;
    private Long pendingForms;
    private Long instructorApprovedForms;
    private Long adminApprovedForms;
    private Long managerApprovedForms;
    private Long instructorRejectedForms;
    private Long adminRejectedForms;
    private Long managerRejectedForms;
    private Long totalMeetings;
    private Long upcomingMeetings;
    private Long completedMeetings;
    private Long activeSessions;
    private Long departmentCount;
    private Long fieldCount;
}

package ir.kghobad.thesis_defense_time_schedular.controller.admin;

import ir.kghobad.thesis_defense_time_schedular.model.dto.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.SystemStatsDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingDetailsOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.service.admin.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService service;



    @GetMapping("/stats")
    public ResponseEntity<SystemStatsDTO> getSystemStats() {
        return ResponseEntity.ok(service.getSystemStats());
    }

    @GetMapping("/professors")
    public ResponseEntity<List<SimpleUserOutputDto>> getProfessors() {
        return ResponseEntity.ok(service.getProfessors());
    }

    @GetMapping("/meetings")
    public ResponseEntity<List<ThesisDefenseMeetingOutputDTO>> getMeetings() {
        return ResponseEntity.ok(service.getMeetings());
    }

    @GetMapping("/meetings/{meetingId}")
    public ResponseEntity<ThesisDefenseMeetingDetailsOutputDTO> getMeeting(@PathVariable Long meetingId) {
        return ResponseEntity.ok(service.getMeeting(meetingId));
    }


}

package ir.kghobad.thesis_defense_time_schedular.controller.student;

import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.ThesisDefenseMeetingDetailsOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.TimeSlotSelectionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.service.student.StudentMeetingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/student/meetings")
@RequiredArgsConstructor
public class StudentsMeetingController {
    private final StudentMeetingService service;
    @GetMapping
    public ResponseEntity<?> listMeetings() {//todo add test to StudentControllerIntegrationTest
        return ResponseEntity.ok(service.listMeetings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThesisDefenseMeetingDetailsOutputDTO> getMeetingDetails(@PathVariable Long id) {
        return ResponseEntity.ok(service.getMeetingDetails(id));
    }

    @PostMapping("/time-slots")
    public ResponseEntity<?> chooseTimeSlot(@RequestBody TimeSlotSelectionInputDTO input) {
        service.chooseTimeSlot(input);
        return ResponseEntity.ok("Time slot chosen successfully");
    }
}

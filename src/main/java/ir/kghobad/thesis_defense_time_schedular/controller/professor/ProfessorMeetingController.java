package ir.kghobad.thesis_defense_time_schedular.controller.professor;

import ir.kghobad.thesis_defense_time_schedular.model.dto.*;
import ir.kghobad.thesis_defense_time_schedular.model.dto.meeting.*;
import ir.kghobad.thesis_defense_time_schedular.service.professor.ProfessorMeetingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professor/meetings")
@RequiredArgsConstructor
public class ProfessorMeetingController {
    private final ProfessorMeetingService service;

    @GetMapping
    public ResponseEntity<List<ThesisDefenseMeetingOutputDTO>> getMeetings() {
        return ResponseEntity.ok(service.getMeetings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThesisDefenseMeetingOutputDTO> getMeeting(@PathVariable Long id) {
        return ResponseEntity.ok(service.getMeeting(id));
    }

    @PostMapping("/give-time")
    public ResponseEntity<?> specifyAvailableTime(@RequestBody AvailableTimeInputDTO availableTimeInputDTo) {
        service.specifyAvailableTime(availableTimeInputDTo);
        return ResponseEntity.ok("Time slot added");
    }

    @PostMapping("/create")
    public ResponseEntity<?> createMeeting(@RequestBody MeetingCreationInputDTO input) {
        service.acceptAndSchedule(input);
        return ResponseEntity.ok("Meeting created");
    }

    @PostMapping("/schedule")
    public ResponseEntity<?> scheduleMeeting(@RequestBody MeetingScheduleInputDTO input) {
        service.scheduleMeeting(input);
        return ResponseEntity.ok("Meeting scheduled");
    }

    @PostMapping("/score")
    public ResponseEntity<?> addScore(@RequestBody MeetingCompletionInputDTO input) {
        service.completeMeeting(input);
        return ResponseEntity.ok("Score submitted");
    }

    @GetMapping("/{meetingId}/timeslots")
    public ResponseEntity<MeetingTimeSlotsOutputDto> getMeetingTimeSlots(@PathVariable Long meetingId){
        return ResponseEntity.ok(service.getMeetingTimeSlots(meetingId));
    }

    @GetMapping("/{meetingId}/my-timeslots")
    public ResponseEntity<List<TimeSlotDTO>> getMyMeetingTimeSlots(@PathVariable Long meetingId){
        return ResponseEntity.ok(service.getMyMeetingTimeSlots(meetingId));
    }

    @PostMapping("/{meetingId}/cancel")
    public ResponseEntity<?> cancelMeeting(@PathVariable Long meetingId) {
        service.cancelMeeting(meetingId);
        return ResponseEntity.ok("Meeting canceled");
    }


}

package ir.kghobad.thesis_defense_time_schedular.controller;

import ir.kghobad.thesis_defense_time_schedular.model.dto.*;
import ir.kghobad.thesis_defense_time_schedular.service.ProfessorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professor")
public class ProfessorController {
    private final ProfessorService service;

    public ProfessorController(ProfessorService service) {
        this.service = service;
    }

    @GetMapping("/forms")
    public ResponseEntity<List<ThesisFormOutputDTO>> getThesisForms() {
        return ResponseEntity.ok(service.getThesisForms());
    }

    @PostMapping("/approve-form/{formId}")
    public ResponseEntity<?> acceptForm(@PathVariable Long formId) {
        service.acceptForm(formId);
        return ResponseEntity.ok("Form accepted");
    }


    @PostMapping("/reject-form/{formId}")
    public ResponseEntity<?> rejectForm(@PathVariable Long formId) {
        service.rejectForm(formId);
        return ResponseEntity.ok("Form rejected");
    }

    @GetMapping("/meetings")
    public ResponseEntity<List<ThesisDefenseMeetingOutputDTO>> getMeetings() {
        return ResponseEntity.ok(service.getMeetings());
    }

    @GetMapping("/meetings/{id}")
    public ResponseEntity<ThesisDefenseMeetingOutputDTO> getMeeting(@PathVariable Long id) {
        return ResponseEntity.ok(service.getMeeting(id));
    }


    @PostMapping("/suggest-juries")
    public ResponseEntity<?> suggestJuries(@RequestBody FormSuggestionInputDTO input) {
        service.suggestJuries(input);
        return ResponseEntity.ok("Juries suggested");
    }

    @PostMapping("/give-time")
    public ResponseEntity<?> specifyAvailableTime(@RequestBody AvailableTimeInputDTO availableTimeInputDTo) {
        service.specifyAvailableTime(availableTimeInputDTo);
        return ResponseEntity.ok("Time slot added");
    }

    @GetMapping("/timeslots")
    public ResponseEntity<List<TimeSlotDTO>> getTimeslots() {
        return ResponseEntity.ok(service.getTimeslots());
    }

    @PostMapping("/schedule-meeting/")
    public ResponseEntity<?> scheduleMeeting(@RequestBody MeetingScheduleInputDTO input) {
        service.scheduleMeeting(input);
        return ResponseEntity.ok("Meeting scheduled");
    }

    @PostMapping("/cancel-meeting/{meetingId}")
    public ResponseEntity<?> cancelMeeting(@PathVariable Long meetingId) {
        service.cancelMeeting(meetingId);
        return ResponseEntity.ok("Meeting canceled");
    }

    @PostMapping("/complete-meeting")
    public ResponseEntity<?> completeMeeting(@RequestBody MeetingCompletionInputDTO input) {
        service.completeMeeting(input);
        return ResponseEntity.ok("Meeting completed");
    }


    @GetMapping("/students")
    public ResponseEntity<?> students() {
        return ResponseEntity.ok(service.getStudents());
    }

    @GetMapping("/meetings/{meetingId}/timeslots")
    public ResponseEntity<MeetingTimeSlotsOutputDto> getMeetingTimeSlots(@PathVariable Long meetingId){
        return ResponseEntity.ok(service.getMeetingTimeSlots(meetingId));
    }

    @GetMapping("/meetings/{meetingId}/my-timeslots")
    public ResponseEntity<List<TimeSlotDTO>> getMyMeetingTimeSlots(@PathVariable Long meetingId){
        return ResponseEntity.ok(service.getMyMeetingTimeSlots(meetingId));
    }

}

package ir.kghobad.thesis_defense_time_schedular.controller;

import ir.kghobad.thesis_defense_time_schedular.model.dto.AvailableTimeInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.FormSuggestionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.MeetingCompletionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.security.JwtUtil;
import ir.kghobad.thesis_defense_time_schedular.service.ProfessorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professor")
public class ProfessorController {
    private final ProfessorService service;
    private final JwtUtil jwtUtil;

    public ProfessorController(ProfessorService service,
                               JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/forms")
    public ResponseEntity<List<ThesisFormOutputDTO>> getThesisForms() {
        return ResponseEntity.ok(service.getThesisForms());
    }

    @PostMapping("/accept-form/{formId}")
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
    public ResponseEntity<?> getMeetings() {
        return ResponseEntity.ok(service.getMeetings());
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

    @PostMapping("/schedule-meeting/{meetingId}")
    public ResponseEntity<?> scheduleMeeting(@PathVariable Long meetingId) {
        service.scheduleMeeting(meetingId);
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

}

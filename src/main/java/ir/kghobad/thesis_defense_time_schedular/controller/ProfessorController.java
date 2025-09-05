package ir.kghobad.thesis_defense_time_schedular.controller;

import ir.kghobad.thesis_defense_time_schedular.model.dto.AuthResponseDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.LoginDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.TimeSlotDTO;
import ir.kghobad.thesis_defense_time_schedular.service.ProfessorService;
import ir.kghobad.thesis_defense_time_schedular.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professor")
public class ProfessorController {
    private final ProfessorService professorService;
    private final UserService userService;
    
    public ProfessorController(ProfessorService professorService, UserService userService) {
        this.professorService = professorService;
        this.userService = userService;
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        return ResponseEntity.ok(userService.login(loginDTO));
    }
    
    @PostMapping("/{id}/accept-form/{formId}")
    public ResponseEntity<?> acceptForm(@PathVariable Long id, @PathVariable Long formId) {
        professorService.acceptForm(id, formId);
        return ResponseEntity.ok("Form accepted");
    }
    
    @PostMapping("/{id}/reject-form/{formId}")
    public ResponseEntity<?> rejectForm(@PathVariable Long id, @PathVariable Long formId) {
        professorService.rejectForm(id, formId);
        return ResponseEntity.ok("Form rejected");
    }
    
    @PostMapping("/suggest-juries/{formId}")
    public ResponseEntity<?> suggestJuries(
        @PathVariable Long formId,
        @RequestBody List<Long> juryIds
    ) {
        professorService.suggestJuries(formId, juryIds);
        return ResponseEntity.ok("Juries suggested");
    }
    
    @PostMapping("/give-time")
    public ResponseEntity<?> specifyAvailableTime(
        @RequestParam Long professorId,
        @RequestBody TimeSlotDTO timeSlotDTO
    ) {
        professorService.specifyAvailableTime(professorId, timeSlotDTO);
        return ResponseEntity.ok("Time slot added");
    }
}

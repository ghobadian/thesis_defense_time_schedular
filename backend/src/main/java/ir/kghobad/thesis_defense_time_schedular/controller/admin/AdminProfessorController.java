package ir.kghobad.thesis_defense_time_schedular.controller.admin;

import ir.kghobad.thesis_defense_time_schedular.model.dto.user.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.professor.ProfessorOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.professor.ProfessorRegistrationInputDTO;
import ir.kghobad.thesis_defense_time_schedular.service.admin.AdminProfessorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/professors")
@RequiredArgsConstructor
public class AdminProfessorController {
    private final AdminProfessorService service;

    @PostMapping
    public ResponseEntity<?> register(@Valid @RequestBody List<ProfessorRegistrationInputDTO> dtos) {
        service.registerProfessors(dtos);
        return ResponseEntity.ok("Students registered successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<List<SimpleUserOutputDto>> getProfessors() {
        return ResponseEntity.ok(service.getProfessors());
    }

    @GetMapping
    public ResponseEntity<List<ProfessorOutputDTO>> getProfessors(@RequestParam(required = false) String search,
                                                                  @RequestParam(required = false) Long departmentId,
                                                                  @RequestParam(required = false) Integer page,
                                                                  @RequestParam(required = false) Integer limit) {
        return ResponseEntity.ok(service.getProfessors(search, departmentId, page, limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfessorOutputDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.get(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Professor deleted successfully");//TODO support multiple languages in responses to frontend
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable Long id, @RequestBody ProfessorRegistrationInputDTO input){
        service.update(id, input);
        return ResponseEntity.ok("Student updated successfully");
    }
}

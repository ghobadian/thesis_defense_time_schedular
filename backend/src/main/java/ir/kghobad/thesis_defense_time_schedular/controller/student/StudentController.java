package ir.kghobad.thesis_defense_time_schedular.controller.student;

import ir.kghobad.thesis_defense_time_schedular.model.dto.user.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.service.student.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService service;

    @GetMapping("/professors")
    public ResponseEntity<List<SimpleUserOutputDto>> listProfessors() {//todo add test to StudentControllerIntegrationTest
        return ResponseEntity.ok(service.listProfessors());
    }
}

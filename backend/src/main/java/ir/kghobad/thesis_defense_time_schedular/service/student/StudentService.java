package ir.kghobad.thesis_defense_time_schedular.service.student;

import ir.kghobad.thesis_defense_time_schedular.dao.ProfessorRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.StudentRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class StudentService {
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final JwtUtil jwtUtil;

    public List<SimpleUserOutputDto> listProfessors() {
        Long currentUserId = jwtUtil.getCurrentUserId();
        Student student = studentRepository.findById(currentUserId).orElseThrow();
        return professorRepository.findAllByDepartmentId(student.getDepartment().getId())
                .stream().map(SimpleUserOutputDto::from).toList();
    }
}

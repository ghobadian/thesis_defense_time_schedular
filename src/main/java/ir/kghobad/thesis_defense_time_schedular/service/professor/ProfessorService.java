package ir.kghobad.thesis_defense_time_schedular.service.professor;

import ir.kghobad.thesis_defense_time_schedular.dao.ProfessorRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.StudentRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.TimeSlotRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.PhoneUpdateDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.ProfessorOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.TimeSlotDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.student.PasswordChangeInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.student.StudentOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class ProfessorService {
    private final ProfessorRepository professorRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final JwtUtil jwtUtil;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public List<StudentOutputDTO> getMyStudents() {
        Long currentUserId = jwtUtil.getCurrentUserId();
        return studentRepository.findByInstructorId(currentUserId).stream().map(StudentOutputDTO::from).toList();
    }

    public List<TimeSlotDTO> getMyTimeslots() {
        Long currentUserId = jwtUtil.getCurrentUserId();
        return timeSlotRepository.findByJuryId(currentUserId).stream().map(TimeSlotDTO::from).toList();
    }

    public List<SimpleUserOutputDto> getProfessors() {
        return professorRepository.findAllColleagues(jwtUtil.getCurrentUserId()).stream()
                .map(SimpleUserOutputDto::from).toList();
    }

    public ProfessorOutputDTO getProfile() {
        Long currentUserId = jwtUtil.getCurrentUserId();
        return ProfessorOutputDTO.from(professorRepository.findById(currentUserId).orElseThrow());
    }

    public void updatePhone(PhoneUpdateDTO phone) {
        if (professorRepository.existsByPhoneNumber(phone.getPhoneNumber())) {
            throw new RuntimeException("Phone Number is already used by another user");
        }

        Professor professor = professorRepository.findById(jwtUtil.getCurrentUserId()).orElseThrow();
        professor.setPhoneNumber(phone.getPhoneNumber());
        professorRepository.save(professor);
    }

    public void changePassword(PasswordChangeInputDTO input) {
        Professor professor = professorRepository.findById(jwtUtil.getCurrentUserId()).orElseThrow();
        boolean matches = passwordEncoder.matches(input.getCurrentPassword(), professor.getPassword());
        if (!matches) {
            throw new RuntimeException("Wrong password");
        }
        professor.setPassword(passwordEncoder.encode(input.getNewPassword()));
    }
}

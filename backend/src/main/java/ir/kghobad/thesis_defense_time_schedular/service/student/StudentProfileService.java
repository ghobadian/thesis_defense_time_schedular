package ir.kghobad.thesis_defense_time_schedular.service.student;

import ir.kghobad.thesis_defense_time_schedular.dao.StudentRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.PhoneUpdateDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.student.PasswordChangeInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.student.StudentOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentProfileService {
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;
    private final JwtUtil jwtUtil;

    public void changePassword(PasswordChangeInputDTO input) {
        Student user = studentRepository.findById(jwtUtil.getCurrentUserId()).orElseThrow();
        boolean matches = passwordEncoder.matches(input.getCurrentPassword(), user.getPassword());
        if (!matches) {
            throw new RuntimeException("Wrong password");
        }
        user.setPassword(passwordEncoder.encode(input.getNewPassword()));
        studentRepository.save(user);
    }

    public StudentOutputDTO getProfile() {
        Student student = studentRepository.findById(jwtUtil.getCurrentUserId()).orElseThrow();
        return StudentOutputDTO.from(student);
    }

    public void updatePhone(PhoneUpdateDTO phone) {
        if (studentRepository.existsByPhoneNumber(phone.getPhoneNumber())) {
            throw new RuntimeException("Phone Number is already used by another user");
        }

        Student student = studentRepository.findById(jwtUtil.getCurrentUserId()).orElseThrow();
        student.setPhoneNumber(phone.getPhoneNumber());
        studentRepository.save(student);
    }
}

package ir.kghobad.thesis_defense_time_schedular.service;

import ir.kghobad.thesis_defense_time_schedular.dao.StudentRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.UserRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.LoginDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.AuthResponseDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.User;
import ir.kghobad.thesis_defense_time_schedular.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public UserService(UserRepository userRepository, StudentRepository studentRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    
    public AuthResponseDTO login(LoginDTO loginDTO) {
        User user = userRepository.findByEmail(loginDTO.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
            
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        String token = jwtUtil.generateToken(user);
        
        return new AuthResponseDTO(
            token,
            user.getEmail(),
            user.getRole(),
            user.getId()
        );
    }
}

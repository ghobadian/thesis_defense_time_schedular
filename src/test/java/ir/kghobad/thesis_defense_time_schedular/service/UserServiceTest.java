package ir.kghobad.thesis_defense_time_schedular.service;

import ir.kghobad.thesis_defense_time_schedular.dao.UserRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.AuthResponseDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.LoginDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    private Student testStudent;
    private LoginDTO loginDTO;

    @BeforeEach
    void setUp() {
        testStudent = new Student() {};
        testStudent.setId(1L);
        testStudent.setEmail("test@university.edu");
        testStudent.setPassword("encodedPassword");

        loginDTO = new LoginDTO("test@university.edu", "password123");
    }

    @Test
    void testLoginSuccess() {
        // Given
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testStudent));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtUtil.generateToken(any())).thenReturn("test-jwt-token");

        // When
        AuthResponseDTO response = userService.login(loginDTO);

        // Then
        assertNotNull(response);
        assertEquals("test-jwt-token", response.getToken());
        assertEquals("test@university.edu", response.getEmail());
        assertEquals("STUDENT", response.getRole());
        assertEquals(1L, response.getUserId());

        verify(userRepository).findByEmail("test@university.edu");
        verify(passwordEncoder).matches("password123", "encodedPassword");
        verify(jwtUtil).generateToken(testStudent);
    }

    @Test
    void testLoginWithInvalidEmail() {
        // Given
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> userService.login(loginDTO)
        );
        
        assertEquals("Invalid credentials", exception.getMessage());
        verify(userRepository).findByEmail("test@university.edu");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).generateToken(any());
    }

    @Test
    void testLoginWithInvalidPassword() {
        // Given
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testStudent));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // When & Then
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> userService.login(loginDTO)
        );
        
        assertEquals("Invalid credentials", exception.getMessage());
        verify(userRepository).findByEmail("test@university.edu");
        verify(passwordEncoder).matches("password123", "encodedPassword");
        verify(jwtUtil, never()).generateToken(any());
    }
}

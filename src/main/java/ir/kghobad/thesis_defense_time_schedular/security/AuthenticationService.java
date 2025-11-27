package ir.kghobad.thesis_defense_time_schedular.security;

import ir.kghobad.thesis_defense_time_schedular.dao.UserRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.auth.AuthResponseDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.auth.LoginDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.auth.RefreshTokenRequestDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthenticationService {
    
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    
    @Value("${jwt.expiration:86400000}")
    private Long jwtExpiration;

    public AuthenticationService(UserRepository userRepository, 
                               JwtUtil jwtUtil,
                               AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponseDTO login(LoginDTO loginDTO) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                loginDTO.getEmail(),
                loginDTO.getPassword()
        );

        Authentication authentication = authenticationManager.authenticate(token);
        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        User user = principal.getUser();
        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return new AuthResponseDTO(
                accessToken,
                refreshToken,
                "Bearer",
                jwtExpiration,
                user.getEmail(),
                user.getRole().getValue(),
                user.getId()
        );

    }

    public AuthResponseDTO refreshToken(RefreshTokenRequestDTO refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();
        
        if (!jwtUtil.validateToken(refreshToken) || !jwtUtil.isRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String username = jwtUtil.extractUsername(refreshToken);
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtUtil.generateToken(user);
        String newRefreshToken = jwtUtil.generateRefreshToken(user);

        return new AuthResponseDTO(
            newAccessToken,
            newRefreshToken,
            "Bearer",
            jwtExpiration,
            user.getEmail(),
            user.getRole().getValue(),
            user.getId()
        );
    }

}

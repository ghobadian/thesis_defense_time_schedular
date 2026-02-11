package ir.kghobad.thesis_defense_time_schedular.security;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomAuthenticationDetails {
    private Long userId;
    private String role;

    public CustomAuthenticationDetails(Long userId, String role) {
        this.userId = userId;
        this.role = role;
    }
}

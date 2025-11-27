package ir.kghobad.thesis_defense_time_schedular.model.dto.auth;

public class RefreshTokenRequestDTO {
    private String refreshToken;

    public RefreshTokenRequestDTO(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public RefreshTokenRequestDTO() {
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
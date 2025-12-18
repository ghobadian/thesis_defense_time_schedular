package ir.kghobad.thesis_defense_time_schedular.model.dto.student;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordChangeInputDTO {
    private String currentPassword;
    private String newPassword;
}

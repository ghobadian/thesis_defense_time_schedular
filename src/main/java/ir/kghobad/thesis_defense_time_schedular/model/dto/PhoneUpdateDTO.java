package ir.kghobad.thesis_defense_time_schedular.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PhoneUpdateDTO {
    
    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^(\\+98|0)?9\\d{9}$",
        message = "Invalid phone number format. Please enter a valid Iranian mobile number"
    )
    private String phoneNumber;
}

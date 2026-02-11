package ir.kghobad.thesis_defense_time_schedular.model.dto.field;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FieldInputDTO(
        @NotBlank(message = "Field name is required")
        String name,
        
        @NotNull(message = "Department ID is required")
        Long departmentId
) {}

package ir.kghobad.thesis_defense_time_schedular.model.dto.user;

import ir.kghobad.thesis_defense_time_schedular.model.entity.user.User;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SimpleUserOutputDto {
    private Long id;
    private String firstName;
    private String lastName;

    public static SimpleUserOutputDto from (User user) {
        SimpleUserOutputDto dto = new SimpleUserOutputDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        return dto;
    }
}

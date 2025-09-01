package ir.kghobad.thesis_defense_time_schedular.model.entity.user;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue("PHD")
@Data
@EqualsAndHashCode(callSuper = true)
public class PhDStudent extends Student {

}
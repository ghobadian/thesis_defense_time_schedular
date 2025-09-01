package ir.kghobad.thesis_defense_time_schedular.model.entity.user;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue("MASTER")
@Data
@EqualsAndHashCode(callSuper = true)
public class MasterStudent extends Student {

}
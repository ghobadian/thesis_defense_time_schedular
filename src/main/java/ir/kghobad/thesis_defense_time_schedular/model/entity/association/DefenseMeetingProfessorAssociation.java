package ir.kghobad.thesis_defense_time_schedular.model.entity.association;

import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "defensemeeting_professor_association")
@EqualsAndHashCode
@Getter
@Setter
public class DefenseMeetingProfessorAssociation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "defense_meeting_id", nullable = false)
    private ThesisDefenseMeeting defenseMeeting;
    
    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor;

}

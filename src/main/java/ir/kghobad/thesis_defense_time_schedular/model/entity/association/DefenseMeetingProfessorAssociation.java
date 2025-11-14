package ir.kghobad.thesis_defense_time_schedular.model.entity.association;

import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Entity
@Table(name = "defensemeeting_professor_association", uniqueConstraints = {
        @UniqueConstraint(name = "uk_defense_meeting_id_professor_id",
                columnNames = {"defense_meeting_id", "professor_id"})
})
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

    @Override
    public boolean equals(Object object) {
        if (!(object instanceof DefenseMeetingProfessorAssociation that)) return false;
        return Objects.equals(defenseMeeting, that.defenseMeeting) && Objects.equals(professor, that.professor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(defenseMeeting, professor);
    }
}

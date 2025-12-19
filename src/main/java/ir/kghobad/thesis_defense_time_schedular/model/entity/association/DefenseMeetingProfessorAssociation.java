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

    @Getter
    @Setter
    @Column(name = "score")
    private Double score;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DefenseMeetingProfessorAssociation that = (DefenseMeetingProfessorAssociation) o;

        // compare defenseMeeting: by reference, then by id if both present
        boolean defenseEqual;
        if (this.defenseMeeting == that.defenseMeeting) {
            defenseEqual = true;
        } else if (this.defenseMeeting != null && that.defenseMeeting != null) {
            defenseEqual = Objects.equals(this.defenseMeeting.getId(), that.defenseMeeting.getId());
        } else {
            defenseEqual = false;
        }

        // compare professor: by reference, then by id if both present
        boolean professorEqual;
        if (this.professor == that.professor) {
            professorEqual = true;
        } else if (this.professor != null && that.professor != null) {
            professorEqual = Objects.equals(this.professor.getId(), that.professor.getId());
        } else {
            professorEqual = false;
        }

        return defenseEqual && professorEqual;
    }

    @Override
    public int hashCode() {
        int defenseHash = 0;
        if (defenseMeeting != null) {
            defenseHash = defenseMeeting.getId() != null
                    ? defenseMeeting.getId().hashCode()
                    : System.identityHashCode(defenseMeeting);
        }

        int professorHash = 0;
        if (professor != null) {
            professorHash = professor.getId() != null
                    ? professor.getId().hashCode()
                    : System.identityHashCode(professor);
        }

        return Objects.hash(defenseHash, professorHash);
    }
}

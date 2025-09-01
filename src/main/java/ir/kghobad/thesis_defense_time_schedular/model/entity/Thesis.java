package ir.kghobad.thesis_defense_time_schedular.model.entity;

import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Student;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "thesis")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Thesis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String abstractText;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private Student author;

    @ManyToOne
    @JoinColumn(name = "supervisor_id", nullable = false)
    private Professor supervisor;
}
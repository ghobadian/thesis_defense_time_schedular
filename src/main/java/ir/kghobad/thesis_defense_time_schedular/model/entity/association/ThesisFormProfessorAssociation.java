//package ir.kghobad.thesis_defense_time_schedular.model.entity.association;
//
//import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
//import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
//import jakarta.persistence.*;
//import lombok.EqualsAndHashCode;
//import lombok.Getter;
//import lombok.Setter;
//
//@Entity
//@Table(name = "thesisform_professor_association")
//@Getter
//@Setter
//@EqualsAndHashCode
//public class ThesisFormProfessorAssociation {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne
//    @JoinColumn(name = "thesisform_id", nullable = false)
//    private ThesisForm thesisForm;
//
//    @ManyToOne
//    @JoinColumn(name = "professor_id", nullable = false)
//    private Professor professor;
//}

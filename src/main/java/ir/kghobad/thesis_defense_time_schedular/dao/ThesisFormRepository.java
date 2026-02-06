package ir.kghobad.thesis_defense_time_schedular.dao;

import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface ThesisFormRepository extends JpaRepository<ThesisForm, Long> {
    List<ThesisForm> findByStudentId(Long studentId);

    Set<ThesisForm> findAllByInstructorId(Long id);

    @Query(value = "SELECT * FROM thesis_form tf " +
            "WHERE tf.state = 'INSTRUCTOR_APPROVED' " +
            "OR tf.state LIKE '%_REJECTED' " +
            "OR tf.state LIKE '%_REVISION_REQUESTED_FOR_ADMIN'",
            nativeQuery = true)
    List<ThesisForm> findAllFormsForAdmin();

    @Query("SELECT tf FROM ThesisForm tf " +
            "INNER JOIN Professor p ON tf.field.department.id = p.department.id " +
            "WHERE p.id = :managerId " +
            "AND p.manager = TRUE")
    List<ThesisForm> findAllByManagerId(@Param("managerId") Long managerId);

    Long countByState(FormState state);

    Integer countByStudent_DepartmentIdAndStateIn(Long id, List<FormState> activeStates);

    double countByStudentIdAndState(Long studentId, FormState state);
}
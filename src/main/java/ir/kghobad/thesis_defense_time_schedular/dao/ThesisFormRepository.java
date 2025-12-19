package ir.kghobad.thesis_defense_time_schedular.dao;

import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Repository
public interface ThesisFormRepository extends JpaRepository<ThesisForm, Long> {
    Set<ThesisForm> findAllByInstructorId(Long id);

    List<ThesisForm> findAllByInstructorIdAndStateIn(Long instructorId, Collection<FormState> states);

    @Query("SELECT tf FROM ThesisForm tf WHERE tf.state = 'INSTRUCTOR_APPROVED'")
    List<ThesisForm> findAllInstructorApprovedThesisForms();

    @Query("SELECT tf FROM ThesisForm tf WHERE tf.state = 'ADMIN_APPROVED'")
    List<ThesisForm> findAllAdminApprovedThesisForms();

    Long countByState(FormState state);

    Integer countByStudent_DepartmentIdAndStateIn(Long id, List<FormState> activeStates);

    List<ThesisForm> findByStudentId(Long studentId);

    long countByStudentId(Long studentId);

    double countByStudentIdAndState(Long studentId, FormState state);

    List<ThesisForm> findAllByFieldIn(Collection<Field> fields);

    @Query("SELECT tf FROM ThesisForm tf " +
            "INNER JOIN Professor p ON tf.field.department.id = p.department.id " +
            "WHERE p.id = :managerId " +
            "AND p.manager = TRUE")
    List<ThesisForm> findAllByManagerId(@Param("managerId") Long managerId);
}
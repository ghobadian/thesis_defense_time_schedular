package ir.kghobad.thesis_defense_time_schedular.dao;

import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface ThesisFormRepository extends JpaRepository<ThesisForm, Long> {
    Set<ThesisForm> findAllByInstructorId(Long id);

    List<ThesisForm> findAllByInstructorIdAndState(Long instructor_id, FormState state);

    @Query("SELECT tf FROM ThesisForm tf WHERE tf.state = 'INSTRUCTOR_APPROVED'")
    List<ThesisForm> findAllInstructorApprovedThesisForms();

    @Query("SELECT tf FROM ThesisForm tf WHERE tf.state = 'ADMIN_APPROVED'")
    List<ThesisForm> findAllAdminApprovedThesisForms();
}
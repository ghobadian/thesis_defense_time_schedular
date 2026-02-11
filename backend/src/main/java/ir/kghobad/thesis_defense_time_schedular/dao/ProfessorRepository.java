package ir.kghobad.thesis_defense_time_schedular.dao;

import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long>, JpaSpecificationExecutor<Professor> {
    @Query("SELECT p.manager FROM Professor p WHERE p.id = ?1")
    boolean isManager(Long instructorId);


    @Query("SELECT COUNT(DISTINCT p) FROM Professor p " +
            "JOIN ThesisForm tf ON tf.instructor = p " +
            "WHERE tf.submissionDate >= :since")
    Long countActiveProfessors(@Param("since") LocalDateTime since);

    Integer countByDepartmentId(Long departmentId);

    List<Professor> findAllByDepartmentId(Long departmentId);

    @Query("SELECT p.department.fields FROM Professor p " +
            "WHERE p.id = :professorId")
    List<Long> findFieldIdsByProfessorId(@Param("professorId")Long professorId);

    @Query("SELECT p FROM Professor p " +
            "WHERE p.department.id = " +
            "(SELECT d.id FROM Department d INNER JOIN Professor pp ON d.id = p.department.id WHERE pp.id = :professorId)")
    List<Professor> findAllColleagues(Long professorId);

    @Query("SELECT COUNT(p) > 0 FROM Professor p WHERE p.id = :professorId AND p.manager = true")
    boolean existsManagerById(Long professorId);

    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByEmail(String email);
}
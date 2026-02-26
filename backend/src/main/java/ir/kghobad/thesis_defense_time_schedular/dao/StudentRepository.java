package ir.kghobad.thesis_defense_time_schedular.dao;

import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long>, JpaSpecificationExecutor<Student> {
    Optional<Student> findByEmail(String email);

    Optional<Student> findByPhoneNumber(String phoneNumber);

    boolean existsByPhoneNumber(String phoneNumber);

    List<Student> findByInstructorId(Long instructorId);

    Integer countByDepartmentId(Long departmentId);

    @Modifying
    @Query("UPDATE Student s SET s.enabled = false WHERE s.id = :studentId")
    @Transactional
    void disable(Long studentId);
}
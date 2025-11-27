package ir.kghobad.thesis_defense_time_schedular.dao;

import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FieldRepository extends JpaRepository<Field, Long> {
    Integer countByDepartmentId(Long departmentId);

    @Query("SELECT f FROM Field f WHERE f.active = true")
    @Override
    @NonNull
    List<Field> findAll();

    @Query("SELECT f FROM Field f WHERE f.id = :fieldId AND f.active = true")
    @Override
    @NonNull
    Optional<Field> findById(@NonNull @Param("fieldId") Long fieldId);

    @Modifying
    @Query("UPDATE Field f SET f.active = false WHERE f.id = :fieldId")
    void deactivateField(@Param("fieldId") Long fieldId);

    @Query("SELECT COUNT(f) > 0 FROM Field f WHERE f.id = :fieldId AND f.active = true")
    @Override
    boolean existsById(@NonNull @Param("fieldId") Long fieldId);

    Integer countByDepartmentIdAndActiveIsTrue(Long departmentId);
}

package ir.kghobad.thesis_defense_time_schedular.dao;

import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    boolean existsByPhoneNumber(String phoneNumber);

}
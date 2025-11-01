package ir.kghobad.thesis_defense_time_schedular.dao;

import ir.kghobad.thesis_defense_time_schedular.model.entity.TimeSlot;
import ir.kghobad.thesis_defense_time_schedular.model.enums.TimePeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    @Query("SELECT CASE WHEN COUNT(ts) > 0 THEN true ELSE false END " +
            "FROM TimeSlot ts " +
            "JOIN ts.timeSlotProfessorAssociations tspa " +
            "WHERE ts.defenseMeeting.id = :meetingId " +
            "AND tspa.professor.id = :professorId")
    boolean existsByMeetingIdAndJuryId(@Param("meetingId") Long meetingId,
                                       @Param("professorId") Long professorId);

    Optional<TimeSlot> findByDateAndTimePeriodAndDefenseMeeting_Id(LocalDate date, TimePeriod timePeriod, Long defenseMeetingId);
}
package ir.kghobad.thesis_defense_time_schedular.dao;

import ir.kghobad.thesis_defense_time_schedular.model.entity.TimeSlot;
import ir.kghobad.thesis_defense_time_schedular.model.enums.TimePeriod;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    @Query("SELECT CASE WHEN COUNT(ts) > 0 THEN true ELSE false END " +
            "FROM TimeSlot ts " +
            "JOIN ts.timeSlotProfessorAssociations tspa " +
            "WHERE ts.defenseMeeting.id = :meetingId " +
            "AND tspa.professor.id = :professorId")
    boolean existsByMeetingIdAndJuryId(@Param("meetingId") Long meetingId,
                                       @Param("professorId") Long professorId);

    @Query("SELECT ts " +
            "FROM TimeSlot ts " +
            "JOIN ts.timeSlotProfessorAssociations tspa " +
            "WHERE tspa.professor.id = :professorId ")
    List<TimeSlot> findByJuryId(@Param("professorId") Long professorId);

    @Query("SELECT ts " +
            "FROM TimeSlot ts " +
            "JOIN ts.timeSlotProfessorAssociations tspa " +
            "WHERE tspa.professor.id = :professorId " +
            "AND ts.defenseMeeting.id = :meetingId")
    List<TimeSlot> findByDefenseMeetingIdAndJuryId(@Param("meetingId") Long meetingId, @Param("professorId") Long professorId);

    Optional<TimeSlot> findByDateAndTimePeriodAndDefenseMeeting_Id(LocalDate date, TimePeriod timePeriod, Long defenseMeetingId);


    @Modifying
    @Transactional
    @Query("DELETE FROM TimeSlotProfessorAssociation tspa " +
            "WHERE tspa.professor.id = :professorId " +
            "AND tspa.timeSlot.defenseMeeting.id = :meetingId")
    void deleteAssociationsByDefenseMeetingIdAndProfessorId(@Param("meetingId") Long meetingId,
                                                            @Param("professorId") Long professorId);

    @Query("DELETE FROM TimeSlot ts " +
            "WHERE ts.defenseMeeting.id = :meetingId " +
            "AND ts.id IN (" +
            "SELECT tspa.timeSlot.id " +
            "FROM TimeSlotProfessorAssociation tspa " +
            "WHERE tspa.professor.id = :professorId" +
            ")")
    @Modifying//TODO delete
    @Transactional
    void deleteAllByDefenseMeetingIdAndProfessorId(@Param("meetingId") Long meetingId,
                                                   @Param("professorId") Long professorId);

    @Query("SELECT ts FROM TimeSlot ts " +
            "JOIN ts.timeSlotProfessorAssociations tspa " +
            "WHERE tspa.professor.id IN :juryIds AND ts.defenseMeeting.id = :meetingId " +
            "GROUP BY ts " +
            "HAVING COUNT(DISTINCT tspa.professor.id) = :juryCount")
    Collection<TimeSlot> findIntersections(@Param("juryIds") Set<Long> juryIds,
                                           @Param("juryCount") long juryCount,
                                           @Param("meetingId") Long meetingId);
}
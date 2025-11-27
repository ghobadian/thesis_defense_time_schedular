package ir.kghobad.thesis_defense_time_schedular.dao;

import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import ir.kghobad.thesis_defense_time_schedular.model.enums.MeetingState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ThesisDefenseMeetingRepository extends JpaRepository<ThesisDefenseMeeting, Long> {
    @Query("SELECT tdm FROM ThesisDefenseMeeting tdm " +
            "WHERE tdm.thesisForm.student.id = :sid " +
            "AND tdm.state = :state")
    List<ThesisDefenseMeeting> findByStudentId(Long sid, MeetingState state);

    @Query("SELECT tdm FROM ThesisDefenseMeeting tdm " +
            "WHERE tdm.thesisForm.student.id = :sid ")
    List<ThesisDefenseMeeting> findByStudentId(Long sid);
    @Query("SELECT tdm FROM ThesisDefenseMeeting tdm " +
            "JOIN tdm.defenseMeetingProfessorAssociations dmpa " +
            "WHERE dmpa.professor.id = :juryId")
    List<ThesisDefenseMeeting> findByJuryId(Long juryId);

    @Query("SELECT COUNT(m) FROM ThesisDefenseMeeting m " +
            "WHERE m.selectedTimeSlot.date >= :date AND m.state = :meetingState")
    Long countUpcoming(@Param("date") LocalDate date, @Param("meetingState") MeetingState meetingState);

    Long countByState(MeetingState meetingState);

    @Query("SELECT tdm FROM ThesisDefenseMeeting tdm " +
            "WHERE tdm.thesisForm.field.department.id = (SELECT p.department.id FROM Professor p WHERE p.id = :managerId)")
    List<ThesisDefenseMeeting> findByManagerId(Long managerId);
}
package ir.kghobad.thesis_defense_time_schedular.dao;

import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import ir.kghobad.thesis_defense_time_schedular.model.enums.MeetingState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThesisDefenseMeetingRepository extends JpaRepository<ThesisDefenseMeeting, Long> {
    @Query("SELECT tdm FROM ThesisDefenseMeeting tdm " +
            "WHERE tdm.thesisForm.student.id = :sid " +
            "AND tdm.state = :state")
    List<ThesisDefenseMeeting> findByStudentId(Long sid, MeetingState state);

    @Query("SELECT tdm FROM ThesisDefenseMeeting tdm " +
            "JOIN tdm.defenseMeetingProfessorAssociations dmpa " +
            "WHERE dmpa.professor.id = :juryId")
    List<ThesisDefenseMeeting> findByJuryId(Long juryId);
}
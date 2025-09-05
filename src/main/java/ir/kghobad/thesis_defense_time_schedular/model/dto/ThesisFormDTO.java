package ir.kghobad.thesis_defense_time_schedular.model.dto;

import java.util.List;

public class ThesisFormDTO {
    private String title;
    private String abstractText;
    private Long studentId;
    private Long instructorId;
    private List<Long> suggestedJuryIds;

    public ThesisFormDTO(String title, String abstractText, Long studentId, Long instructorId, List<Long> suggestedJuryIds) {
        this.title = title;
        this.abstractText = abstractText;
        this.studentId = studentId;
        this.instructorId = instructorId;
        this.suggestedJuryIds = suggestedJuryIds;
    }

    public ThesisFormDTO() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAbstractText() {
        return abstractText;
    }

    public void setAbstractText(String abstractText) {
        this.abstractText = abstractText;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getInstructorId() {
        return instructorId;
    }

    public void setInstructorId(Long instructorId) {
        this.instructorId = instructorId;
    }

    public List<Long> getSuggestedJuryIds() {
        return suggestedJuryIds;
    }

    public void setSuggestedJuryIds(List<Long> suggestedJuryIds) {
        this.suggestedJuryIds = suggestedJuryIds;
    }
}

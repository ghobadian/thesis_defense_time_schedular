package ir.kghobad.thesis_defense_time_schedular.model.dto.form;

import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Optional;

@Setter
@Getter
public class ThesisFormOutputDTO {
    private Long id;
    private String title;
    private String abstractText;
    private Long studentId;
    private String studentFirstName;
    private String studentLastName;
    private Long studentNumber;
    private String studentEmail;
    private String fieldName;
    private String instructorFirstName;
    private Long instructorId;
    private String instructorLastName;
    private String state;
    private String createdAt;
    private String updatedAt;
    private String instructorReviewedAt;
    private String adminReviewedAt;
    private String managerReviewedAt;
    private String rejectionReason;
    private String revisionMessage;
    private String revisionRequestedAt;


    public static ThesisFormOutputDTO from(ThesisForm form) {
        ThesisFormOutputDTO output = new ThesisFormOutputDTO();
        output.setTitle(form.getTitle());
        output.setId(form.getId());
        output.setAbstractText(form.getAbstractText());
        output.setStudentId(form.getStudent().getId());
        output.setStudentFirstName(form.getStudent().getFirstName());
        output.setStudentLastName(form.getStudent().getLastName());
        output.setStudentNumber(form.getStudent().getStudentNumber());
        output.setStudentEmail(form.getStudent().getEmail());
        output.setState(form.getState().toString());
        output.setFieldName(Optional.ofNullable(form.getField()).map(Field::getName).orElse(null));
        output.setInstructorId(form.getInstructor().getId());
        output.setInstructorFirstName(Optional.of(form.getInstructor()).map(Professor::getFirstName).orElse(null));
        output.setInstructorLastName(Optional.of(form.getInstructor()).map(Professor::getLastName).orElse(null));
        output.setCreatedAt(form.getSubmissionDate().toString());
        output.setUpdatedAt(Optional.ofNullable(form.getUpdateDate()).map(LocalDateTime::toString).orElse(null));
        output.setInstructorReviewedAt(form.getInstructorReviewedAt() != null ? form.getInstructorReviewedAt().toString() : null);
        output.setAdminReviewedAt(form.getAdminReviewedAt() != null ? form.getAdminReviewedAt().toString() : null);
        output.setManagerReviewedAt(form.getManagerReviewedAt() != null ? form.getManagerReviewedAt().toString() : null);
        output.setRejectionReason(form.getRejectionReason());
        output.setRevisionMessage(form.getRevisionMessage());
        output.setRevisionRequestedAt(form.getRevisionRequestedAt() != null ? form.getRevisionRequestedAt().toString() : null);
        return output;
    }
}

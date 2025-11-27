package ir.kghobad.thesis_defense_time_schedular.model.dto.form;

import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import lombok.Getter;
import lombok.Setter;

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
    private String comment;


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
        output.setFieldName(form.getField().getName());
        output.setInstructorId(form.getInstructor().getId());
        output.setInstructorFirstName(form.getInstructor().getFirstName());
        output.setInstructorLastName(form.getInstructor().getLastName());
        output.setCreatedAt(form.getSubmissionDate().toString());
        output.setUpdatedAt(form.getUpdateDate().toString());
        output.setComment(form.getComment());
        return output;
    }
}

package ir.kghobad.thesis_defense_time_schedular.model.dto;

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
    private String instructorLastName;
    private String state;
    private String createdAt;
    private String updatedAt;


    public static ThesisFormOutputDTO from(ThesisForm input) {
        ThesisFormOutputDTO output = new ThesisFormOutputDTO();
        output.setTitle(input.getTitle());
        output.setId(input.getId());
        output.setAbstractText(input.getAbstractText());
        output.setStudentId(input.getStudent().getId());
        output.setStudentFirstName(input.getStudent().getFirstName());
        output.setStudentLastName(input.getStudent().getLastName());
        output.setStudentNumber(input.getStudent().getStudentNumber());
        output.setStudentEmail(input.getStudent().getEmail());
        output.setState(input.getState().toString());
        output.setFieldName(input.getField().getName());
        output.setInstructorFirstName(input.getInstructor().getFirstName());
        output.setInstructorLastName(input.getInstructor().getLastName());
        output.setCreatedAt(input.getSubmissionDate().toString());
        output.setUpdatedAt(input.getUpdateDate().toString());
        return output;
    }
}

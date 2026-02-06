package ir.kghobad.thesis_defense_time_schedular.service.student;

import ir.kghobad.thesis_defense_time_schedular.dao.ProfessorRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.StudentRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.ThesisFormRepository;
import ir.kghobad.thesis_defense_time_schedular.exception.ThesisFormLimitExceededException;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.student.Student;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.security.JwtUtil;
import ir.kghobad.thesis_defense_time_schedular.service.form.FormService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentFormService {
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final JwtUtil jwtUtil;
    private final ThesisFormRepository formRepository;
    private final FormService formService;

    @Value("${rate-limit.max-submitted-forms}")
    private int maxSubmittedForms;

    public void createThesisForm(ThesisFormInputDTO dto) {
        Long studentId = jwtUtil.getCurrentUserId();
        double submittedFormsCount = formRepository.countByStudentIdAndState(studentId, FormState.SUBMITTED);
        if (submittedFormsCount >= maxSubmittedForms) {
            throw new ThesisFormLimitExceededException(
                    String.format("Maximum limit of %d submitted forms reached. " +
                                    "Please wait for your existing forms to be processed.",
                            maxSubmittedForms)
            );
        }
        Student student = studentRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));

        Professor thesisInstructor = professorRepository.findById(dto.getInstructorId()).orElseThrow(() -> new RuntimeException("Instructor not found"));

        ThesisForm form = new ThesisForm();
        form.setTitle(dto.getTitle());
        form.setAbstractText(dto.getAbstractText());
        form.setStudent(student);
        form.setInstructor(thesisInstructor);
        form.setState(FormState.SUBMITTED);
        form.setSubmissionDate(LocalDateTime.now());
        form.setUpdateDate(LocalDateTime.now());
        form.setStudentType(student.getStudentType());
        form.setField(student.getField());

        formRepository.save(form);
    }

    public void updateThesisForm(Long formId, ThesisFormInputDTO dto) {
        Professor thesisInstructor = professorRepository.findById(dto.getInstructorId()).orElseThrow(() -> new RuntimeException("Instructor not found"));

        ThesisForm form = formRepository.findById(formId).orElseThrow();

        form.setTitle(dto.getTitle());
        form.setAbstractText(dto.getAbstractText());
        form.setInstructor(thesisInstructor);
        form.setUpdateDate(LocalDateTime.now());

        formRepository.save(form);
    }

    public List<ThesisFormOutputDTO> getThesisForms() {
        return formRepository.findByStudentId(jwtUtil.getCurrentUserId()).stream()
                .map(ThesisFormOutputDTO::from).toList();
    }

    public void submitRevision(Long formId) {
        ThesisForm form = formRepository.findById(formId)
                .orElseThrow(() -> new EntityNotFoundException("Form not found"));

        if (!form.getState().isForStudentRevisionRequested()) {
            throw new IllegalStateException("Only forms requested for instructor revision can be submitted");
        }

        formService.submitRevision(form);
    }


}

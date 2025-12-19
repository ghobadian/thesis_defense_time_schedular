package ir.kghobad.thesis_defense_time_schedular.service.professor;

import ir.kghobad.thesis_defense_time_schedular.dao.ProfessorRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.ThesisFormRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.FormRejectionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class ProfessorFormService {
    private final ProfessorRepository professorRepository;
    private final ThesisFormRepository thesisFormRepository;
    private final JwtUtil jwtUtil;

    public void approveFormAsProfessor(Long formId) {
        Professor professor = professorRepository.findById(jwtUtil.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        ThesisForm form = thesisFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found. Can't reject Form"));

        if (!professor.equals(form.getInstructor()) && !professor.isManager()) {
            throw new AuthorizationDeniedException("You are not allowed to approve this form");
        }

        if (form.getState() != FormState.SUBMITTED) {// TODO use state design pattern instead
            throw new IllegalStateException("Form is not in a state that can be approved by instructor. Valid state: %s. Current state: %s".formatted(FormState.SUBMITTED, form.getState()));
        }

        updateAcceptedForm(form);
        thesisFormRepository.save(form);
    }

    private static void updateAcceptedForm(ThesisForm form) {
        form.setState(FormState.INSTRUCTOR_APPROVED);
        updateFormTimeState(form);
    }

    private static void updateFormTimeState(ThesisForm form) {
        Date now = new Date();
        form.setUpdateDate(now);
        form.setInstructorReviewedAt(now);
    }

    public void rejectForm(FormRejectionInputDTO input) {
        Professor professor = professorRepository.findById(jwtUtil.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        ThesisForm form = thesisFormRepository.findById(input.getFormId())
                .orElseThrow(() -> new RuntimeException("Form not found. Can't reject Form"));

        updateRejectedForm(input, form, professor);
        thesisFormRepository.save(form);
    }

    private static void updateRejectedForm(FormRejectionInputDTO input, ThesisForm form, Professor professor) {
        updateRejectedFormState(form, professor);
        updateFormTimeState(form);
        form.setRejectionReason("""
                Your thesis form is rejected by professor %s %s.
                His reason for rejecting your form is:
                %s
                If you think this was an error, please contact %s.
                """.formatted(professor.getFirstName(), professor.getLastName(), input.getRejectionReason(), professor.getEmail()));
    }

    private static void updateRejectedFormState(ThesisForm form, Professor professor) {
        if (professor.equals(form.getInstructor())) {
            form.setState(FormState.INSTRUCTOR_REJECTED);
        } else if (professor.isManager()) {
            form.setState(FormState.MANAGER_REJECTED);
        } else {
            throw new AuthorizationDeniedException("You are not allowed to reject this form");
        }
    }

    public List<ThesisFormOutputDTO> getThesisForms() {
        Long currentUserId = jwtUtil.getCurrentUserId();

        if (professorRepository.isManager(currentUserId)) {
            return thesisFormRepository.findAllByManagerId(currentUserId).stream()
                    .map(ThesisFormOutputDTO::from).toList();
        }

        return thesisFormRepository.findAllByInstructorId(currentUserId)
                .stream().map(ThesisFormOutputDTO::from).toList();
    }
}

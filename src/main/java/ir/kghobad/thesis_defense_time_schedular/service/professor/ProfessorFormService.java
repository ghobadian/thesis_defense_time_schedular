package ir.kghobad.thesis_defense_time_schedular.service.professor;

import ir.kghobad.thesis_defense_time_schedular.dao.ProfessorRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.ThesisFormRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.FormRejectionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.RequestRevisionInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.form.ThesisFormOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import ir.kghobad.thesis_defense_time_schedular.security.JwtUtil;
import ir.kghobad.thesis_defense_time_schedular.service.admin.FormRevisionService;
import ir.kghobad.thesis_defense_time_schedular.service.form.FormService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class ProfessorFormService implements FormRevisionService {
    private final ProfessorRepository professorRepository;
    private final ThesisFormRepository formRepository;
    private final JwtUtil jwtUtil;
    private final FormService formService;

    public void approveFormAsProfessor(Long formId) {
        Professor professor = professorRepository.findById(jwtUtil.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        ThesisForm form = formRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found. Can't reject Form"));

        if (!professor.equals(form.getInstructor()) && !professor.isManager()) {
            throw new AuthorizationDeniedException("You are not allowed to approve this form");
        }

        if (form.getState() != FormState.SUBMITTED) {// TODO use state design pattern instead
            throw new IllegalStateException("Form is not in a state that can be approved by instructor. Valid state: %s. Current state: %s".formatted(FormState.SUBMITTED, form.getState()));
        }

        updateAcceptedForm(form);
        formRepository.save(form);
    }

    private static void updateAcceptedForm(ThesisForm form) {
        form.setState(FormState.INSTRUCTOR_APPROVED);
        updateFormTimeState(form);
    }

    private static void updateFormTimeState(ThesisForm form) {
        LocalDateTime now = LocalDateTime.now();
        form.setUpdateDate(now);
        form.setInstructorReviewedAt(now);
    }

    public void rejectForm(FormRejectionInputDTO input) {
        Professor professor = professorRepository.findById(jwtUtil.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        ThesisForm form = formRepository.findById(input.getFormId())
                .orElseThrow(() -> new RuntimeException("Form not found. Can't reject Form"));

        updateRejectedForm(input, form, professor);
        formRepository.save(form);
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
            return formRepository.findAllByManagerId(currentUserId).stream()
                    .map(ThesisFormOutputDTO::from).toList();
        }

        return formRepository.findAllByInstructorId(currentUserId)
                .stream().map(ThesisFormOutputDTO::from).toList();
    }

    @Override
    public void requestRevision(RequestRevisionInputDTO input) {
        ThesisForm form = formRepository.findById(input.getId())
                .orElseThrow(() -> new EntityNotFoundException("Form not found"));

        Professor professor = professorRepository.findById(jwtUtil.getCurrentUserId()).orElseThrow();

        validateRevisionState(professor, form);

        FormState newState = getFormState(input, professor, form);

        form.setState(newState);
        form.setRevisionMessage(input.getMessage());
        form.setRevisionRequestedAt(LocalDateTime.now());
        formRepository.save(form);
    }

    private static void validateRevisionState(Professor professor, ThesisForm form) {
        if (professor.isManager()) {
            if (form.getState() != FormState.SUBMITTED && form.getState() != FormState.ADMIN_APPROVED) {
                throw new IllegalStateException("Form must be in INSTRUCTOR_APPROVED state");
            }

        } else {
            if (form.getState() != FormState.SUBMITTED &&
                    form.getState() != FormState.ADMIN_REVISION_REQUESTED_FOR_INSTRUCTOR &&
                    form.getState() != FormState.MANAGER_REVISION_REQUESTED_FOR_INSTRUCTOR) {
                throw new IllegalStateException("Form must be in INSTRUCTOR_APPROVED state");
            }
        }
    }

    private static FormState getFormState(RequestRevisionInputDTO input, Professor professor, ThesisForm form) {
        if (form.getInstructor().equals(professor)) {
            return FormState.INSTRUCTOR_REVISION_REQUESTED;
        }

        if (professor.isManager()) {
            return switch (input.getTarget()) {
                case STUDENT -> FormState.MANAGER_REVISION_REQUESTED_FOR_STUDENT;
                case INSTRUCTOR -> FormState.MANAGER_REVISION_REQUESTED_FOR_INSTRUCTOR;
                case ADMIN -> FormState.MANAGER_REVISION_REQUESTED_FOR_ADMIN;
            };
        } else {
            return FormState.INSTRUCTOR_REVISION_REQUESTED;
        }
    }

    public void submitRevision(Long formId) {
        ThesisForm form = formRepository.findById(formId)
                .orElseThrow(() -> new EntityNotFoundException("Form not found"));

        if (!form.getState().isForInstructorRevisionRequested()) {
            throw new IllegalStateException("Only forms requested for instructor revision can be submitted");
        }

        if (professorRepository.isManager(jwtUtil.getCurrentUserId())) {
            throw new AuthorizationDeniedException("Managers cannot submit instructor revisions");
        }

        formService.submitRevision(form);
    }
}

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

        form.setState(FormState.INSTRUCTOR_APPROVED);
        form.setUpdateDate(new Date());
        thesisFormRepository.save(form);
    }

    public void rejectForm(FormRejectionInputDTO input) {
        Professor professor = professorRepository.findById(jwtUtil.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        ThesisForm form = thesisFormRepository.findById(input.getFormId())
                .orElseThrow(() -> new RuntimeException("Form not found. Can't reject Form"));

        if (professor.equals(form.getInstructor())) {
            form.setState(FormState.INSTRUCTOR_REJECTED);
        } else if (professor.isManager()) {
            form.setState(FormState.MANAGER_REJECTED);
        } else {
            throw new AuthorizationDeniedException("You are not allowed to reject this form");
        }
        form.setUpdateDate(new Date());
        form.setComment("""
                Your thesis form is rejected by professor %s %s.
                His reason for rejecting your form is:
                %s
                If you think this was an error, please contact %s.
                """.formatted(professor.getFirstName(), professor.getLastName(), input.getRejectionReason(), professor.getEmail()));

        thesisFormRepository.save(form);
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

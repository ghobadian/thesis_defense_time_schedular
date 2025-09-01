package ir.kghobad.thesis_defense_time_schedular.service;

import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.TimeSlot;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfessorService {

    public void acceptForm(ThesisForm form) {
//        if (this.equals(form.getInstructor())) {
//            form.setState(FormState.INSTRUCTOR_APPROVED);
//        } else if (this.isManager) {
//            form.setState(FormState.MANAGER_APPROVED);
//        }
    }

    public void rejectForm(ThesisForm form) {
//        if (this.equals(form.getInstructor())) {
//            form.setState(FormState.INSTRUCTOR_REJECTED);
//        } else if (this.isManager) {
//            form.setState(FormState.MANAGER_REJECTED);
//        }
    }

    public void suggestJuries(ThesisForm form, List<Professor> juries) {
//        form.setSuggestedJuries(juries);
//        form.setState(FormState.JURY_SELECTION);
    }

    public void specifyAvailableTime(ThesisDefenseMeeting meeting, TimeSlot timeSlot) {
//        timeSlot.getAvailableProfessors().add(this);
    }

}

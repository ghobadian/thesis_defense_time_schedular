package ir.kghobad.thesis_defense_time_schedular.service;

import ir.kghobad.thesis_defense_time_schedular.dao.*;
import ir.kghobad.thesis_defense_time_schedular.model.dto.TimeSlotDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.ThesisDefenseMeeting;
import ir.kghobad.thesis_defense_time_schedular.model.entity.thesisform.ThesisForm;
import ir.kghobad.thesis_defense_time_schedular.model.entity.TimeSlot;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProfessorService {
    private final ProfessorRepository professorRepository;
    private final ThesisFormRepository thesisFormRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final ThesisDefenseMeetingRepository defenseMeetingRepository;
    
    public ProfessorService(
        ProfessorRepository professorRepository,
        ThesisFormRepository thesisFormRepository,
        TimeSlotRepository timeSlotRepository,
        ThesisDefenseMeetingRepository defenseMeetingRepository
    ) {
        this.professorRepository = professorRepository;
        this.thesisFormRepository = thesisFormRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.defenseMeetingRepository = defenseMeetingRepository;
    }

    public void acceptForm(Long professorId, Long formId) {
        Professor professor = professorRepository.findById(professorId)
            .orElseThrow(() -> new RuntimeException("Professor not found"));
            
        ThesisForm form = thesisFormRepository.findById(formId)
            .orElseThrow(() -> new RuntimeException("Form not found"));
            
        if (professor.equals(form.getInstructor())) {
            form.setState(FormState.INSTRUCTOR_APPROVED);
        } else if (professor.isManager()) {
            form.setState(FormState.MANAGER_APPROVED);
        }
        
        thesisFormRepository.save(form);
    }

    public void rejectForm(Long professorId, Long formId) {
        Professor professor = professorRepository.findById(professorId)
            .orElseThrow(() -> new RuntimeException("Professor not found"));
            
        ThesisForm form = thesisFormRepository.findById(formId)
            .orElseThrow(() -> new RuntimeException("Form not found"));
            
        if (professor.equals(form.getInstructor())) {
            form.setState(FormState.INSTRUCTOR_REJECTED);
        } else if (professor.isManager()) {
            form.setState(FormState.MANAGER_REJECTED);
        }
        
        thesisFormRepository.save(form);
    }

    public void suggestJuries(Long formId, List<Long> juryIds) {
        ThesisForm form = thesisFormRepository.findById(formId)
            .orElseThrow(() -> new RuntimeException("Form not found"));
            
        List<Professor> juries = professorRepository.findAllById(juryIds);
        form.setSuggestedJuries(juries);
        form.setState(FormState.JURY_SELECTION);
        
        thesisFormRepository.save(form);
    }

    public void specifyAvailableTime(Long professorId, TimeSlotDTO dto) {
        Professor professor = professorRepository.findById(professorId)
            .orElseThrow(() -> new RuntimeException("Professor not found"));
            
        ThesisDefenseMeeting meeting = defenseMeetingRepository.findById(dto.getMeetingId())
            .orElseThrow(() -> new RuntimeException("Meeting not found"));
            
        TimeSlot timeSlot = new TimeSlot();
        timeSlot.setDate(dto.getDate());
        timeSlot.setTimePeriod(dto.getTimePeriod());
        timeSlot.setDefenseMeeting(meeting);
        timeSlot.getAvailableProfessors().add(professor);
        
        timeSlotRepository.save(timeSlot);
    }
}

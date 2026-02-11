package ir.kghobad.thesis_defense_time_schedular.service.admin;

import ir.kghobad.thesis_defense_time_schedular.dao.*;
import ir.kghobad.thesis_defense_time_schedular.model.dto.department.DepartmentDetailOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.department.DepartmentInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import ir.kghobad.thesis_defense_time_schedular.model.enums.FormState;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class AdminDepartmentService {
    private final ThesisFormRepository thesisFormRepository;
    private final DepartmentRepository departmentRepository;
    private final FieldRepository fieldRepository;
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;


    public List<DepartmentDetailOutputDTO> getDepartments() {
        return departmentRepository.findAll().stream().map(this::toDepartmentDetail).toList();
    }

    public void deleteDepartment(Long departmentId) {
        departmentRepository.deleteById(departmentId);
    }

    public void updateDepartment(Long departmentId, DepartmentInputDTO input) {
        Department department = departmentRepository.findById(departmentId).orElseThrow();
        department.setName(input.getName());
        departmentRepository.save(department);
    }

    public void createDepartment(DepartmentInputDTO input) {
        Department department = new Department();
        department.setName(input.getName());
        departmentRepository.save(department);
    }

    private DepartmentDetailOutputDTO toDepartmentDetail(Department department) {
        DepartmentDetailOutputDTO dto = new DepartmentDetailOutputDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setStudentCount(studentRepository.countByDepartmentId(department.getId()));
        dto.setProfessorCount(professorRepository.countByDepartmentId(department.getId()));
        dto.setFieldCount(fieldRepository.countByDepartmentIdAndActiveIsTrue(department.getId()));
        List<FormState> activeStates = List.of(FormState.SUBMITTED, FormState.INSTRUCTOR_APPROVED, FormState.ADMIN_APPROVED, FormState.MANAGER_APPROVED);
        dto.setActiveThesisCount(thesisFormRepository.countByStudent_DepartmentIdAndStateIn(department.getId(), activeStates));
        return dto;

    }
}

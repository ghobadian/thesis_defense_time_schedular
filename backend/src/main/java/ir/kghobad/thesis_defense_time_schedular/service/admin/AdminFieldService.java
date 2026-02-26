package ir.kghobad.thesis_defense_time_schedular.service.admin;

import ir.kghobad.thesis_defense_time_schedular.dao.DepartmentRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.FieldRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.field.FieldInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.field.FieldOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminFieldService {
    private final FieldRepository fieldRepository;
    private final DepartmentRepository departmentRepository;

    public List<FieldOutputDTO> getAllFields() {
        return fieldRepository.findAll().stream().map(FieldOutputDTO::from).toList();
    }

    public void createField(FieldInputDTO input) {
        Department department = departmentRepository.findById(input.departmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + input.departmentId()));

        Field field = new Field();
        field.setName(input.name());
        field.setDepartment(department);
        fieldRepository.save(field);
    }

    public void updateField(Long id, FieldInputDTO input) {
        Field field = fieldRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Field not found with ID: " + id));

        Department department = departmentRepository.findById(input.departmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + input.departmentId()));

        field.setName(input.name());
        field.setDepartment(department);
        fieldRepository.save(field);
    }

    @Transactional
    public void deleteField(Long id) {
        if (!fieldRepository.existsById(id)) {
            throw new IllegalArgumentException("Field not found with ID: " + id);
        }
        fieldRepository.disable(id);
    }
}

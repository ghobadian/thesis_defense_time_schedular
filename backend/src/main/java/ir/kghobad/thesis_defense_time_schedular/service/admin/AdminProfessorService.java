package ir.kghobad.thesis_defense_time_schedular.service.admin;

import ir.kghobad.thesis_defense_time_schedular.dao.DepartmentRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.FieldRepository;
import ir.kghobad.thesis_defense_time_schedular.dao.ProfessorRepository;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.SimpleUserOutputDto;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.professor.ProfessorOutputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.dto.user.professor.ProfessorRegistrationInputDTO;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Department;
import ir.kghobad.thesis_defense_time_schedular.model.entity.Field;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.Professor;
import ir.kghobad.thesis_defense_time_schedular.model.entity.user.User;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

@Service
@RequiredArgsConstructor
@Log4j2
public class AdminProfessorService {
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;
    private final FieldRepository fieldRepository;
    private final ProfessorRepository professorRepository;

    public void registerProfessor(ProfessorRegistrationInputDTO dto) {
        Professor professor = new Professor();
        applyProfessorData(professor, dto, false);
        professorRepository.save(professor);
    }

    public void registerProfessors(List<ProfessorRegistrationInputDTO> registrationForms) {
        registrationForms.forEach(this::registerProfessor);
    }

    public void update(Long studentId, ProfessorRegistrationInputDTO input) {
        Professor user = professorRepository.findById(studentId).orElseThrow();
        applyProfessorData(user, input, true);
        professorRepository.save(user);
    }

    private void applyProfessorData(Professor user, ProfessorRegistrationInputDTO dto, boolean skipEmptyFields) {
        applyIfValid(dto.getFirstName(), skipEmptyFields, user::setFirstName);
        applyIfValid(dto.getLastName(), skipEmptyFields, user::setLastName);

        if (professorRepository.existsByEmail(dto.getEmail())) {
            log.error("User with email {} already exists", dto.getEmail());
            throw new RuntimeException("User with this email already exists");
        }
        applyIfValid(dto.getEmail(), skipEmptyFields, user::setEmail);

        if (professorRepository.existsByPhoneNumber(dto.getPhoneNumber())) {
            log.error("User with phone number {} already exists", dto.getPhoneNumber());
            throw new RuntimeException("User with this phone number already exists");
        }
        applyIfValid(dto.getPhoneNumber(), skipEmptyFields, user::setPhoneNumber);

        if (!skipEmptyFields || StringUtils.hasText(dto.getPassword())) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        if (!skipEmptyFields || dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            user.setDepartment(department);
        }

        if (dto.getFieldId() != null) {
            Field field = fieldRepository.findById(dto.getFieldId())
                    .orElseThrow(() -> new RuntimeException("Field not found"));
            if (skipEmptyFields && user.getField() != null && !user.getField().getId().equals(field.getId())) {
                user.getDepartment().removeUser(user);
            }
            user.setField(field);
            field.addUser(user);
        }

        if (!skipEmptyFields) {
            user.setEnabled(true);
        }

        if (!skipEmptyFields || dto.getManager() != null) {
            user.setManager(dto.getManager());
        }
    }

    private void applyIfValid(String value, boolean skipEmpty, Consumer<String> setter) {
        if (!skipEmpty || StringUtils.hasText(value)) {
            setter.accept(value);
        }
    }

    public List<ProfessorOutputDTO> getProfessors(String search, Long departmentId, Integer page, Integer limit) {
        Specification<Professor> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (departmentId != null) {
                predicates.add(cb.equal(root.get("department").get("id"), departmentId));
            }

            if (StringUtils.hasText(search)) {
                String searchLike = "%" + search.toLowerCase() + "%";

                Predicate firstNameMatch = cb.like(cb.lower(root.get("firstName")), searchLike);
                Predicate lastNameMatch = cb.like(cb.lower(root.get("lastName")), searchLike);
                Predicate studentNumberMatch = cb.like(root.get("email").as(String.class), searchLike);

                predicates.add(cb.or(firstNameMatch, lastNameMatch, studentNumberMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        page = (page != null && page >= 0) ? page : 0;
        int size = limit == null ? Integer.MAX_VALUE : limit;

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        return professorRepository.findAll(spec, pageable)
                .stream()
                .filter(User::isEnabled)
                .map(ProfessorOutputDTO::from)
                .toList();
    }

    public void delete(Long id) {
        professorRepository.disable(id);
    }

    public ProfessorOutputDTO get(Long id) {
        Professor user = professorRepository.findById(id).orElseThrow();
        return ProfessorOutputDTO.from(user);
    }

    public List<SimpleUserOutputDto> getProfessors() {
        return professorRepository.findAll().stream().map(SimpleUserOutputDto::from).toList();
    }
}

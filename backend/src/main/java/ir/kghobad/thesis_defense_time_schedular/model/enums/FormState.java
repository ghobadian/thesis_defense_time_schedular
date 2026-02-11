package ir.kghobad.thesis_defense_time_schedular.model.enums;

public enum FormState {
    SUBMITTED,

    INSTRUCTOR_APPROVED,
    INSTRUCTOR_REJECTED,
    INSTRUCTOR_REVISION_REQUESTED,

    ADMIN_APPROVED,
    ADMIN_REJECTED,
    ADMIN_REVISION_REQUESTED_FOR_STUDENT,
    ADMIN_REVISION_REQUESTED_FOR_INSTRUCTOR,

    MANAGER_APPROVED,
    MANAGER_REJECTED,
    MANAGER_REVISION_REQUESTED_FOR_STUDENT,
    MANAGER_REVISION_REQUESTED_FOR_INSTRUCTOR,
    MANAGER_REVISION_REQUESTED_FOR_ADMIN;

    public boolean isTerminal() {
        return this == INSTRUCTOR_REJECTED
                || this == ADMIN_REJECTED
                || this == MANAGER_REJECTED
                || this == MANAGER_APPROVED;
    }

    public boolean isRevisionRequested() {
        return this.name().contains("REVISION_REQUESTED");
    }

    public boolean isForStudentRevisionRequested() {
        return this == INSTRUCTOR_REVISION_REQUESTED
                || this == ADMIN_REVISION_REQUESTED_FOR_STUDENT
                || this == MANAGER_REVISION_REQUESTED_FOR_STUDENT;
    }

    public boolean isForInstructorRevisionRequested() {
        return this == ADMIN_REVISION_REQUESTED_FOR_INSTRUCTOR
                || this == MANAGER_REVISION_REQUESTED_FOR_INSTRUCTOR;
    }

    public boolean isForAdminRevisionRequested() {
        return this == MANAGER_REVISION_REQUESTED_FOR_ADMIN;
    }

    public FormState getStateAfterRevisionSubmitted() {
        return switch (this) {
            case INSTRUCTOR_REVISION_REQUESTED,
                 ADMIN_REVISION_REQUESTED_FOR_STUDENT,
                 MANAGER_REVISION_REQUESTED_FOR_STUDENT -> SUBMITTED;

            case ADMIN_REVISION_REQUESTED_FOR_INSTRUCTOR,
                 MANAGER_REVISION_REQUESTED_FOR_INSTRUCTOR -> INSTRUCTOR_APPROVED;

            case MANAGER_REVISION_REQUESTED_FOR_ADMIN -> ADMIN_APPROVED;

            default -> throw new IllegalStateException("Not a revision state: " + this);
        };
    }


}
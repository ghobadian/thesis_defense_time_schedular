package ir.kghobad.thesis_defense_time_schedular.model.enums;

public enum MeetingState {
    JURIES_SELECTED,
    JURIES_SPECIFIED_TIME,
    STUDENT_SPECIFIED_TIME,
    SCHEDULED,
    COMPLETED,
    CANCELED;

    public void throwException() {
        switch (this) {
            case JURIES_SELECTED -> throw new IllegalStateException("Juries haven't specified time yet");
            case JURIES_SPECIFIED_TIME -> throw new IllegalStateException("Student hasn't specified time yet");
            case STUDENT_SPECIFIED_TIME -> throw new IllegalStateException("Manager hasn't scheduled meeting yet");
            case SCHEDULED -> throw new IllegalStateException("Meeting is scheduled");
            case COMPLETED -> throw new IllegalStateException("Meeting is completed");
            case CANCELED -> throw new IllegalStateException("Meeting is cancelled");
        }
    }
}

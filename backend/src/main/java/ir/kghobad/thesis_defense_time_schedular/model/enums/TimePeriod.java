package ir.kghobad.thesis_defense_time_schedular.model.enums;

import java.time.LocalTime;

public enum TimePeriod {
    PERIOD_7_30_9_00("07:30-09:00", LocalTime.of(7, 30), LocalTime.of(9, 0)),
    PERIOD_9_00_10_30("09:00-10:30", LocalTime.of(9, 0), LocalTime.of(10, 30)),
    PERIOD_10_30_12_00("10:30-12:00", LocalTime.of(10, 30), LocalTime.of(12, 0)),
    PERIOD_13_30_15_00("13:30-15:00", LocalTime.of(13, 30), LocalTime.of(15, 0)),
    PERIOD_15_30_17_00("15:30-17:00", LocalTime.of(15, 30), LocalTime.of(17, 0));

    private final String displayName;
    private final LocalTime startTime;
    private final LocalTime endTime;

    TimePeriod(String displayName, LocalTime startTime, LocalTime endTime) {
        this.displayName = displayName;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public String getDisplayName() {
        return displayName;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }
}

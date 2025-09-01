package ir.kghobad.thesis_defense_time_schedular.model.enums;

public enum TimePeriod {
    PERIOD_7_30_9_00("07:30-09:00"),
    PERIOD_9_00_10_30("09:00-10:30"),
    PERIOD_10_30_12_00("10:30-12:00"),
    PERIOD_13_30_15_00("13:30-15:00"),
    PERIOD_15_30_17_00("15:30-17:00");

    private final String displayName;
    
    TimePeriod(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
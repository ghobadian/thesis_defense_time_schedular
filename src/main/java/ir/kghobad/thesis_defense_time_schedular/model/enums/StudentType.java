package ir.kghobad.thesis_defense_time_schedular.model.enums;

public enum StudentType {
    BACHELOR("Bachelor"),
    MASTER("Master"),
    PHD("PhD");
    
    private final String displayName;
    
    StudentType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}


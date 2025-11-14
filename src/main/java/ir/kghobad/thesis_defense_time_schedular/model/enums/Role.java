package ir.kghobad.thesis_defense_time_schedular.model.enums;

import lombok.Getter;

public enum Role {
    ADMIN("ADMIN"),
    PROFESSOR("PROFESSOR"),
    MANAGER("MANAGER"),
    STUDENT("STUDENT");
    @Getter
    private final String value;

    Role(String value) {
        this.value = value;
    }
}

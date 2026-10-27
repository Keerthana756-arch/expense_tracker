package com.expensetracker.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Category {
    FOOD("Food"),
    TRAVEL("Travel"),
    SHOPPING("Shopping"),
    UTILITIES("Utilities"),
    ENTERTAINMENT("Entertainment"),
    HEALTH("Health"),
    OTHER("Other");

    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static Category fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return OTHER;
        }
        for (Category category : Category.values()) {
            if (category.name().equalsIgnoreCase(value.trim()) ||
                category.displayName.equalsIgnoreCase(value.trim())) {
                return category;
            }
        }
        return OTHER;
    }
}


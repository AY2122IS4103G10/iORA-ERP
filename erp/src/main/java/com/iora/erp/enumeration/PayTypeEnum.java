package com.iora.erp.enumeration;

public enum PayTypeEnum {
    MONTHLY("Pay by month"),
    HOURLY("Pay by hour");

    private String description;

    private PayTypeEnum(String description) {
        this.description = description;
    }

    public String getDescription() {
        return this.description;
    }
}

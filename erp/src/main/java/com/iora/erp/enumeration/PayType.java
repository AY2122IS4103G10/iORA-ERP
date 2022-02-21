package com.iora.erp.enumeration;

public enum PayType {
    MONTHLY("Pay by month"),
    HOURLY("Pay by hour");
  
    private String description;

    private PayType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return this.description;
    }
}

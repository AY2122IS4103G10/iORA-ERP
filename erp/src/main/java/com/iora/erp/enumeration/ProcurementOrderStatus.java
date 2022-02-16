package com.iora.erp.enumeration;

public enum ProcurementOrderStatus implements StatusEnum {
    PENDING("Pending confirmation from factory."),
    CONFIRMED("Procurement Order confirmed by factory."),
    READY("Procurement Order satisfied by factory."),
    CANCELLED("Procurement Order cancelled.");

    private String description;

    private ProcurementOrderStatus(String description) {
        this.description = description;
    }

    @Override
    public String getDescription() {
        return this.description;
    }
}

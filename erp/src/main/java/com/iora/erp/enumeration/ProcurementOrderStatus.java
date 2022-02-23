package com.iora.erp.enumeration;

public enum ProcurementOrderStatus implements StatusEnum {
    PENDING("Pending confirmation from factory."),
    ACCEPTED("Procurement Order accepted by factory."),
    READY("Procurement Order satisfied by factory."),
    SHIPPED("Stock has been shipped to warehouse"),
    VERIFIED("Warehouse has verified the Procurement Order"),
    COMPLETED("Procurement Order has been fulfilled"),
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

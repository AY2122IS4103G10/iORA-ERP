package com.iora.erp.enumeration;

public enum ProcurementOrderFulfilmentStatus implements StatusEnum {
    PENDING("Awaiting fulfilment of Procurement Order."),
    CONFIRMED("Procurement Order is ready for shipping."),
    SHIPPED("Stock has been shipped to warehouse"),
    VERIFIED("Warehouse has verified the Procurement Order Fulfilment"),
    COMPLETED("Procurement Order has been fulfilled"),
    CANCELLED("Procurement Order has been cancelled");

    private String description;

    private ProcurementOrderFulfilmentStatus(String description) {
        this.description = description;
    }

    @Override
    public String getDescription() {
        return this.description;
    }
}

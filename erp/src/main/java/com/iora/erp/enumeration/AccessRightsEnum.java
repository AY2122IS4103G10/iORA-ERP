package com.iora.erp.enumeration;

public enum AccessRightsEnum {
    SYSADMIN_BASIC("Can manage all other aspects of admin subsystem"),
    SYSADMIN_EMPLOYEE("Can manage employees and job titles"),
    SYSADMIN_COMPANY("Can manage companies, departments, sites, vendors"),
    MARKETING_BASIC("Can access and use the Sales and Marketing subsystem"),
    MARKETING_MERCHANDISE("Can manage models, products, items, promotions, and vouchers"),
    MARKETING_PROCUREMENT("Can manage procurement orders"),
    MARKETING_CRM("Can access CRM module"),
    MANUFACTURING_BASIC("Can access and use the Manufacturing subsystem"),
    WAREHOUSE_BASIC("Can access and use the Warehouse subsystem"),
    WAREHOUSE_ORDER("Can manage procurement and stock transfer orders/requests"),
    STORE_BASIC("Can access and use the Store subsystem"),
    STORE_INVENTORY("Can manage stock levels and online order pickup");

    private String description;

    private AccessRightsEnum(String description) {
        this.description = description;
    }

    public String getDescription() {
        return this.description;
    }
}

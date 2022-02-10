package com.iora.erp.model.site;

import javax.persistence.Entity;

@Entity
public class ManufacturingSite extends Site {
    
    public ManufacturingSite(String name, String address, double latitude, double longitude, String siteCode) {
        super(name, address, latitude, longitude, siteCode);
    }
}

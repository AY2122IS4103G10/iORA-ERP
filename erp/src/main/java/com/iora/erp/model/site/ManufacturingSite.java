package com.iora.erp.model.site;

import javax.persistence.Entity;

@Entity
public class ManufacturingSite extends Site {

    public ManufacturingSite() {
    }
    
    public ManufacturingSite(String name, String address, double latitude, double longitude, String siteCode) {
        super(name, address, latitude, longitude, siteCode);
    }

    public ManufacturingSite(Site site) {
        super(site.getName(), site.getAddress(), site.getLatitude(), site.getLongitude(), site.getSiteCode());
    }
}

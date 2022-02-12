package com.iora.erp.model.site;

import javax.persistence.Entity;

@Entity
public class HeadquartersSite extends Site {

    public HeadquartersSite() {
    }
    
    public HeadquartersSite(String name, String address, double latitude, double longitude, String siteCode) {
        super(name, address, latitude, longitude, siteCode);
    }

    public HeadquartersSite(Site site) {
        super(site.getName(), site.getAddress(), site.getLatitude(), site.getLongitude(), site.getSiteCode());
    }
}

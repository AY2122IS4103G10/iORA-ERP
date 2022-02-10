package com.iora.erp.model.site;

import javax.persistence.Entity;

@Entity
public class StoreSite extends Site {
    
    public StoreSite(String name, String address, double latitude, double longitude, String siteCode) {
        super(name, address, latitude, longitude, siteCode);
    }

    public StoreSite(Site site) {
        super(site.getName(), site.getAddress(), site.getLatitude(), site.getLongitude(), site.getSiteCode());
    }
}

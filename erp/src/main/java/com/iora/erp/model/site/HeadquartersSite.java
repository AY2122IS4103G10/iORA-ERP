package com.iora.erp.model.site;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity
public class HeadquartersSite extends Site {

    // The Headquarters' stock is only for inventory
    @OneToOne(cascade = CascadeType.ALL)
    private StockLevel inventory;
    
    public HeadquartersSite(String name, String address, double latitude, double longitude, String siteCode) {
        super(name, address, latitude, longitude, siteCode);
        this.inventory = new StockLevel(super.getId());
    }

    public HeadquartersSite(Site site) {
        super(site.getName(), site.getAddress(), site.getLatitude(), site.getLongitude(), site.getSiteCode());
        this.inventory = new StockLevel(super.getId());
    }
}

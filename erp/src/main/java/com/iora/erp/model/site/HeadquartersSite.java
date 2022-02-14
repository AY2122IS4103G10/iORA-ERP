package com.iora.erp.model.site;

import javax.persistence.Entity;

import com.iora.erp.model.company.Company;

@Entity
public class HeadquartersSite extends Site {

    public HeadquartersSite() {
    }
    
    public HeadquartersSite(String name, String address, double latitude, double longitude, String siteCode, Company company) {
        super(name, address, latitude, longitude, siteCode, company);
    }

    public HeadquartersSite(Site site) {
        super(site.getName(), site.getAddress(), site.getLatitude(), site.getLongitude(), site.getSiteCode(), site.getCompany());
    }
}

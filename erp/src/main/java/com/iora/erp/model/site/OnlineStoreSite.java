package com.iora.erp.model.site;

import javax.persistence.Entity;

import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;

@Entity
public class OnlineStoreSite extends Site {

    public OnlineStoreSite() {
    }
    
    public OnlineStoreSite(String name, Address address, double latitude, double longitude, String siteCode, Company company) {
        super(name, address, siteCode, company);
    }

    public OnlineStoreSite(Site site) {
        super(site.getName(), site.getAddress(), site.getSiteCode(), site.getCompany());
    }
}

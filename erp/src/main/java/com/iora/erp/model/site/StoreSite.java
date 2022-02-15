package com.iora.erp.model.site;

import javax.persistence.Entity;

import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;

@Entity
public class StoreSite extends Site {

    public StoreSite() {
    }
    
    public StoreSite(String name, Address address, double latitude, double longitude, String siteCode, Company company) {
        super(name, address, siteCode, company);
    }

    public StoreSite(Site site) {
        super(site.getName(), site.getAddress(), site.getSiteCode(), site.getCompany());
    }
}

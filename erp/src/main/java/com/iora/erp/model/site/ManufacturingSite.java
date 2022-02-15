package com.iora.erp.model.site;

import javax.persistence.Entity;

import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;

@Entity
public class ManufacturingSite extends Site {

    public ManufacturingSite() {
    }
    
    public ManufacturingSite(String name, Address address, String siteCode, Company company) {
        super(name, address, siteCode, company);
    }

    public ManufacturingSite(Site site) {
        super(site.getName(), site.getAddress(), site.getSiteCode(), site.getCompany());
    }
}

package com.iora.erp.model.site;

import javax.persistence.Entity;

import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;

@Entity
public class StoreSite extends Site {

    public StoreSite() {
    }
    
    public StoreSite(String name, Address address, String siteCode, String phoneNumber, Company company) {
        super(name, address, siteCode, phoneNumber, company);
    }

    public StoreSite(Site site) {
        super(site.getName(), site.getAddress(), site.getSiteCode(), site.getPhoneNumber(), site.getCompany());
    }
}

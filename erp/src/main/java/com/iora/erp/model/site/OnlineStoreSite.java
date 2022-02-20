package com.iora.erp.model.site;

import javax.persistence.Entity;

import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;

@Entity
public class OnlineStoreSite extends Site {

    public OnlineStoreSite() {
    }
    
    public OnlineStoreSite(String name, Address address, String siteCode, String phoneNumber, Company company) {
        super(name, address, siteCode, phoneNumber, company);
    }

    public OnlineStoreSite(Site site) {
        super(site.getName(), site.getAddress(), site.getSiteCode(), site.getPhoneNumber(), site.getCompany());
    }
}

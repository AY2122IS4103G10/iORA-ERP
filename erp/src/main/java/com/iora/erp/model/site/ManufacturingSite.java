package com.iora.erp.model.site;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.OneToMany;

import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;
import com.iora.erp.model.procurementOrder.ProcurementOrder;

@Entity
public class ManufacturingSite extends Site {

    @OneToMany(mappedBy = "manufacturing")
    private List<ProcurementOrder> procurementOrders;

    public ManufacturingSite() {
    }
    
    public ManufacturingSite(String name, Address address, String siteCode, String phoneNumber, Company company) {
        super(name, address, siteCode, phoneNumber, company);
        this.procurementOrders = new ArrayList<>();
    }

    public ManufacturingSite(Site site) {
        super(site.getName(), site.getAddress(), site.getSiteCode(), site.getPhoneNumber(), site.getCompany());
        this.procurementOrders = new ArrayList<>();
    }

    public List<ProcurementOrder> getProcurementOrders() {
        return this.procurementOrders;
    }

    public void setProcurementOrders(List<ProcurementOrder> procurementOrders) {
        this.procurementOrders = procurementOrders;
    }
}

package com.iora.erp.model.site;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;

import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;
import com.iora.erp.model.customerOrder.CustomerOrder;

@Entity
public class StoreSite extends Site {
    @OneToMany
    @JoinColumn(name = "storeSiteId")
    private List<CustomerOrder> customerOrders;

    public StoreSite() {
    }
    
    public StoreSite(String name, Address address, String siteCode, String phoneNumber, Company company) {
        super(name, address, siteCode, phoneNumber, company);
    }

    public StoreSite(Site site) {
        super(site.getName(), site.getAddress(), site.getSiteCode(), site.getPhoneNumber(), site.getCompany());
    } 

    public List<CustomerOrder> getCustomerOrders() {
        return this.customerOrders;
    }

    public void setCustomerOrders(List<CustomerOrder> customerOrders) {
        this.customerOrders = customerOrders;
    }
}

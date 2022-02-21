package com.iora.erp.model.site;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;

import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;
import com.iora.erp.model.customerOrder.OnlineOrder;

@Entity
public class OnlineStoreSite extends Site {
    @OneToMany
    @JoinColumn(name = "onlineStoreSiteId")
    private List<OnlineOrder> onlineOrders;

    public OnlineStoreSite() {
    }
    
    public OnlineStoreSite(String name, Address address, String siteCode, String phoneNumber, Company company) {
        super(name, address, siteCode, phoneNumber, company);
    }

    public OnlineStoreSite(Site site) {
        super(site.getName(), site.getAddress(), site.getSiteCode(), site.getPhoneNumber(), site.getCompany());
    }

    public List<OnlineOrder> getOnlineOrders() {
        return this.onlineOrders;
    }

    public void setOnlineOrders(List<OnlineOrder> onlineOrders) {
        this.onlineOrders = onlineOrders;
    }
}

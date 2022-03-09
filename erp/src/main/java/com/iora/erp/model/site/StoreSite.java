package com.iora.erp.model.site;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.OneToMany;

import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.OnlineOrder;

@Entity
public class StoreSite extends Site {
    @OneToMany
    private List<CustomerOrder> customerOrders;

    @OneToMany
    private List<OnlineOrder> pickupOrders;

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

    public void addCustomerOrder(CustomerOrder customerOrder) {
        this.customerOrders.add(customerOrder);
    }

    public List<OnlineOrder> getPickupOrders() {
        return this.pickupOrders;
    }

    public void setPickupOrders(List<OnlineOrder> pickupOrders) {
        this.pickupOrders = pickupOrders;
    }

    public void addPickupOrder(OnlineOrder pickupOrder) {
        this.pickupOrders.add(pickupOrder);
    }
}

package com.iora.erp.model.site;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;
import com.iora.erp.model.company.Notification;
import com.iora.erp.model.customerOrder.CustomerOrder;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Site implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToOne(cascade = CascadeType.ALL)
    private Address address;

    @Column(nullable = false, unique = true)
    private String siteCode;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private boolean active;

    @JsonBackReference
    @OneToOne(cascade = CascadeType.ALL)
    private StockLevel stockLevel;

    @ManyToOne
    private Company company;

    @JsonBackReference
    @OneToMany
    private List<CustomerOrder> customerOrders;

    @JsonIgnore
    @ElementCollection
    private List<Notification> notifications;

    protected Site() {
        this.stockLevel = new StockLevel();
        this.customerOrders = new ArrayList<>();
        this.notifications = new ArrayList<>();
    }

    public Site(String name, Address address, String siteCode, String phoneNumber, Company company) {
        this();
        this.name = name;
        this.address = address;
        this.siteCode = siteCode;
        this.phoneNumber = phoneNumber;
        this.company = company;
        this.active = true;
    }

    @Override
    public String toString() {
        return String.format("Site[id=%d, name='%s']", id, name);
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public String getSiteCode() {
        return siteCode;
    }

    public void setSiteCode(String siteCode) {
        this.siteCode = siteCode;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public StockLevel getStockLevel() {
        return this.stockLevel;
    }

    public void setStockLevel(StockLevel stockLevel) {
        this.stockLevel = stockLevel;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public List<CustomerOrder> getCustomerOrders() {
        return customerOrders;
    }

    public void setCustomerOrders(List<CustomerOrder> customerOrders) {
        this.customerOrders = customerOrders;
    }

    public void addCustomerOrder(CustomerOrder customerOrder) {
        this.customerOrders.add(customerOrder);
    }

    public List<Notification> getNotifications() {
        return this.notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public void addNotification(Notification notification) {
        this.notifications.add(notification);
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Site)) {
            return false;
        }
        Site site = (Site) o;
        return Objects.equals(id, site.id) && Objects.equals(name, site.name);
    }

}

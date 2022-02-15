package com.iora.erp.model.site;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.iora.erp.enumeration.Country;
import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Site implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Country country;

    @OneToOne(cascade = CascadeType.ALL)
    private Address address;

    @Column(nullable = false, unique = true)
    private String siteCode;

    @Column(nullable = false)
    private boolean active;

    @OneToOne(cascade = CascadeType.ALL)
    private StockLevel stockLevel;

    @ManyToOne
    private Company company;

    protected Site() {
    }

    public Site(String name, Address address, String siteCode, Company company) {
        this.name = name;
        this.address = address;
        this.siteCode = siteCode;
        this.company = company;
        this.stockLevel = new StockLevel();
    }

    @Override
    public String toString() {
        return String.format("Site[id=%d, name='%s'", id, name);
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

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public String getSiteCode() {
        return siteCode;
    }

    public void setSiteCode(String siteCode) {
        this.siteCode = siteCode;
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

}

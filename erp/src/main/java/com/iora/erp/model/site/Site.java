package com.iora.erp.model.site;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToOne;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

import com.iora.erp.enumeration.Country;

@MappedSuperclass
public class Site {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Country country;

    @Column(nullable = false)
    private String address;

    @Min(-90)
    @Max(90)
    private double latitude;

    @Min(-180)
    @Max(180)
    private double longitude;

    @Column(nullable = false, unique = true)
    private String siteCode;

    @Column(nullable = false)
    private boolean active;

    @OneToOne(cascade = CascadeType.ALL)
    private StockLevel stockLevel;

    protected Site() {
    }

    public Site(String name, String address, double latitude, double longitude, String siteCode) {
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.siteCode = siteCode;
        this.stockLevel = new StockLevel();
    }

    @Override
    public String toString() {
        return String.format(
                "Site[id=%d, name='%s', coordinates=(%d,%d)]",
                id, name, latitude, longitude);
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public String getCoordinates() {
        return String.format("(%d, %d)", latitude, longitude);
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
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

}

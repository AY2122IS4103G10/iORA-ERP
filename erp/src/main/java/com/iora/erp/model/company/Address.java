package com.iora.erp.model.company;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

import com.iora.erp.enumeration.Country;

@Entity
public class Address implements Serializable{
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Country country;
    @Column(nullable = false)
    private String city;
    @Column(nullable = false)
    private String building;
    private String state;
    @Column(nullable = false)
    private String unit;
    @Column(nullable = false)
    private String road;
    @Column(nullable = false)
    private String postalCode;
    @Column(nullable = false)
    private Boolean billing;
    @Min(-90)
    @Max(90)
    private double latitude;
    @Min(-180)
    @Max(180)
    private double longitude;

    public Address(String country, String city, String building, String state, String unit, String road, String postalCode,
            Boolean billing, double latitude, double longitude) {
        this.country = Country.valueOf(country.toUpperCase());
        this.city = city;
        this.building = building;
        this.state = state;
        this.unit = unit;
        this.road = road;
        this.postalCode = postalCode;
        this.billing = billing;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Address() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getRoad() {
        return this.road;
    }

    public void setRoad(String road) {
        this.road = road;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public Boolean getBilling() {
        return billing;
    }

    public void setBilling(Boolean billing) {
        this.billing = billing;
    }

    public double getLatitude() {
        return this.latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return this.longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getCoordinates() {
        return String.format("(%6f, %6f)", latitude, longitude);
    }

    @Override
    public String toString() {
        return "Address [id=" + id + "]";
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

}

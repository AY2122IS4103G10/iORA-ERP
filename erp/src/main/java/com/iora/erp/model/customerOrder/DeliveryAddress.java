package com.iora.erp.model.customerOrder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class DeliveryAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    private String street1;
    private String street2;
    private String city;
    private String zip;
    private String state;
    private String phone;

    public DeliveryAddress() {
    }

    public DeliveryAddress(String street1, String street2, String city, String zip, String state,
            String phone) {
        this.name = "home";
        this.street1 = street1;
        this.street2 = street2;
        this.city = city;
        this.zip = zip;
        this.state = state;
        this.phone = phone;
    }

    public DeliveryAddress(String name, String street1, String street2, String city, String zip, String state,
            String phone) {
        this.name = name;
        this.street1 = street1;
        this.street2 = street2;
        this.city = city;
        this.zip = zip;
        this.state = state;
        this.phone = phone;
    }

    public Long getId() {
        return id;
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

    public String getStreet1() {
        return street1;
    }

    public void setStreet1(String street1) {
        this.street1 = street1;
    }

    public String getStreet2() {
        return street2;
    }

    public void setStreet2(String street2) {
        this.street2 = street2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

}

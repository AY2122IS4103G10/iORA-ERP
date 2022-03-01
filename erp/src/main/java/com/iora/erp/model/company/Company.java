package com.iora.erp.model.company;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

@Entity
public class Company implements Serializable  {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String name;
    @Column(nullable = false, unique = true)
    private String registerNumber;
    @Column(nullable = false)
    private String telephone;
    @Column(nullable = false)
    private Boolean active;

    @ManyToOne
    private Address address;
    @ManyToMany
    private List<Department> departments;
    @ManyToMany
    private List<Vendor> vendors;

    public Company(String name, String registerNumber, String telephone) {
        this.name = name;
        this.registerNumber = registerNumber;
        this.telephone = telephone;
        this.active = true;
    }

    public Company(String name, String registerNumber, String telephone, Boolean active, Address address,
            List<Department> departments, List<Vendor> vendors) {
        this.name = name;
        this.registerNumber = registerNumber;
        this.telephone = telephone;
        this.active = active;
        this.address = address;
        this.departments = departments;
        this.vendors = vendors;
    }

    public Company(String name, String registerNumber, String telephone, Boolean active, Address address) {
        this.name = name;
        this.registerNumber = registerNumber;
        this.telephone = telephone;
        this.active = active;
        this.address = address;
    }

    public Company() {
    }


    @Override
    public String toString() {
        return "Company [id=" + id + "]";
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

    public String getRegisterNumber() {
        return registerNumber;
    }

    public void setRegisterNumber(String registerNumber) {
        this.registerNumber = registerNumber;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public List<Department> getDepartments() {
        return departments;
    }

    public void setDepartments(List<Department> departments) {
        this.departments = departments;
    }

    public List<Vendor> getVendors() {
        return vendors;
    }

    public void setVendors(List<Vendor> vendors) {
        this.vendors = vendors;
    }


}

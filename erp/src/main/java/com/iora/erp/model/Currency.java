package com.iora.erp.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import com.iora.erp.enumeration.CountryEnum;

@Entity
public class Currency {
    @Id
    private String code;
    @Column(nullable = false, unique = true)
    private String name;
    @Column(nullable = false)
    private CountryEnum country;

    public Currency() {
    }

    public Currency(String code, String name, CountryEnum country) {
        this.code = code;
        this.name = name;
        this.country = country;
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CountryEnum getCountry() {
        return this.country;
    }

    public void setCountry(CountryEnum country) {
        this.country = country;
    }

    @Override
    public String toString() {
        return this.code + "," + this.name;
    }
}

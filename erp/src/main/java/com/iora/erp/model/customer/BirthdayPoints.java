package com.iora.erp.model.customer;

import java.util.Map;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;

import com.iora.erp.model.Currency;

@Entity
public class BirthdayPoints {
    @Id
    private String name;
    @ElementCollection
    private Map<Currency,Integer> birthday;
    private int quota;
    private double multiplier;

    public BirthdayPoints() {
    }

    public BirthdayPoints(String name, Map<Currency,Integer> birthday, int quota, double multiplier) {
        this.name = name;
        this.birthday = birthday;
        this.multiplier = multiplier;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Map<Currency,Integer> getBirthday() {
        return this.birthday;
    }

    public void setBirthday(Map<Currency,Integer> birthday) {
        this.birthday = birthday;
    }

    public int getQuota() {
        return this.quota;
    }

    public void setQuota(int quota) {
        this.quota = quota;
    }

    public double getMultiplier() {
        return this.multiplier;
    }

    public void setMultiplier(double multiplier) {
        this.multiplier = multiplier;
    }
    
}

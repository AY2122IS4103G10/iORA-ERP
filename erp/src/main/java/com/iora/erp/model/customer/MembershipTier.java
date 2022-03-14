package com.iora.erp.model.customer;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class MembershipTier {
    @Id
    private String name;
    @Column(nullable = false)
    private double multiplier;
    @Column(nullable = false)
    private double minSpend;
    @ManyToOne
    private BirthdayPoints birthday;

    public MembershipTier() {
    }

    public MembershipTier(String name, double multiplier, double minSpend, BirthdayPoints birthday) {
        this.name = name;
        this.multiplier = multiplier;
        this.minSpend = minSpend;
        this.birthday = birthday;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getMultiplier() {
        return this.multiplier;
    }

    public void setMultiplier(double multiplier) {
        this.multiplier = multiplier;
    }

    public double getMinSpend() {
        return this.minSpend;
    }

    public void setMinSpend(double minSpend) {
        this.minSpend = minSpend;
    }

    public BirthdayPoints getBirthday() {
        return this.birthday;
    }

    public void setBirthday(BirthdayPoints birthday) {
        this.birthday = birthday;
    }
    
}

package com.iora.erp.model.customer;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import com.iora.erp.model.Currency;

@Entity
public class BirthdayPoints {
    @Id
    private String name;
    @OneToOne
    private Currency currency;
    @Column(nullable = false)
    private double birthdaySpend;
    @Column(nullable = false)
    private int quota;
    @Column(nullable = false)
    private double multiplier;

    public BirthdayPoints() {
    }

    public BirthdayPoints(String name, Currency currency, double birthdaySpend, int quota, double multiplier) {
        this.name = name;
        this.currency = currency;
        this.birthdaySpend = birthdaySpend;
        this.quota = quota;
        this.multiplier = multiplier;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQuota() {
        return this.quota;
    }

    public void setQuota(int quota) {
        this.quota = quota;
    }

    public Currency getCurrency() {
        return this.currency;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public double getBirthdaySpend() {
        return this.birthdaySpend;
    }

    public void setBirthdaySpend(double birthdaySpend) {
        this.birthdaySpend = birthdaySpend;
    }

    public double getMultiplier() {
        return this.multiplier;
    }

    public void setMultiplier(double multiplier) {
        this.multiplier = multiplier;
    }
    
}

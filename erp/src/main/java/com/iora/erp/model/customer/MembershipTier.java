package com.iora.erp.model.customer;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.iora.erp.model.Currency;
import com.iora.erp.model.CurrencyDeserializer;

@Entity
public class MembershipTier {
    @Id
    private String name;
    private double multiplier;
    @ElementCollection
    @JsonDeserialize(keyUsing = CurrencyDeserializer.class)
    private Map<Currency, Integer> threshold;
    @ManyToOne
    private BirthdayPoints birthday;

    public MembershipTier() {
        threshold = new HashMap<>();
    }

    public MembershipTier(String name, double multiplier, Map<Currency, Integer> threshold, BirthdayPoints birthday) {
        this.name = name;
        this.multiplier = multiplier;
        this.threshold = threshold;
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

    public Map<Currency, Integer> getThreshold() {
        return this.threshold;
    }

    public void setThreshold(Map<Currency, Integer> threshold) {
        this.threshold = threshold;
    }

    public BirthdayPoints getBirthday() {
        return this.birthday;
    }

    public void setBirthday(BirthdayPoints birthday) {
        this.birthday = birthday;
    }
}

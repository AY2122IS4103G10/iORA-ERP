package com.iora.erp.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonValue;

@Entity
public class Currency {
    @Id
    private String code;
    @Column(nullable = false, unique = true)
    private String name;

    public Currency() {
    }

    public Currency(String key) {
        String[] pair = key.split(",");
        this.code = pair[0];
        this.name = pair[1];
    }

    public Currency(String code, String name) {
        this.code = code;
        this.name = name;
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

    @Override
    @JsonValue
    public String toString() {
        return this.code + "," + this.name;
    }
}

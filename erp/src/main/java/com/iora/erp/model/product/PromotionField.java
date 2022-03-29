package com.iora.erp.model.product;

import java.util.List;
import java.util.Objects;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;

@Entity
public class PromotionField extends ProductField {
    private int quota;
    @ElementCollection
    private List<Double> coefficients;
    @ElementCollection
    private List<Double> constants;
    private boolean global = false;
    private boolean stackable = false;
    private boolean available = true;

    public PromotionField() {
        super();
    }

    public PromotionField(String fieldName, String fieldValue, int quota, List<Double> coefficients, List<Double> constants, boolean global, boolean stackable, boolean available) {
        super(fieldName, fieldValue);
        this.quota = quota;
        this.coefficients = coefficients;
        this.constants = constants;
        this.global = global;
        this.stackable = stackable;
        this.available = available;
    }

    public int getQuota() {
        return this.quota;
    }

    public void setQuota(int quota) {
        this.quota = quota;
    }

    public List<Double> getCoefficients() {
        return this.coefficients;
    }

    public void setCoefficients(List<Double> coefficients) {
        this.coefficients = coefficients;
    }

    public List<Double> getConstants() {
        return this.constants;
    }

    public void setConstants(List<Double> constants) {
        this.constants = constants;
    }

    public boolean isGlobal() {
        return this.global;
    }

    public boolean getGlobal() {
        return this.global;
    }

    public void setGlobal(boolean global) {
        this.global = global;
    }

    public boolean isStackable() {
        return this.stackable;
    }

    public boolean getStackable() {
        return this.stackable;
    }

    public void setStackable(boolean stackable) {
        this.stackable = stackable;
    }

    public boolean getAvailable() {
        return this.available;
    }

    public boolean isAvailable() {
        return this.available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof PromotionField)) {
            return false;
        }
        PromotionField promotionField = (PromotionField) o;
        return quota == promotionField.quota && Objects.equals(this.getFieldValue(), promotionField.getFieldValue());
    }

}

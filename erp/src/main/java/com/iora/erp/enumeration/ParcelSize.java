package com.iora.erp.enumeration;

public enum ParcelSize {
    EXTRA_SMALL_FLEX_PACKAGE(6.0, 6.0, 2.0, 5.0),
    SMALL_FLEX_PACKAGE(10.0, 8.0, 6.0, 30.0),
    MEDIUM_FLEX_PACKAGE(12.0, 10.0, 8.0, 40.0),
    MEDIUM_BOX(12.0, 10.0, 8.0, 55.0),
    LARGE_BOX(14.0, 10.0, 8.0, 70.0),
    EXTRA_LARGE_BOX(16.0, 14.0, 10.0, 110.0);

    private Double height;
    private Double width;
    private Double length;
    private Double weight;

    private ParcelSize(Double h, Double wid, Double l, Double wht) {
        this.height = h;
        this.width = wid;
        this.length = l;
        this.weight = wht;
    }

    public Double getHeight() {
        return this.height;
    }

    public Double getWidth() {
        return this.width;
    }

    public Double getLength() {
        return this.length;
    }

    public Double getWeight() {
        return this.weight;
    }
}

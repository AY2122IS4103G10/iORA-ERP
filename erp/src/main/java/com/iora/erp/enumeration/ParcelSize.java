package com.iora.erp.enumeration;

public enum ParcelSize {
    SATCHEL_500G_ATL_A5(3.0, 32.5, 20.5, 0.5),
    SATCHEL_1KG(4.0, 35.0, 28.5, 1.0),
    SATCHEL_3KG(9.0, 41.0, 32.5, 3.0),
    SATCHEL_5KG(8.0, 58.0, 43.0, 5.0);

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

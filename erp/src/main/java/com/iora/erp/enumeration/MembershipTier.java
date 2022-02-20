package com.iora.erp.enumeration;

public enum MembershipTier {
    // Tier ( Point Accumulation, RM Threshold, SGD Threshold)
    BASIC(0.00, 0, 0), SILVER(0.03, 500, 200), GOLD (0.05, 3000, 1000), DIAMOND (0.07, 7500, 2500);
    
    public double multiplier;
    public int rm;
    public int sgd;
    public static int birthdayCapRM = 500;
    public static int birthdayCapSGD = 200;

    MembershipTier(double multiplier, int rm, int sgd) {
        this.multiplier = multiplier;
        this.rm = rm;
        this.sgd = sgd;
    }
}

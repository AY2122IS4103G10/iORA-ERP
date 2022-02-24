package com.iora.erp.model.customer;

import java.io.Serializable;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.iora.erp.model.customerOrder.CustomerOrder;

@Entity
public class Customer implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String firstName;
    private String lastName;
    @Column(nullable = false, unique = true)
    private String email;
    @Temporal(TemporalType.DATE)
    private Date dob;
    private String contactNumber;
    private Integer membershipPoints;
    @ManyToOne
    private MembershipTier membershipTier;
    private Double storeCredit;
    @OneToMany(mappedBy = "customer")
    private List<CustomerOrder> orders;
    private Boolean availStatus;

    @Column(nullable = false)
    private String hashPass;
    @Column
    private String salt;

    public Customer() {
        membershipPoints = 0;
        storeCredit = 0.0;
    }

    public Customer(String firstName, String lastName, String email, Date dob, String contactNumber,
            MembershipTier membershipTier, String hashPass, String salt) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dob = dob;
        this.contactNumber = contactNumber;
        this.membershipPoints = 0;
        this.membershipTier = membershipTier;
        this.storeCredit = 0.0;
        this.salt = salt;
        this.hashPass = hashPass;
        this.availStatus = true;
    }

    public Customer(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String gethashPass() {
        return hashPass;
    }

    public void sethashPass(String password) {
        this.hashPass = password;
    }


    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Double getStoreCredit() {
        return storeCredit;
    }

    public void setStoreCredit(Double storeCredit) {
        this.storeCredit = storeCredit;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getDob() {
        return this.dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public Integer getMembershipPoints() {
        return membershipPoints;
    }

    public void setMembershipPoints(Integer membershipPoints) {
        this.membershipPoints = membershipPoints;
    }

    public MembershipTier getMembershipTier() {
        return this.membershipTier;
    }

    public void setMembershipTier(MembershipTier membershipTier) {
        this.membershipTier = membershipTier;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public List<CustomerOrder> getCustomerOrders() {
        return this.orders;
    }

    public void setCustomerOrders(List<CustomerOrder> orders) {
        this.orders = orders;
    }

    @Override
    public String toString() {
        return String.format(
                "Customer[id=%d, firstName='%s', lastName='%s']",
                id, firstName, lastName);
    }

    public Boolean getAvailStatus() {
        return availStatus;
    }

    public void setAvailStatus(Boolean availStatus) {
        this.availStatus = availStatus;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean authentication(String password2) {
        if (password2.equals(this.hashPass)) {
            return true;
        }
        return false;
    }

}
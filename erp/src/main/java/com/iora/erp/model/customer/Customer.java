package com.iora.erp.model.customer;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

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
    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    private LocalDate dob;
    @Column(nullable = false, unique = true)
    private String contactNumber;
    private Integer membershipPoints;
    @ManyToOne
    private MembershipTier membershipTier;
    private Double storeCredit;
    @OneToMany
    @JoinColumn(name = "customerId")
    private List<CustomerOrder> orders;
    private Boolean availStatus;

    @Column(nullable = false)
    private String password;

    public Customer() {
        this.membershipPoints = 0;
        this.storeCredit = 0.0;
        this.availStatus = true;
    }

    public Customer(String firstName, String lastName, String email, LocalDate dob, String contactNumber,
            MembershipTier membershipTier, String password) {
        this();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dob = dob;
        this.contactNumber = contactNumber;
        this.membershipTier = membershipTier;
        this.password = password;
    }

    public Customer(String firstName, String lastName) {
        this();
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
        return lastName;
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

    public LocalDate getDob() {
        return this.dob;
    }

    public void setDob(LocalDate dob) {
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

}
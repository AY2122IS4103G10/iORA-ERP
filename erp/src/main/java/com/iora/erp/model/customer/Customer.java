package com.iora.erp.model.customer;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.DeliveryAddress;

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
    private Date dob;
    @Column(nullable = false, unique = true)
    private String contactNumber;
    @Column(scale = 2)
    private Double membershipPoints;
    @OneToOne
    private DeliveryAddress address;
    @ManyToOne
    private MembershipTier membershipTier;
    @OneToMany
    @JoinColumn(name = "customerId")
    private List<CustomerOrder> orders;
    private Boolean availStatus;
    @JsonIgnoreProperties({"customer"})
    @OneToMany
    private List<SupportTicket> supportTickets;

    @Column(nullable = false)
    private String password;

    public Customer() {
        this.membershipPoints = 0.0;
        this.availStatus = true;
        this.supportTickets = new ArrayList<>();
    }

    public Customer(String firstName, String lastName, String email, Date dob, String contactNumber,
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

    public Customer(String firstName, String lastName, String email, Date dob, String contactNumber,
            MembershipTier membershipTier, Double membershipPoints, DeliveryAddress address) {
        this();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dob = dob;
        this.contactNumber = contactNumber;
        this.membershipTier = membershipTier;
        this.membershipPoints = membershipPoints;
        this.address = address;
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

    public Double getMembershipPoints() {
        return membershipPoints;
    }

    public void setMembershipPoints(Double membershipPoints) {
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

    public List<CustomerOrder> getOrders() {
        return this.orders;
    }

    public void setOrders(List<CustomerOrder> orders) {
        this.orders = orders;
    }

    public void addOrder(CustomerOrder order) {
        this.orders.add(order);
    }

    public List<SupportTicket> getSupportTickets() {
        return this.supportTickets;
    }

    public void setSupportTickets(List<SupportTicket> supportTickets) {
        this.supportTickets = supportTickets;
    }

    public void addSupportTicket(SupportTicket supportTicket) {
        this.supportTickets.add(supportTicket);
    }

    public void removeSupportTicket(SupportTicket supportTicket) {
        this.supportTickets.remove(supportTicket);
    }

    public DeliveryAddress getAddress() {
        return address;
    }

    public void setAddress(DeliveryAddress address) {
        this.address = address;
    }
}
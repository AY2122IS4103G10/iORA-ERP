package com.iora.erp.model.customer;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Customer implements Serializable {
  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column(nullable = false)
  private String firstName;
  private String lastName;
  @Column(nullable = false)
  private String email;
  private String contactNumber;
  private Integer membershipPoints;
  private Double storeCredit;

  @Column(nullable = false)
  private String passHash;
  @Column(nullable = false)
  private String salt;

  public Customer() {
    membershipPoints = 0;
    storeCredit = 0.0;
  }

  public Customer(String firstName, String lastName, String email, String contactNumber, Integer membershipPoints,
      Double storeCredit, String passHash, String salt) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.contactNumber = contactNumber;
    this.membershipPoints = membershipPoints;
    this.storeCredit = storeCredit;
    this.passHash = passHash;
    this.salt = salt;
  }

  public String getSalt() {
    return salt;
  }

  public void setSalt(String salt) {
    this.salt = salt;
  }

  public String getPassHash() {
    return passHash;
  }

  public void setPassHash(String passHash) {
    this.passHash = passHash;
  }

  public Customer(String firstName, String lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
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

  public Integer getMembershipPoints() {
    return membershipPoints;
  }

  public void setMembershipPoints(Integer membershipPoints) {
    this.membershipPoints = membershipPoints;
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

}
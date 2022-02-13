package com.iora.erp.model.customer;

import java.io.Serializable;
import java.math.BigInteger;
import java.security.MessageDigest;

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
  @Column(nullable = false, unique = true)
  private String email;
  private String contactNumber;
  private Integer membershipPoints;
  private Double storeCredit;
  private Boolean availStatus;

  @Column(nullable = false)
  private String hashPass;
  @Column(nullable = false)
  private String salt;

  public Customer() {
    membershipPoints = 0;
    storeCredit = 0.0;
  }

  public Customer(String firstName, String lastName, String email, String contactNumber, Integer membershipPoints,
      Double storeCredit, String pass, String salt, Boolean availStatus) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.contactNumber = contactNumber;
    this.membershipPoints = membershipPoints;
    this.storeCredit = storeCredit;
    this.hashPass = generateProtectedPassword(salt, pass);
    this.salt = salt;
    this.availStatus = availStatus;
  }

  private static String generateProtectedPassword(String passwordSalt, String plainPassword) {
    String generatedPassword;
    try {
      MessageDigest md = MessageDigest.getInstance("SHA-512");
      md.reset();
      md.update((passwordSalt + plainPassword).getBytes("utf8"));

      generatedPassword = String.format("%0128x", new BigInteger(1, md.digest()));
      return generatedPassword;
    } catch (Exception ex) {
      return null;
    }
  }

  public Boolean authentication(String authenticate) {
    String tryPassword;
    try {
      MessageDigest md = MessageDigest.getInstance("SHA-512");
      md.reset();
      md.update((this.salt + authenticate).getBytes("utf8"));

      tryPassword = String.format("%0128x", new BigInteger(1, md.digest()));

      if (tryPassword.equals(this.hashPass)) {
        return true;
      } else {
        return false;
      }
    } catch (Exception ex) {
      return false;
    }
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
    this.hashPass = generateProtectedPassword(this.salt, password);
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
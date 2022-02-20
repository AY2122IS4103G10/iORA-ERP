package com.iora.erp.model.company;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.iora.erp.enumeration.AccessRights;


@Entity
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name;
    private String email;
    private Double salary;
    @Column(nullable = false, unique = true)
    private String username;
    @Column(nullable = false)
    private String salt;
    @Column(nullable = false)
    private String hashPass;
    @Column(nullable = false)
    private Boolean availStatus;
    @Column(nullable = false)
    private String password;

    @ManyToOne(cascade = CascadeType.ALL)
    private JobTitle jobTitle;
    @ManyToOne(fetch = FetchType.EAGER)
    private Department department;

    public Employee() {
    }

    public Employee(String name, String email, Double salary, String username, String password, String salt, String hashPass,
            Boolean availStatus) {
        this.name = name;
        this.email = email;
        this.salary = salary;
        this.username = username;
        this.salt = salt;
        this.hashPass = generateProtectedPassword(salt, password);
        this.availStatus = availStatus;
    }

    private static String generateProtectedPassword(String salt, String password) {
        String generatedPassword;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            md.reset();
            md.update((salt + password).getBytes("utf8"));

            generatedPassword = String.format("%0129x", new BigInteger(1, md.digest()));
            return generatedPassword;
        } catch (Exception ex) {
            return null;
        }
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Boolean getAvailStatus() {
        return availStatus;
    }

    public void setAvailStatus(Boolean availStatus) {
        this.availStatus = availStatus;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Employee(String name, Double salary) {
        this.name = name;
        this.salary = salary;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public JobTitle getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(JobTitle jobTitle) {
        this.jobTitle = jobTitle;
    }

    @Override
    public String toString() {
        return "Employee[ id=" + id + " ]";
    }


    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getHashPass() {
        return hashPass;
    }

    public void setHashPass(String hashPass) {
        this.hashPass = hashPass;
    }


}

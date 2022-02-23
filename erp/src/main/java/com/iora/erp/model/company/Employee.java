package com.iora.erp.model.company;

import java.io.Serializable;
import java.math.BigInteger;
import java.security.MessageDigest;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.iora.erp.enumeration.PayType;

@Entity
public class Employee implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    private String password;
    @Column(nullable = false)
    private Boolean availStatus;
    @Enumerated
    private PayType payType;

    @ManyToOne(fetch = FetchType.EAGER)
    private JobTitle jobTitle;
    @ManyToOne(fetch = FetchType.EAGER)
    private Department department;
    @OneToOne(fetch = FetchType.EAGER)
    private Company company;


    public Employee(String name, String email, Double salary, String username, String password, Boolean availStatus,
            PayType payType, JobTitle jobTitle, Department department, Company company) {
        this.name = name;
        this.email = email;
        this.salary = salary;
        this.username = username;
        this.password = password;
        this.availStatus = availStatus;
        this.payType = payType;
        this.jobTitle = jobTitle;
        this.department = department;
        this.company = company;
    }

    public Employee() {
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

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public Employee(String name, Double salary) {
        this.name = name;
        this.salary = salary;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = generateProtectedPassword(this.salt, password);
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

    public PayType getPayType() {
        return payType;
    }

    public void setPayType(PayType payType) {
        this.payType = payType;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public boolean authentication(String password2) {
        if(generateProtectedPassword(this.salt, password2).equals(this.password)) {
            return true;
        }
        return false;
    }

}

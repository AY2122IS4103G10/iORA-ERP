package com.iora.erp.model.company;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;


@Entity
public class Employee implements Serializable{
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String email;
    private Double salary;
    @Column(nullable = false)
    private String username;
    @Column(nullable = false)
    private String hashPass;
    @Column(nullable = false)
    private String salt;
    @Column(nullable = false)
    private Boolean availStatus;

    @OneToOne(cascade = CascadeType.ALL)
    private JobTitle jobTitle;
    @ManyToOne(cascade = CascadeType.ALL)
    private Department department;

    public Employee() {
    }

    public Employee(String name, String email, Double salary, String username, String hashPass, String salt,
            Boolean availStatus) {
        this.name = name;
        this.email = email;
        this.salary = salary;
        this.username = username;
        this.hashPass = hashPass;
        this.salt = salt;
        this.availStatus = availStatus;
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

    public Long getId() {
        return id;
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

}

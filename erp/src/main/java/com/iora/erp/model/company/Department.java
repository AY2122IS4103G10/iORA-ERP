package com.iora.erp.model.company;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;


@Entity
public class Department implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String deptName;

    @ManyToMany
    private List<JobTitle> jobTitles;
   
    public Department() {
        this.jobTitles = new ArrayList<>();

    }

    public Department(String department) {
        this.deptName = department;
        this.jobTitles = new ArrayList<>();
    }

    public List<JobTitle> getJobTitles() {
        return jobTitles;
    }

    public void setJobTitles(List<JobTitle> jobTitles) {
        this.jobTitles = jobTitles;
    }

    public Long getId() {
        return id;
    }

    @Override
    public String toString() {
        return "Department [id=" + id + "]";
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }
}

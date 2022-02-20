package com.iora.erp.model.company;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.iora.erp.enumeration.AccessRights;

@Entity
public class Department implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // temporarily remove unique=true
    @Column(nullable = false)
    private String deptName;

    @OneToMany(cascade = CascadeType.ALL)
    private List<JobTitle> jobTitles;
   
    public Department() {
    }

    public Department(String department) {
        this.deptName = department;
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

    public String getDepartment() {
        return deptName;
    }

    public void setDepartment(String department) {
        this.deptName = department;
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

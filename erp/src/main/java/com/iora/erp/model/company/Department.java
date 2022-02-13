package com.iora.erp.model.company;

import java.io.Serializable;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class Department implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(nullable = false)
    private String deptName;

    @OneToMany
    private List<JobTitle> jobTitles;

    @OneToMany(mappedBy = "department")
    private List<Employee> employee;

    public Department() {
    }

    public Department(String department) {
        this.deptName = department;
    }

    public List<Employee> getEmployee() {
        return employee;
    }

    public void setEmployee(List<Employee> employee) {
        this.employee = employee;
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

package com.iora.erp.model.company;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.iora.erp.enumeration.AccessRights;
import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

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
    private Boolean availStatus;
    @JsonIgnore
    @Column(nullable = false)
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    @ManyToOne(cascade = CascadeType.ALL)
    private JobTitle jobTitle;
    @ManyToOne(fetch = FetchType.EAGER)
    private Department department;

    public Employee() {
    }

    public Employee(Long id, String name, String email, Double salary, String username, Boolean availStatus,
            JobTitle jobTitle, Department department, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.salary = salary;
        this.username = username;
        this.availStatus = availStatus;
        this.jobTitle = jobTitle;
        this.department = department;
        this.authorities = authorities;
    }

    public Employee(String name, String email, Double salary, String username, String hashPass, Boolean availStatus) {
        this.name = name;
        this.email = email;
        this.salary = salary;
        this.username = username;
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


    public static Employee build(Employee user) {
        List<GrantedAuthority> authorities = user.getJobTitle().getResponsibility().stream()
                .map(role -> new SimpleGrantedAuthority(role.toString())).collect(Collectors.toList());

        return new Employee(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getSalary(),
            user.getUsername(),
            user.getAvailStatus(),
            user.getJobTitle(),
            user.getDepartment(),
            authorities);

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

    public Set<AccessRights> getAccessRights() {
        Set<AccessRights> accessRights = new HashSet<>(department.getResponsibility());
        accessRights.addAll(jobTitle.getResponsibility());
        return accessRights;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
        this.authorities = authorities;
    }

    @Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		Employee user = (Employee) o;
		return Objects.equals(id, user.id);
	}

}

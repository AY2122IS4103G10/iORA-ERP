package com.iora.erp.model.company;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.iora.erp.enumeration.AccessRightsEnum;

@Entity
public class JobTitle implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;
    private String description;
    @ElementCollection
    private Set<AccessRightsEnum> responsibility;

    public JobTitle() {
        responsibility = new HashSet<>();
    }

    public JobTitle(String title, String description, Set<AccessRightsEnum> responsibility) {
        this.title = title;
        this.description = description;
        this.responsibility = responsibility;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "JobTitle [id=" + id + "]";
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<AccessRightsEnum> getResponsibility() {
        return this.responsibility;
    }

    public void setResponsibility(Set<AccessRightsEnum> responsibility) {
        this.responsibility = responsibility;
    }

}

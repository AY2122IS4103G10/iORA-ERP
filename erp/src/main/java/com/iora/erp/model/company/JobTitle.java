package com.iora.erp.model.company;

import java.io.Serializable;
import java.util.ArrayList;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import com.iora.erp.enumeration.AccessRights;

@Entity
public class JobTitle implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String title;
    private String description;
    private ArrayList<AccessRights> responsibility;
    
    public JobTitle() {
        responsibility = new ArrayList<>();
    }

    public JobTitle(String title, String description, ArrayList<AccessRights> responsibility) {
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

    public ArrayList<AccessRights> getresponsibility() {
        return responsibility;
    }

    public void setresponsibility(ArrayList<AccessRights> responsibility) {
        this.responsibility = responsibility;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return "JobTitle [id=" + id + "]";
    } 
}

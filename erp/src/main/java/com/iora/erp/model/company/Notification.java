package com.iora.erp.model.company;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Embeddable
public class Notification {
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeStamp;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false)
    private String message;

    public Notification() {
        this.timeStamp = new Date();
    }

    public Notification(String title, String message) {
        this();
        this.title = title;
        this.message = message;
    }

    public Date getTimeStamp() {
        return this.timeStamp;
    }

    public void setTimeStamp(Date timeStamp) {
        this.timeStamp = timeStamp;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

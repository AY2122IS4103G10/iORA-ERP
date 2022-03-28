package com.iora.erp.model.customer;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Embeddable
public class SupportTicketMsg {

    @Temporal(TemporalType.TIMESTAMP)
    private Date timeStamp;
    @Column(nullable = false)
    private String message;
    @Column(nullable = false)
    private String name;
    private String imageUrl;

    public SupportTicketMsg() {
        this.timeStamp = new Date();
    }

    public SupportTicketMsg(String message, String name, String imageUrl) {
        this();
        this.message = message;
        this.name = name;
        this.imageUrl = imageUrl;
    }

    public Date getTimeStamp() {
        return this.timeStamp;
    }

    public void setTimeStamp(Date timeStamp) {
        this.timeStamp = timeStamp;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}

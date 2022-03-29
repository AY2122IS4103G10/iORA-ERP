package com.iora.erp.service;

import javax.mail.MessagingException;

import com.iora.erp.model.company.Employee;
import com.iora.erp.model.customer.Customer;

public interface EmailService {
    public abstract void sendSimpleMessage(String to, String subject, String text);
    public abstract void sendMessageWithAttachment(String to, String subject, String text, String pathToAttachment) throws MessagingException;

    public abstract void sendTemporaryPassword(Employee employee, String tempPassword);
    public abstract void sendCustomerPassword(Customer customer, String tempPassword);
}

package com.iora.erp.service;

import com.iora.erp.model.company.Employee;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customerOrder.OnlineOrder;

public interface EmailService {
    public abstract void sendSimpleMessage(String to, String subject, String text);

    public abstract void sendTemporaryPassword(Employee employee, String tempPassword);
    public abstract void sendCustomerPassword(Customer customer, String tempPassword);
    public abstract void sendOnlineOrderConfirmation(Customer customer, OnlineOrder order);
}

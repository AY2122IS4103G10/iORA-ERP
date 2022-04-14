package com.iora.erp.service;

import com.iora.erp.model.company.Employee;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customer.SupportTicket;
import com.iora.erp.model.customer.Voucher;
import com.iora.erp.model.customerOrder.OnlineOrder;

public interface EmailService {
    public abstract void sendSimpleHTMLMessage(String to, String subject, String name, String body);
    public abstract void sendTemporaryPassword(Employee employee, String tempPassword);

    public abstract void sendCustomerPassword(Customer customer, String tempPassword);

    public abstract void sendCustomerPasswordCreation(Customer customer, String tempPassword);

    public abstract void sendOnlineOrderConfirmation(Customer customer, OnlineOrder order);

    public abstract void sendOnlineOrderCancellation(Customer customer, OnlineOrder order);

    public abstract void sendVoucherCode(Customer customer, Voucher voucher);

    public abstract void sendTicketReply(Customer customer, SupportTicket supportTicket, String message);
}
package com.iora.erp.service;

import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import com.iora.erp.model.company.Employee;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customer.SupportTicket;
import com.iora.erp.model.customer.Voucher;
import com.iora.erp.model.customerOrder.OnlineOrder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.context.IContext;

@Component
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender emailSender;
    @Autowired
    private TemplateEngine templateEngine;

    private void sendHTMLMessage(String to, String subject, String templateName, IContext context) {
        MimeMessage msg = emailSender.createMimeMessage();
        String body = templateEngine.process(templateName, context);
        try {
            MimeMessageHelper helper = new MimeMessageHelper(msg, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED);
            helper.setFrom("iorasalesmail@gmail.com", "iORA Sales");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        emailSender.send(msg);
    }

    private void sendSimpleHTMLMessage(String to, String subject, String name, String agenda, String code,
            String text) {
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("agenda", agenda);
        context.setVariable("code", code);
        context.setVariable("text", text);
        sendHTMLMessage(to, subject, "simpleTemplate", context);
    }

    @Override
    public void sendTemporaryPassword(Employee employee, String tempPassword) {
        String text = "Please login and change your password immediately.";
        sendSimpleHTMLMessage(
                employee.getEmail(),
                "iORA ERP Temporary Password",
                employee.getUsername(),
                "temporary password",
                tempPassword,
                text);
    }

    @Override
    public void sendCustomerPassword(Customer customer, String tempPassword) {
        String text = "Please login and change your password immediately.";
        sendSimpleHTMLMessage(
                customer.getEmail(),
                "iORA Password Reset",
                customer.getLastName(),
                "temporary password",
                tempPassword,
                text);
    }

    @Override
    public void sendOnlineOrderConfirmation(Customer customer, OnlineOrder order) {
        Context context = new Context();
        context.setVariable("header", "Dear Customer, thank you for shopping at iORA!");
        context.setVariable("agenda", "You have successfully placed an order with us on ");
        context.setVariable("dateTime", order.getDateTime());
        context.setVariable("orderLineItems", order.getLineItems());
        context.setVariable("totalAmount", order.getTotalAmount());
        String subject = "Order Confirmation #" + order.getId();
        sendHTMLMessage(customer.getEmail(), subject, "orderConfirmTemplate", context);
    }

    @Override
    public void sendOnlineOrderCancellation(Customer customer, OnlineOrder order) {
        Context context = new Context();
        context.setVariable("header", "Dear Customer, we deeply regret to inform you that your order has been cancelled due to insufficient stocks. Payment(s) have been fully refunded to your card and it may take up to 10 working days to take effect.");
        context.setVariable("agenda", "Please email, call, or create a support ticket at https://iora.online/sg/ if you would like to contact us. Your order was previously placed on ");
        context.setVariable("dateTime", order.getDateTime());
        context.setVariable("orderLineItems", order.getLineItems());
        context.setVariable("totalAmount", order.getTotalAmount());
        String subject = "Order Confirmation #" + order.getId();
        sendHTMLMessage(customer.getEmail(), subject, "orderConfirmTemplate", context);
        
    }

    @Override
    public void sendVoucherCode(Customer customer, Voucher voucher) {
        String text = "Please redeem it any of our physical or online stores before the expiry date "
                + new SimpleDateFormat("yyyy-mm-dd").format(voucher.getExpiry());

        sendSimpleHTMLMessage(
                customer.getEmail(),
                "iORA Voucher Code", customer.getLastName(),
                "new $" + voucher.getAmount() + " voucher code",
                voucher.getVoucherCode(),
                text);
    }

    @Override
    public void sendTicketReply(Customer customer, SupportTicket supportTicket, String message) {
        String text = "Please login to iORA website to view / reply to this ticket";
        sendSimpleHTMLMessage(
                customer.getEmail(),
                "iORA Support Ticket Reply",
                customer.getLastName(),
                "Support Ticket #" + supportTicket.getId() + " new reply",
                message,
                text);
    }
}
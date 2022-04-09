package com.iora.erp.service;

import java.io.UnsupportedEncodingException;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.validation.MessageInterpolator.Context;

import com.iora.erp.model.company.Employee;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.AbstractContext;
import org.thymeleaf.context.IContext;

@Component
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Override
    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("iorasalesmail@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    public void sendHTMLMessage(String to, String subject, String templateName, IContext context) {
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

    @Override
    public void sendTemporaryPassword(Employee employee, String tempPassword) {
        sendSimpleMessage(
                employee.getEmail(),
                "Your iORA Account Details",
                "Hello " + employee.getName() + ", your login username is: " + employee.getUsername() + " and your temporary password is : "
                        + tempPassword + ". Please login and change your password immediately.");
    }

    @Override
    public void sendCustomerPassword(Customer customer, String tempPassword) {
        sendSimpleMessage(
        customer.getEmail(),
                "iORA Password Reset",
                "Hello " + customer.getLastName() + ", your new password is : "
                        + tempPassword + ". Please login and change your password immediately.");
    }

    @Override
    public void sendOnlineOrderConfirmation(Customer customer, OnlineOrder order) {
        org.thymeleaf.context.Context context = new org.thymeleaf.context.Context();
        context.setVariable("dateTime", order.getDateTime());
        context.setVariable("orderLineItems", order.getLineItems());
        context.setVariable("totalAmount", order.getTotalAmount());
        sendHTMLMessage(customer.getEmail(), "Order Confirmation", "orderConfirmTemplate", context);

        
    }
}
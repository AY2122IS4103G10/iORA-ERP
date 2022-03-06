package com.iora.erp.service;

import javax.mail.MessagingException;

public interface EmailService {
    public abstract void sendSimpleMessage(String to, String subject, String text);
    public abstract void sendMessageWithAttachment(String to, String subject, String text, String pathToAttachment) throws MessagingException;
}

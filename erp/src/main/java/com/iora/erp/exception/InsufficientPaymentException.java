package com.iora.erp.exception;

public class InsufficientPaymentException extends Exception{
    public InsufficientPaymentException() {
    }

    public InsufficientPaymentException(String msg) {
        super(msg);
    }
    
}

package com.iora.erp.exception;

public class NoStockLevelException extends Exception {
    public NoStockLevelException(String errorMessage) {
        super(errorMessage);
    }
}

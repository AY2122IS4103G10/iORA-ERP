package com.iora.erp.service;

import java.time.LocalDate;
import java.util.List;

import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.ExchangeLI;
import com.iora.erp.model.customerOrder.Payment;
import com.iora.erp.model.customerOrder.RefundLI;

public class CustomerOrderServiceImpl implements CustomerOrderService {

    @Override
    public CustomerOrder getCustomerOrder(Long id) throws CustomerOrderException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<CustomerOrder> searchCustomerOrderByDate(LocalDate date) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void createCustomerOrder(CustomerOrder customerOrder) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void updateCustomerOrder(CustomerOrder customerOrder) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public CustomerOrderLI getCustomerOrderLI(Long id) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<CustomerOrderLI> getAllCustomerOrderLIs() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void createCustomerOrderLI(CustomerOrderLI customerOrderLI) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void updateCustomerOrderLI(CustomerOrderLI customerOrderLI) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public Payment getPayment(Long id) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<Payment> getAllPayments() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void createPayment(Payment payment) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void updatePayment(Payment payment) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void getExchangeLI(Long id) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public List<ExchangeLI> getAllExchangeLIs() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void createExchangeLI(ExchangeLI exchangeLI) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void updateExchangeLI(ExchangeLI exchangeLI) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void getRefundLI(Long id) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public List<RefundLI> getAllRefundLIs() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void createRefundLI(RefundLI refundLI) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void updateRefundLI(RefundLI refundLI) {
        // TODO Auto-generated method stub
        
    }
    
}

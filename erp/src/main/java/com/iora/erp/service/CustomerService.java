package com.iora.erp.service;

import java.util.List;

import com.iora.erp.exception.CustomerException;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customer.MembershipTier;
import com.iora.erp.model.customer.Voucher;

public interface CustomerService {
    public abstract Customer createCustomerAccount(Customer customer) throws CustomerException;
    public abstract Customer updateCustomerAccount(Customer customer) throws CustomerException;
    public abstract void blockCustomer(Customer customer) throws CustomerException;
    public abstract void unblockCustomer(Customer customer) throws CustomerException;
    public abstract List<Customer> listOfCustomer();
    public abstract List<Customer> getCustomerByFields(String search);
    public abstract Customer getCustomerById(Long id) throws CustomerException;
    public abstract Customer getCustomerByEmail(String email) throws CustomerException;
    public abstract Customer getCustomerByPhone(String phone) throws CustomerException;

    public abstract Customer loginAuthentication(String email, String password) throws CustomerException;

    public abstract Voucher getVoucher(String voucherCode) throws CustomerException;
    public abstract List<Voucher> generateVouchers(double amount, int qty, String date);
    public abstract List<Voucher> getAllVouchers();
    public abstract List<Voucher> getAvailableVouchersByAmount(double amount);
    public abstract void deleteVoucher(String voucherCode) throws CustomerException;
    public abstract Voucher issueVoucher(String voucherCode) throws CustomerException;
    public abstract Voucher redeemVoucher(String voucherCode) throws CustomerException;

    public abstract List<MembershipTier> listOfMembershipTier();
    public abstract MembershipTier findMembershipTierById(String name);
    public abstract void createMembershipTier(MembershipTier membershipTier);
}

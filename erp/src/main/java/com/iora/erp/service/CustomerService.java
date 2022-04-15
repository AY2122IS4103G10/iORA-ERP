package com.iora.erp.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.RegistrationException;
import com.iora.erp.exception.SupportTicketException;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customer.MembershipTier;
import com.iora.erp.model.customer.SupportTicket;
import com.iora.erp.model.customer.Voucher;

public interface CustomerService {
    public abstract Customer createCustomerAccount(Customer customer) throws CustomerException, RegistrationException;

    public abstract Customer createCustomerAccountPOS(Customer customer)
            throws CustomerException, RegistrationException;

    public abstract Customer updateCustomerAccount(Customer customer) throws CustomerException;

    public abstract Customer updateCustomerPassword(Long customerId, String oldPassword, String newPassword)
            throws CustomerException;

    public abstract void blockCustomer(Customer customer) throws CustomerException;

    public abstract void unblockCustomer(Customer customer) throws CustomerException;

    public abstract List<Customer> listOfCustomer();

    public abstract List<Customer> getCustomerByFields(String search);

    public abstract Customer getCustomerById(Long id) throws CustomerException;

    public abstract Customer getCustomerByEmail(String email) throws CustomerException;

    public abstract Customer getCustomerByPhone(String phone) throws CustomerException;

    public abstract Customer loginAuthentication(String email, String password) throws CustomerException;

    public abstract void resetPassword(Long id) throws CustomerException;

    public abstract Voucher getVoucher(String voucherCode) throws CustomerException;

    public abstract List<Voucher> generateVouchers(String campaign, double amount, Date expiry,
            List<Integer> customerIds, int qty) throws CustomerException;

    public abstract List<Voucher> getAllVouchers();

    public abstract List<Voucher> getVouchersOfCustomer(Long customerId) throws CustomerException;

    public abstract List<Voucher> getAvailableVouchersByAmount(double amount);

    public abstract List<Map<String, String>> getVouchersPerformance();

    public abstract void deleteVoucher(String voucherCode) throws CustomerException;

    public abstract Voucher issueVoucher(String voucherCode, Long customerId) throws CustomerException;

    public abstract List<Voucher> issueVouchers(String voucherCode, List<Long> customerIds) throws CustomerException;

    public abstract Voucher redeemVoucher(String voucherCode) throws CustomerException;

    public abstract Customer redeemPoints(String email, int amount) throws CustomerException;

    public abstract List<MembershipTier> listOfMembershipTier();

    public abstract MembershipTier findMembershipTierById(String name);

    public abstract MembershipTier createMembershipTier(MembershipTier membershipTier);

    public abstract void deleteMembershipTier(String name);

    public abstract SupportTicket getSupportTicket(Long id) throws SupportTicketException;

    public abstract List<SupportTicket> getAllSupportTickets();

    public abstract List<SupportTicket> getPublicSupportTickets();

    public abstract SupportTicket createSupportTicket(SupportTicket supportTicket) throws CustomerException;

    public abstract SupportTicket updateSupportTicket(SupportTicket supportTicket) throws SupportTicketException;

    public abstract SupportTicket resolveSupportTicket(Long id) throws SupportTicketException;

    public abstract SupportTicket replySupportTicket(Long id, String message, String name, String imageUrl)
            throws SupportTicketException;

    public abstract Long deleteSupportTicket(Long id) throws SupportTicketException;
}

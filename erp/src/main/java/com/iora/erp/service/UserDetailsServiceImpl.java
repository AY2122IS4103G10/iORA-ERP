package com.iora.erp.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.EmployeeException;
import com.iora.erp.model.company.Employee;
import com.iora.erp.model.customer.Customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("userDetailsServiceImpl")
@Transactional
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private CustomerService customerService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (username.contains("@")) {
            try {
                Customer customer = customerService.getCustomerByEmail(username);
                if (!customer.getAvailStatus()) {
                    throw new CustomerException("Customer blocked");
                }
                return new User(customer.getEmail(), customer.getPassword(),
                        List.of(new SimpleGrantedAuthority("CUSTOMER")));
            } catch (CustomerException ex) {
                throw new UsernameNotFoundException("Customer not found in the database");
            }
        } else {
            try {
                Employee employee = employeeService.getEmployeeByUsername(username);
                if (!employee.getAvailStatus()) {
                    throw new EmployeeException("Empployee blocked");
                }
                Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
                employee.getJobTitle().getResponsibility().forEach(accessRight -> {
                    authorities.add(new SimpleGrantedAuthority(accessRight.name()));
                });
                return new User(employee.getUsername(), employee.getPassword(), authorities);
            } catch (EmployeeException ex) {
                throw new UsernameNotFoundException("Employee not found in the database");
            }
        }
    }
}

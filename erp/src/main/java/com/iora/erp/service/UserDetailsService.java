package com.iora.erp.service;

import com.iora.erp.model.company.Employee;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserDetailsService {
    public Employee loadUserByUsername(String username) throws UsernameNotFoundException;
}

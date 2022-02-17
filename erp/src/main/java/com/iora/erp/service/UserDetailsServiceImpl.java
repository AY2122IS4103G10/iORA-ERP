package com.iora.erp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.iora.erp.Repostitory.UserRepository;
import com.iora.erp.model.company.Employee;
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	@Autowired
	UserRepository userRepository;

	@Override
	@Transactional
	public Employee loadUserByUsername(String username) throws UsernameNotFoundException {
		Employee user = userRepository.findByUsernameEmployee(username)
				.orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
		return Employee.build(user);
	}
}
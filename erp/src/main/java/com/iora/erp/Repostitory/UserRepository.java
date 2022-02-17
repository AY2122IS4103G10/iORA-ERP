package com.iora.erp.Repostitory;

import java.util.Optional;

import com.iora.erp.model.company.Employee;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUsernameEmployee(String username);
	Boolean existsByUsername(String username);
	Boolean existsByEmail(String email);
}

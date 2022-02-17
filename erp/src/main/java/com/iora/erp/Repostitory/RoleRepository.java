package com.iora.erp.Repostitory;

import java.util.Optional;

import com.iora.erp.model.company.JobTitle;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<JobTitle, Long> {
    Optional<JobTitle> findByTitle(JobTitle title);
}

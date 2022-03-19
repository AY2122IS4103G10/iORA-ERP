package com.iora.erp.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iora.erp.exception.AuthenticationException;
import com.iora.erp.exception.EmployeeException;
import com.iora.erp.model.company.Employee;
import com.iora.erp.security.JWTUtil;
import com.iora.erp.service.EmployeeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private EmployeeService employeeService;

    /*
     * ---------------------------------------------------------
     * A.1 Account
     * ---------------------------------------------------------
     */

    /* Deprecated
     @GetMapping(path = "/empLogin", produces = "application/json")
    public ResponseEntity<Object> employeeLogin(@RequestParam String username,
            @RequestParam String password) {
        try {
            return ResponseEntity.ok(employeeService.loginAuthentication(username,
                    password));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }
    */

    @GetMapping(path = "/refreshToken")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        try {
            DecodedJWT decodedJWT = JWTUtil.decodeHeader(authHeader);
            String username = decodedJWT.getSubject();
            Employee employee = employeeService.getEmployeeByUsername(username);
            String issuer = request.getRequestURL().toString();
            List<String> authorities = employee.getJobTitle().getResponsibility().stream().map(x -> x.name())
                    .collect(Collectors.toList());
            String accessToken = JWTUtil.generateAccessToken(username, issuer, authorities);
            String refreshToken = authHeader.substring("Bearer ".length());
            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", accessToken);
            tokens.put("refreshToken", refreshToken);
            tokens.put("username", employee.getUsername());
            response.setContentType("application/json");
            new ObjectMapper().writeValue(response.getOutputStream(), tokens);
        } catch (AuthenticationException e) {
            throw new RuntimeException("Refresh token is missing");
        } catch (EmployeeException | JWTVerificationException e) {
            response.setHeader("error", e.getMessage());
            response.setStatus(HttpStatus.FORBIDDEN.value());
            Map<String, String> error = new HashMap<>();
            error.put("errorMessage", e.getMessage());
            response.setContentType("application/json");
            new ObjectMapper().writeValue(response.getOutputStream(), error);
        }
    }

    @GetMapping(path = "/postLogin")
    public ResponseEntity<Object> postLogin(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        try {
            DecodedJWT decodedJWT = JWTUtil.decodeHeader(authHeader);
            String username = decodedJWT.getSubject();
            Employee employee = employeeService.getEmployeeByUsername(username);
            Employee out = new Employee(employee.getName(), employee.getEmail(), employee.getSalary(),
                    employee.getUsername(), "", employee.getAvailStatus(), employee.getPayType(),
                    employee.getJobTitle(), employee.getDepartment(), employee.getCompany());
            return ResponseEntity.ok(out);
        } catch (AuthenticationException e) {
            throw new RuntimeException("Refresh token is missing");
        } catch (EmployeeException | JWTVerificationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}

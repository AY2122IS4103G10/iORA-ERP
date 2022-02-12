package com.iora.erp.controller;

import java.net.URI;

import com.iora.erp.model.product.ProductField;
import com.iora.erp.service.ProductService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("sam")
public class SAMController {

    @Autowired
    private ProductService productService;

    @PostMapping(path="/productField", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createProductField(@RequestBody ProductField productField) {
        try {
            productService.createProductField(productField);

            URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(productField.getId())
            .toUri();
                
            return ResponseEntity.created(location).build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }

}

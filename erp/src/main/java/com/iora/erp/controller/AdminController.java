package com.iora.erp.controller;

import java.net.URI;
import java.util.List;

import com.iora.erp.enumeration.Country;
import com.iora.erp.model.site.Site;
import com.iora.erp.service.SiteService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("admin")
public class AdminController {

    @Autowired
    private SiteService siteService;

    // Employee/JobTitle/Department stuff here

    @PostMapping(path = "/addSite/{storeType}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> addSite(@RequestBody Site site, @PathVariable String storeType) {
        try {
            siteService.createSite(site, storeType);
            return ResponseEntity.ok("Site with site ID " + site.getId() + " is successfully created.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/editSite", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> editSite(@RequestBody Site site) {
        try {
            siteService.updateSite(site);

            URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(site.getId())
                    .toUri();

            return ResponseEntity.created(location).build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping(path = "/deleteSite")
    public ResponseEntity<Object> deleteSite(@RequestParam Long siteId) {
        try {
            siteService.deleteSite(siteId);

            return ResponseEntity.accepted().build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(path = "/viewSites", produces = "application/json")
    public List<? extends Site> viewSites(@RequestParam String country, @RequestParam String storeType) {

        if (country == "SINGAPORE" || country == "MALAYSIA" || country == "CHINA") {
            Country countryEnum = Country.valueOf(country.toUpperCase());
            switch (storeType) {
                case "Headquarters":
                    return siteService.getHeadquartersByCountry(countryEnum);

                case "Manufacturing":
                    return siteService.getManufacturingByCountry(countryEnum);

                case "OnlineStore":
                    return siteService.getOnlineStoresByCountry(countryEnum);

                case "Store":
                    return siteService.getStoresByCountry(countryEnum);

                case "Warehouse":
                    return siteService.getWarehousesByCountry(countryEnum);

                default:
                    return siteService.getSitesByCountry(countryEnum);
            }
        }

        switch (storeType) {
            case "Headquarters":
                return siteService.getAllHeadquarters();

            case "Manufacturing":
                return siteService.getAllManufacturing();

            case "OnlineStore":
                return siteService.getAllOnlineStores();

            case "Store":
                return siteService.getAllStores();

            case "Warehouse":
                return siteService.getAllWarehouses();

            default:
                return siteService.getAllSites();
        }
    }

    @GetMapping(path = "/viewSite", produces = "application/json")
    public Site viewSite(@RequestParam Long siteId) {
        try {
            return siteService.getSite(siteId);
        } catch (Exception e) {
            return null;
        }
    }
}
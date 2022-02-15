package com.iora.erp.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.site.Site;
import com.iora.erp.service.ProductService;
import com.iora.erp.service.SiteService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("sam")
public class SAMController {

    @Autowired
    private ProductService productService;
    @Autowired
    private SiteService siteService;

    /*
     * ---------------------------------------------------------
     * B.1 Product Management
     * ---------------------------------------------------------
     */

    // Returns ProductField instance with given fieldName
    @GetMapping(path = "/productField/{fieldName}", produces = "application/json")
    public ResponseEntity<Object> getProductField(@PathVariable String fieldName) {
        try {
            return ResponseEntity.ok(productService.getProductFieldByName(fieldName));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Creates new ProductField instance with given JSON body
    @PostMapping(path = "/productField", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createProductField(@RequestBody ProductField productField) {
        try {
            productService.createProductField(productField);
            return ResponseEntity.ok("Product field " + productField.getFieldName() + " is successfully created");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Retrieves all ProductField instances
    @GetMapping(path = "/productField", produces = "application/json")
    public List<ProductField> getAllProductFields() {
        return productService.getAllProductFields();
    }

    // Creates a new Model instance by supplying Model details in JSON body
    @PostMapping(path = "/model", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createModel(@RequestBody Model model) {
        try {
            productService.createModel(model);
            return ResponseEntity.ok("Model with model code " + model.getModelCode() + " is successfully created.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Creates multiple Product instances with given Model Code in URL,
    // and list of Colours and Sizes in JSON Body
    // JSON Body e.g.: { "colours": ["red", "black"] , "sizes": "["S", "M", "L",
    // "XL"] }
    // JSON BODY MUST BE IN THE CORRECT FORMAT: List<String> colours, List<String>
    // sizes
    // This method is designed to be used right after the createModel method above
    @PostMapping(path = "/product/{modelCode}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createProduct(@PathVariable String modelCode,
            @RequestBody Map<String, List<String>> body) {
        try {
            productService.createProduct(modelCode, body.get("colours"), body.get("sizes"));
            return ResponseEntity.ok("Multiple Products are successfully created and linked to Model " + modelCode);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/model/{modelCode}", produces = "application/json")
    public ResponseEntity<Object> getModel(@PathVariable String modelCode) {
        try {
            return ResponseEntity.ok(productService.getModel(modelCode));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/model", produces = "application/json")
    public List<Model> searchModelsByModelCode(@RequestParam(required = false) String modelCode) {
        return productService.searchModelsByModelCode(modelCode);
    }

    @GetMapping(path = "/model/name", produces = "application/json")
    public List<Model> searchModelsByName(@RequestParam(required = false) String name) {
        return productService.searchModelsByName(name);
    }

    @GetMapping(path = "/model/{fieldName}/{fieldValue}", produces = "application/json")
    public ResponseEntity<Object> getModelsByFieldValue(@PathVariable String fieldName,
            @PathVariable String fieldValue) {
        try {
            return ResponseEntity.ok(productService.getModelsByFieldValue(fieldName, fieldValue));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/model", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> updateModel(@RequestBody Model model) {
        try {
            productService.updateModel(model);
            return ResponseEntity.ok("Model with model code " + model.getModelCode() + " is successfully updated.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/product/{sku}", produces = "application/json")
    public ResponseEntity<Object> getProduct(@PathVariable String sku) {
        try {
            return ResponseEntity.ok(productService.getProduct(sku));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/product", produces = "application/json")
    public List<Product> searchProductsBySKU(@RequestParam(required = false) String sku) {
        return productService.searchProductsBySKU(sku);
    }

    @GetMapping(path = "/product/{modelCode}", produces = "application/json")
    public ResponseEntity<Object> getProductsByModel(@PathVariable String modelCode) {
        try {
            return ResponseEntity.ok(productService.getProductsByModel(modelCode));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/product/{fieldName}/{fieldValue}", produces = "application/json")
    public ResponseEntity<Object> getProductsByFieldValue(@PathVariable String fieldValue,
            @PathVariable String fieldName) {
        try {
            return ResponseEntity.ok(productService.getProductsByFieldValue(fieldName, fieldValue));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/product", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> updateProduct(@PathVariable Product product) {
        try {
            productService.updateProduct(product);
            return ResponseEntity.ok("Product with SKU code " + product.getsku() + " is successfully updated.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/productItem", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createProductItem(@RequestBody ProductItem productItem) {
        try {
            productService.createProductItem(productItem);
            return ResponseEntity.ok("ProductItem with RFID " + productItem.getRfid() + " is successfully created.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/productItem/{rfid}", produces = "application/json")
    public ResponseEntity<Object> getProductItem(@PathVariable String rfid) {
        try {
            return ResponseEntity.ok(productService.getProductItem(rfid));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/productItem/sku/{sku}", produces = "application/json")
    public ResponseEntity<Object> getProductItemByProduct(@PathVariable String sku) {
        try {
            return ResponseEntity.ok(productService.getProductItemsBySKU(sku));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/productItem", produces = "application/json")
    public List<ProductItem> searchProductItems(@RequestParam(required = false) String rfid) {
        return productService.searchProductItems(rfid);
    }

    @PutMapping(path = "/productItem/sell/{rfid}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> sellProductItem(@PathVariable String rfid,
            @RequestBody(required = false) Object body) {
        try {
            productService.sellProductItem(rfid);
            return ResponseEntity.ok("Product Item with RFID " + rfid.trim() + " is successfully marked as sold.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/productItem/return/{rfid}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> returnProductItem(@PathVariable String rfid,
            @RequestBody(required = false) Object body) {
        try {
            productService.returnProductItem(rfid);
            return ResponseEntity.ok("Product Item with RFID " + rfid.trim() + " is successfully marked as unsold.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /*
     * ---------------------------------------------------------
     * B.2 Inventory Management
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/viewSites", produces = "application/json")
    public List<? extends Site> viewSites(@RequestParam List<String> storeTypes, @RequestParam String country,
            @RequestParam String company) {
        return siteService.searchAllSites(storeTypes, country, company);
    }

    @GetMapping(path = "/viewSites/{storeType}", produces = "application/json")
    public List<? extends Site> viewSitesBySubclass(@PathVariable String storeType, @RequestParam String country,
            @RequestParam String company) {
        switch (storeType) {
            case "Headquarters":
                return siteService.searchHeadquarters(country, company);
            case "Manufacturing":
                return siteService.searchManufacturing(country, company);
            case "OnlineStore":
                return siteService.searchOnlineStores(country, company);
            case "Store":
                return siteService.searchStores(country, company);
            case "Warehouse":
                return siteService.searchWarehouses(country, company);
            default:
                return new ArrayList<>();
        }
    }
}
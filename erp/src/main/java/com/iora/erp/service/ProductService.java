package com.iora.erp.service;

import java.util.List;

import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.ProductItem;

public interface ProductService {
    public abstract void createProductField(ProductField productField);
    public abstract ProductField getProductField();
    public abstract List<ProductField> getAllProductFields();
    public abstract void addProductFieldValue(String name, String value);

    public abstract void createModel(Model model);
    public abstract Model getModel(String modelCode);
    public abstract List<Model> getAllModels();
    public abstract List<Model> getModelByFieldValue(String fieldName, String fieldValue);
    public abstract void updateModel(Model model);

    public abstract void createProduct(Product product);
    public abstract Product getProduct(String sku);
    public abstract List<Product> getAllProducts();
    public abstract List<Product> geProductsByModel(String modelCode);
    public abstract List<Product> getProductsByFieldValue(String fieldName, String fieldValue);
    public abstract void updateProduct(Product product);

    public abstract void createProductItem(ProductItem productItem);
    public abstract ProductItem getProductItem(String rfid);
    public abstract List<ProductItem> getProductItemsByProduct(String sku);
    public abstract void sellProductItem(String rfid);
}
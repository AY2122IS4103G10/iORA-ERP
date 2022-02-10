package com.iora.erp.service;

import java.util.List;

import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.ProductItem;

public class ProductServiceImpl implements ProductService {

    @Override
    public void createProductField(ProductField productField) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public ProductField getProductField() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<ProductField> getAllProductFields() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void addProductFieldValue(String name, String value) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void createModel(Model model) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public Model getModel(String modelCode) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<Model> getAllModels() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<Model> getModelByFieldValue(String fieldName, String fieldValue) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void updateModel(Model model) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void createProduct(Product product) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public Product getProduct(String sku) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<Product> getAllProducts() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<Product> geProductsByModel(String modelCode) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<Product> getProductsByFieldValue(String fieldName, String fieldValue) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void updateProduct(Product product) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void createProductItem(ProductItem productItem) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public ProductItem getProductItem(String rfid) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<ProductItem> getProductItemsByProduct(String sku) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void sellProductItem(String rfid) {
        // TODO Auto-generated method stub
        
    }
    
}

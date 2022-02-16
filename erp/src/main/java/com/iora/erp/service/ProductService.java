package com.iora.erp.service;

import java.util.List;

import com.iora.erp.exception.ModelException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.exception.ProductFieldException;
import com.iora.erp.exception.ProductItemException;
import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.product.PromotionField;

public interface ProductService {
    public abstract ProductField getProductFieldByName(String fieldName) throws ProductFieldException;
    public abstract ProductField getProductFieldByNameValue(String fieldName, String fieldValue) throws ProductFieldException;
    public abstract void createProductField(ProductField productField) throws ProductFieldException;
    public abstract List<ProductField> getAllProductFields();

    public abstract PromotionField getPromoField(String fieldName, String fieldValue, double discountedPrice) throws ProductFieldException;
    public abstract void addPromoCategory(String modelCode, String category, double discountedPrice) throws ModelException;

    public abstract void createModel(Model model) throws ModelException;
    public abstract Model getModel(String modelCode) throws ModelException;
    public abstract List<Model> searchModelsByModelCode(String modelCode);
    public abstract List<Model> searchModelsByName(String name);
    public abstract List<Model> getModelsByFieldValue(String fieldName, String fieldValue);
    public abstract List<Model> getModelsByFashionLineTag(String fashionLine, String tag);
    public abstract List<Model> getModelsByTag(String tag);
    public abstract List<Model> getModelsByCategory(String category);
    public abstract void updateModel(Model model) throws ModelException;

    public abstract void createProduct(String modelCode, List<String> colours, List<String> sizes, List<String> tags) throws ProductException;
    public abstract Product getProduct(String sku) throws ProductException;
    public abstract List<Product> searchProductsBySKU(String sku);
    public abstract List<Product> getProductsByModel(String modelCode) throws ProductException;
    public abstract List<Product> getProductsByFieldValue(String fieldName, String fieldValue);
    public abstract void updateProduct(Product product) throws ProductException;

    public abstract void createProductItem(ProductItem productItem) throws ProductItemException;
    public abstract ProductItem getProductItem(String rfid) throws ProductItemException;
    public abstract List<ProductItem> getProductItemsBySKU(String sku) throws ProductException;
    public abstract List<ProductItem> searchProductItems(String rfid);
    public abstract void sellProductItem(String rfid) throws ProductItemException;
    public abstract void returnProductItem(String rfid) throws ProductItemException;
}
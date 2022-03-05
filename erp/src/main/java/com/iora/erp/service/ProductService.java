package com.iora.erp.service;

import java.util.List;

import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.ModelException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.exception.ProductFieldException;
import com.iora.erp.exception.ProductItemException;
import com.iora.erp.model.Currency;
import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.product.PromotionField;

import org.json.JSONException;
import org.json.JSONObject;

public interface ProductService {
    public abstract List<String> getProductFieldValues(String fieldName) throws ProductFieldException;
    public abstract List<PromotionField> getPromotionFields();
    public abstract ProductField getProductFieldByNameValue(String fieldName, String fieldValue) throws ProductFieldException;
    public abstract String getProductFieldValue(Product product, String fieldName) throws ProductFieldException;
    public abstract ProductField createProductField(ProductField productField) throws ProductFieldException;
    public abstract ProductField createProductField(String name, String value);
    public abstract List<ProductField> getAllProductFields();
    
    public abstract PromotionField getPromoField(String fieldName, String fieldValue, double discountedPrice) throws ProductFieldException;
    public abstract PromotionField getPromoFieldOfModel(Model model) throws ProductFieldException;
    public abstract PromotionField createPromoField(PromotionField promotionField) throws ProductFieldException;
    public abstract PromotionField createPromoField(String fieldName, String fieldValue, double price);
    public abstract PromotionField updatePromoField(PromotionField promotionField) throws ProductFieldException;
    public abstract Model addPromoCategory(String modelCode, String category, double discountedPrice) throws ModelException;

    public abstract Model createModel(Model model) throws ModelException;
    public abstract Model getModel(String modelCode) throws ModelException;
    public abstract Model getModelByProduct(Product product) throws ModelException;
    public abstract List<Model> searchModelsByModelCode(String modelCode);
    public abstract List<Model> searchModelsByName(String name);
    public abstract List<Model> getModelsByPromoField(PromotionField promoField);
    public abstract List<Model> getModelsByFieldValue(String fieldName, String fieldValue);
    public abstract List<Model> getModelsByCompanyAndTag(String company, String tag);
    public abstract List<Model> getModelsByTag(String tag);
    public abstract List<Model> getModelsByCategory(String category);
    public abstract Model updateModel(Model model) throws ModelException;

    public abstract List<Product> createProduct(String modelCode, List<ProductField> productFields) throws ProductException, ProductFieldException;
    public abstract Product getProduct(String sku) throws ProductException;
    public abstract List<Product> searchProductsBySKU(String sku);
    public abstract List<Product> getProductsByModel(String modelCode) throws ProductException;
    public abstract List<Product> getProductsByFieldValue(String fieldName, String fieldValue);
    public abstract Product updateProduct(Product product) throws ProductException;

    public abstract ProductItem createProductItem(String rfid, String sku) throws ProductItemException;
    public abstract List<ProductItem> generateProductItems(String sku, int qty) throws ProductItemException;
    public abstract ProductItem getProductItem(String rfid) throws ProductItemException;
    public abstract List<ProductItem> getProductItemsBySKU(String sku) throws ProductException;
    public abstract List<ProductItem> searchProductItems(String rfid);
    public abstract void sellProductItem(String rfid) throws ProductItemException;
    public abstract void returnProductItem(String rfid) throws ProductItemException;

    public abstract JSONObject getProductCartDetails(String rfid) throws ProductItemException, ProductException, ModelException, JSONException, ProductFieldException;

    public abstract Currency getCurrency(String code);

    // Data Loading
    public abstract void loadProducts(List<Object> productsJSON) throws ProductException, ProductFieldException, ProductItemException, CustomerException;
}
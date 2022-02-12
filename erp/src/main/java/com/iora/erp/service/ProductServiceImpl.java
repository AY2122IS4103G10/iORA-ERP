package com.iora.erp.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import com.iora.erp.exception.ModelException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.exception.ProductFieldException;
import com.iora.erp.exception.ProductItemException;
import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.ProductItem;

import org.hibernate.NonUniqueResultException;
import org.springframework.stereotype.Service;

@Service("productServiceImpl")
public class ProductServiceImpl implements ProductService {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void createProductField(ProductField productField) throws ProductFieldException {
        try {
            em.persist(productField);
        } catch (EntityExistsException ex) {
            throw new ProductFieldException("Product Field with this name has already been created.");
        }
    }

    @Override
    public ProductField getProductField(String name) throws ProductFieldException {
        Query q = em.createQuery("SELECT pf FROM ProductField pf WHERE " + "LOWER(pf.name) LIKE :fieldName");
        q.setParameter("fieldName", name);

        try {
            ProductField pf = (ProductField) q.getSingleResult();
            return pf;
        } catch (NoResultException | NonUniqueResultException ex) {
            throw new ProductFieldException("Field name " + name + " does not exist.");
        }
    }

    @Override
    public List<String> getProductFieldValues(String name) throws ProductFieldException {
        Query q = em.createQuery("SELECT pf FROM ProductField pf WHERE " + "LOWER(pf.name) LIKE :fieldName");
        q.setParameter("fieldName", name);

        try {
            ProductField pf = (ProductField) q.getSingleResult();
            return pf.getValues();
        } catch (NoResultException | NonUniqueResultException ex) {
            throw new ProductFieldException("Field name " + name + " does not exist.");
        }
    }

    @Override
    public List<ProductField> getAllProductFields() {
        TypedQuery<ProductField> q = em.createQuery("SELECT * FROM ProductField", ProductField.class);
        return q.getResultList();
    }

    @Override
    public void addProductFieldValue(String name, String value) throws ProductFieldException {
        ProductField pf = getProductField(name);
        ArrayList<String> values = pf.getValues();

        if (values.contains(value)) {
            throw new ProductFieldException("Value already exist in this field.");
        }

        values.add(value);
        pf.setValues(values);
        em.merge(pf);
    }

    @Override
    public void createModel(Model model) throws ModelException {
        try {
            em.persist(model);
        } catch (EntityExistsException ex) {
            throw new ModelException("Model with model code " + model.getModelCode() + " already exist.");
        }
    }

    @Override
    public Model getModel(String modelCode) throws ModelException {
        Model model = em.find(Model.class, modelCode);

        if (model == null) {
            throw new ModelException("Model with model code " + modelCode + " does not exist.");
        } else {
            return model;
        }
    }

    @Override
    public List<Model> searchModelsByModelCode(String modelCode) {
        TypedQuery<Model> q;
        if (modelCode != null) {
            q = em.createQuery("SELECT m FROM Model m WHERE LOWER(m.modelCode) LIKE :modelCode", Model.class);
            q.setParameter("modelCode", "%" + modelCode.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT * FROM Model", Model.class);
        }

        return q.getResultList();
    }

    @Override
    public List<Model> searchModelsByName(String name) {
        TypedQuery<Model> q;
        if (name != null) {
            q = em.createQuery("SELECT m FROM Model m WHERE LOWER(m.name) LIKE :name", Model.class);
            q.setParameter("name", "%" + name.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT * FROM Model", Model.class);
        }

        return q.getResultList();
    }

    @Override
    public List<Model> getModelsByFieldValue(String fieldName, String fieldValue) throws ModelException {
        if (fieldName == null || fieldValue == null) {
            throw new ModelException("Field name and value cannot be null.");
        }

        fieldName = fieldName.trim();
        fieldValue = fieldValue.trim();

        TypedQuery<Model> q;
        q = em.createQuery(
                "SELECT m FROM Model m, IN (m.productFields) pfield WHERE pfield.name = :name AND pfield.value = :value",
                Model.class);
        q.setParameter("name", fieldName);
        q.setParameter("value", fieldValue);

        return q.getResultList();
    }

    @Override
    public void updateModel(Model model) throws ModelException {
        Model old = em.find(Model.class, model.getModelCode());

        if (old == null) {
            throw new ModelException("Model not found");
        }

        old.setDescription(model.getDescription());
        old.setFashionLine(model.getFashionLine());
        old.setAvailable(model.isAvailable());
        old.setName(model.getName());
        old.setOnlineOnly(model.isOnlineOnly());
        old.setPrice(model.getPrice());
        old.setProductFields(model.getProductFields());
        old.setProducts(model.getProducts());
    }

    @Override
    public void createProduct(Product product) throws ProductException {
        try {
            em.persist(product);
        } catch (EntityExistsException ex) {
            throw new ProductException("Product with SKU code " + product.getsku() + " already exist.");
        }
    }

    @Override
    public Product getProduct(String sku) throws ProductException {
        Product product = em.find(Product.class, sku);

        if (product == null) {
            throw new ProductException("Product with the SKU " + sku + " already exist.");
        } else {
            return product;
        }
    }

    @Override
    public List<Product> searchProductsBySKU(String sku) {
        TypedQuery<Product> q;
        if (sku != null) {
            q = em.createQuery("SELECT p FROM Product p WHERE LOWER(p.sku) LIKE :sku", Product.class);
            q.setParameter("sku", "%" + sku.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT * FROM Product", Product.class);
        }

        return q.getResultList();
    }

    @Override
    public List<Product> getProductsByModel(String modelCode) throws ProductException {
        if (modelCode == null) {
            throw new ProductException("Model Code is invalid.");
        }
        modelCode = modelCode.trim();
        TypedQuery<Product> q;
        q = em.createQuery("SELECT p FROM Model m, IN (m.products) p WHERE m.modelCode = modelCode", Product.class);
        return q.getResultList();
    }

    @Override
    public List<Product> getProductsByFieldValue(String fieldName, String fieldValue) throws ProductException {
        if (fieldName == null || fieldValue == null) {
            throw new ProductException("Field name and value cannot be null.");
        }

        fieldName = fieldName.trim();
        fieldValue = fieldValue.trim();

        TypedQuery<Product> q;
        q = em.createQuery(
                "SELECT p FROM Product p, IN (p.productFields) pfield WHERE pfield.name = :name AND pfield.value = :value",
                Product.class);
        q.setParameter("name", fieldName);
        q.setParameter("value", fieldValue);

        return q.getResultList();
    }

    @Override
    public void updateProduct(Product product) throws ProductException {
        Product old = em.find(Product.class, product.getsku());

        if (old == null) {
            throw new ProductException("Product not found");
        }

        old.setProductItems(product.getProductItems());
    }

    @Override
    public void createProductItem(ProductItem productItem) throws ProductItemException {
        try {
            em.persist(productItem);
        } catch (EntityExistsException ex) {
            throw new ProductItemException("ProductItem with rfid " + productItem.getRfid() + " already exist.");
        }
    }

    @Override
    public ProductItem getProductItem(String rfid) throws ProductItemException {
        ProductItem pi = em.find(ProductItem.class, rfid);

        if (pi == null) {
            throw new ProductItemException("ProductItem not found");
        } else {
            return pi;
        }
    }

    @Override
    public List<ProductItem> getProductItemsByProduct(String sku) throws ProductException {
        Product p = getProduct(sku);
        return p.getProductItems();
    }

    @Override
    public List<ProductItem> searchProductItems(String rfid) {
        TypedQuery<ProductItem> q;

        if (rfid != null) {
            q = em.createQuery("SELECT pi FROM ProductItem pi WHERE LOWER(pi.rfid) LIKE :rfid", ProductItem.class);
            q.setParameter("rfid", "%" + rfid.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT * FROM ProductItem", ProductItem.class);
        }

        return q.getResultList();
    }

    @Override
    public void sellProductItem(String rfid) throws ProductItemException {
        ProductItem pi = getProductItem(rfid);
        pi.setAvailable(false);
    }

    @Override
    public void returnProductItem(String rfid) throws ProductItemException {
        ProductItem pi = getProductItem(rfid);
        pi.setAvailable(true);
    }
}

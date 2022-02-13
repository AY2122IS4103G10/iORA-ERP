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
import org.springframework.transaction.annotation.Transactional;

@Service("productServiceImpl")
@Transactional
public class ProductServiceImpl implements ProductService {

    @PersistenceContext
    private EntityManager em;

    @Override
    public ProductField getProductFieldByName(String fieldName) throws ProductFieldException {
        Query q = em.createQuery("SELECT pf FROM ProductField pf WHERE LOWER(pf.fieldName) LIKE :fieldName");
        q.setParameter("fieldName", "%" + fieldName.toLowerCase() + "%");

        try {
            ProductField pf = (ProductField) q.getSingleResult();
            return pf;
        } catch (NoResultException | NonUniqueResultException ex) {
            throw new ProductFieldException("Field name " + fieldName + " does not exist.");
        }
    }

    @Override
    public ProductField getProductFieldByNameValue(String fieldName, String fieldValue) throws ProductFieldException {
        Query q = em.createQuery(
                "SELECT pf FROM ProductField pf WHERE LOWER(pf.fieldName) LIKE :fieldName AND LOWER(pf.fieldValue) LIKE :fieldValue");
        q.setParameter("fieldName", fieldName.trim().toLowerCase());
        q.setParameter("fieldValue", fieldValue.trim().toLowerCase());

        try {
            ProductField pf = (ProductField) q.getSingleResult();
            return pf;
        } catch (NoResultException | NonUniqueResultException ex) {
            throw new ProductFieldException("Field name " + fieldName + " does not exist.");
        }
    }

    @Override
    public void createProductField(ProductField productField) throws ProductFieldException {
        try {
            productField.setFieldName(productField.getFieldName().trim());
            productField.setFieldValue(productField.getFieldValue().trim());
            getProductFieldByNameValue(productField.getFieldName(), productField.getFieldValue());
        } catch (ProductFieldException ex) {
            em.persist(productField);
            return;
        }
        throw new ProductFieldException("Product Field with name " + productField.getFieldName() + " and value "
                + productField.getFieldValue() + " already exist.");
    }

    @Override
    public List<ProductField> getAllProductFields() {
        TypedQuery<ProductField> q = em.createQuery("SELECT pf FROM ProductField pf", ProductField.class);
        return q.getResultList();
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
    public void createProduct(String modelCode, List<String> colours, List<String> sizes) throws ProductException {
        try {
            Model model = getModel(modelCode);
            List<Product> products = new ArrayList<>();
            int count = 1;

            for (int i = 0; i < colours.size(); i++) {
                for (int j = 0; j < sizes.size(); j++) {
                    Product p = new Product(modelCode + "-" + count);

                    try {
                        ProductField colourField = getProductFieldByNameValue("colour", colours.get(i));
                        // ProductField already exist, link it to product
                        p.addProductField(colourField);
                        model.addProductField(colourField);
                    } catch (ProductFieldException ex) {
                        // ProductField does not exist, creates new one before linking to product
                        ProductField newField = new ProductField();
                        newField.setFieldName("colour");
                        newField.setFieldValue(colours.get(i));
                        createProductField(newField);
                        p.addProductField(newField);
                        model.addProductField(newField);
                    }

                    try {
                        ProductField sizeField = getProductFieldByNameValue("size", sizes.get(j));
                        // ProductField already exist, link it to product
                        p.addProductField(sizeField);
                        model.addProductField(sizeField);
                    } catch (ProductFieldException ex) {
                        // ProductField does not exist, creates new one before linking to product
                        ProductField newField = new ProductField();
                        newField.setFieldName("size");
                        newField.setFieldValue(sizes.get(j));
                        createProductField(newField);
                        p.addProductField(newField);
                        model.addProductField(newField);
                    }

                    em.persist(p);
                    products.add(p);
                    count++;
                }
            }

            model.setProducts(products);

        } catch (ModelException ex) {
            throw new ProductException("Model with model code " + modelCode + " does not exist.");
        } catch (EntityExistsException ex) {
            throw new ProductException("Product was already created.");
        } catch (ProductFieldException ex) {
            throw new ProductException(ex.getMessage());
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
            q = em.createQuery("SELECT m FROM Model m", Model.class);
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
            q = em.createQuery("SELECT m FROM Model m", Model.class);
        }

        return q.getResultList();
    }

    @Override
    public List<Model> getModelsByFieldValue(String fieldName, String fieldValue) {
        try {
            if (fieldName == null || fieldValue == null) {
                return null;
            }

            fieldName = fieldName.trim();
            fieldValue = fieldValue.trim();
            ProductField productField = getProductFieldByNameValue(fieldName, fieldValue);

            TypedQuery<Model> q;
            q = em.createQuery(
                    "SELECT DISTINCT m FROM Model m WHERE :productField MEMBER OF m.productFields",
                    Model.class);
            q.setParameter("productField", productField);

            return q.getResultList();
        } catch (ProductFieldException ex) {
            return null;
        }
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
    public Product getProduct(String sku) throws ProductException {
        Product product = em.find(Product.class, sku);

        if (product == null) {
            throw new ProductException("Product with the SKU " + sku + " cannot be found.");
        } else {
            return product;
        }
    }

    @Override
    public List<Product> searchProductsBySKU(String sku) {
        TypedQuery<Product> q;
        sku = sku.trim();
        if (sku != null) {
            q = em.createQuery("SELECT p FROM Product p WHERE LOWER(p.sku) LIKE :sku", Product.class);
            q.setParameter("sku", "%" + sku.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT p FROM Product p", Product.class);
        }

        return q.getResultList();
    }

    @Override
    public List<Product> getProductsByModel(String modelCode) throws ProductException {
        try {
            Model model = getModel(modelCode.trim());
            return model.getProducts();
        } catch (ModelException ex) {
            throw new ProductException(ex.getMessage());
        }
    }

    @Override
    public List<Product> getProductsByFieldValue(String fieldName, String fieldValue) {
        try {
            if (fieldName == null || fieldValue == null) {
                return null;
            }

            fieldName = fieldName.trim();
            fieldValue = fieldValue.trim();
            ProductField productField = getProductFieldByNameValue(fieldName, fieldValue);

            TypedQuery<Product> q;
            q = em.createQuery(
                    "SELECT p FROM Product p WHERE :productField MEMBER OF p.productFields", Product.class);
            q.setParameter("productField", productField);

            return q.getResultList();
        } catch (ProductFieldException ex) {
            return null;
        }
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
            throw new ProductItemException("ProductItem with RFID " + rfid + " cannot be found");
        } else {
            return pi;
        }
    }

    @Override
    public List<ProductItem> getProductItemsBySKU(String sku) throws ProductException {
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
            q = em.createQuery("SELECT pi FROM ProductItem pi", ProductItem.class);
        }

        return q.getResultList();
    }

    @Override
    public void sellProductItem(String rfid) throws ProductItemException {
        rfid = rfid.trim();
        ProductItem pi = getProductItem(rfid);
        pi.setAvailable(false);
    }

    @Override
    public void returnProductItem(String rfid) throws ProductItemException {
        rfid = rfid.trim();
        ProductItem pi = getProductItem(rfid);
        pi.setAvailable(true);
    }
}

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
import com.iora.erp.model.product.PromotionField;

import org.hibernate.NonUniqueResultException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("productServiceImpl")
@Transactional
public class ProductServiceImpl implements ProductService {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<String> getProductFieldValues(String fieldName) throws ProductFieldException {
        TypedQuery<String> q = em
                .createQuery("SELECT pf.fieldValue FROM ProductField pf WHERE pf.fieldName = :fieldName", String.class);
        q.setParameter("fieldName", fieldName.trim().toUpperCase());

        List<String> values = q.getResultList();
        if (values == null) {
            throw new ProductFieldException("Field name " + fieldName + " does not exist.");
        } else {
            return values;
        }
    }

    @Override
    public List<PromotionField> getPromotionFields() {
        TypedQuery<PromotionField> q = em.createQuery("SELECT prf FROM PromotionField prf", PromotionField.class);
        return q.getResultList();
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
    public ProductField createProductField(ProductField productField) throws ProductFieldException {
        productField.setFieldName(productField.getFieldName().trim().toUpperCase());
        productField.setFieldValue(productField.getFieldValue().trim().toUpperCase());
        try {
            getProductFieldByNameValue(productField.getFieldName(), productField.getFieldValue());
        } catch (ProductFieldException ex) {
            em.persist(productField);
            return productField;
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
    public PromotionField getPromoField(String fieldName, String fieldValue, double discountedPrice)
            throws ProductFieldException {
        Query q = em.createQuery(
                "SELECT prf FROM PromotionField prf WHERE " +
                        "LOWER(prf.fieldName) LIKE :fieldName AND LOWER(prf.fieldValue) LIKE :fieldValue AND prf.discountedPrice = :price");
        q.setParameter("fieldName", fieldName.trim().toLowerCase());
        q.setParameter("fieldValue", fieldValue.trim().toLowerCase());
        q.setParameter("price", discountedPrice);

        try {
            PromotionField prf = (PromotionField) q.getSingleResult();
            return prf;
        } catch (NoResultException | NonUniqueResultException ex) {
            throw new ProductFieldException("PromotionField does not exist.");
        }
    }

    @Override
    public PromotionField createPromoField(PromotionField promotionField) throws ProductFieldException{
        promotionField.setFieldName(promotionField.getFieldName().trim().toUpperCase());
        promotionField.setFieldValue(promotionField.getFieldValue().trim().toUpperCase());
        try {
            getProductFieldByNameValue(promotionField.getFieldName(), promotionField.getFieldValue());
        } catch (ProductFieldException ex) {
            em.persist(promotionField);
            return promotionField;
        }
        throw new ProductFieldException("Product Field with name " + promotionField.getFieldName() + " and value "
                + promotionField.getFieldValue() + " already exist.");
    }

    @Override
    public Model addPromoCategory(String modelCode, String category, double discountedPrice)
            throws ModelException {
        Model model = getModel(modelCode);

        try {
            ProductField pf = getPromoField("category", category, discountedPrice);
            model.addProductField(pf);
            return model;
        } catch (ProductFieldException ex) {
            PromotionField prf = new PromotionField();
            prf.setFieldName("category");
            prf.setFieldValue(category);
            prf.setDiscountedPrice(discountedPrice);
            em.persist(prf);
            model.addProductField(prf);
            return model;
        }
    }

    @Override
    public Model createModel(Model model) throws ModelException {
        try {
            em.persist(model);
            return model;
        } catch (EntityExistsException ex) {
            throw new ModelException("Model with model code " + model.getModelCode() + " already exist.");
        }
    }

    @Override
    public List<Product> createProduct(String modelCode, List<ProductField> productFields)
            throws ProductException, ProductFieldException {
        try {
            List<String> colours = new ArrayList<>();
            List<String> sizes = new ArrayList<>();

            for (ProductField pf : productFields) {
                if (pf.getFieldName().equals("COLOUR")) {
                    colours.add(pf.getFieldValue());
                } else if (pf.getFieldName().equals("SIZE")) {
                    sizes.add(pf.getFieldValue());
                }
            }

            Model model = getModel(modelCode);
            List<Product> products = new ArrayList<>();
            int count = 1;

            // Loop for each combination of size and colour
            for (int i = 0; i < colours.size(); i++) {
                for (int j = 0; j < sizes.size(); j++) {
                    Product p = new Product(modelCode + "-" + count);

                    ProductField colourField = getProductFieldByNameValue("colour", colours.get(i));
                    p.addProductField(colourField);

                    ProductField sizeField = getProductFieldByNameValue("size", sizes.get(j));
                    p.addProductField(sizeField);

                    em.persist(p);
                    products.add(p);
                    count++;
                }
            }

            model.setProducts(products);
            return products;

        } catch (ModelException ex) {
            throw new ProductException("Model with model code " + modelCode + " does not exist.");
        } catch (EntityExistsException ex) {
            throw new ProductException("Product was already created.");
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
    public List<Model> getModelsByPromoField(PromotionField promoField) {
        TypedQuery<Model> q = em.createQuery("SELECT m FROM Model m WHERE :promoField MEMBER OF m.productFields",
                Model.class);
        q.setParameter("promoField", promoField);

        return q.getResultList();
    }

    @Override
    public List<Model> getModelsByFieldValue(String fieldName, String fieldValue) {
        try {
            if (fieldName == null || fieldValue == null) {
                return new ArrayList<Model>();
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
            return new ArrayList<Model>();
        }
    }

    @Override
    public List<Model> getModelsByCompanyAndTag(String company, String tag) {
        try {
            if (tag == null || company == null) {
                return new ArrayList<Model>();
            }
            tag = tag.trim();
            company = company.trim();
            ProductField tagField = getProductFieldByNameValue("tag", tag);
            ProductField companyField = getProductFieldByNameValue("company", company);

            TypedQuery<Model> q;
            q = em.createQuery(
                    "SELECT DISTINCT m FROM Model m WHERE :companyField MEMBER OF m.productFields AND :tagField MEMBER OF m.productFields",
                    Model.class);
            q.setParameter("companyField", companyField);
            q.setParameter("tagField", tagField);

            return q.getResultList();
        } catch (ProductFieldException ex) {
            return new ArrayList<Model>();
        }
    }

    public List<Model> getModelsByTag(String tag) {
        try {
            TypedQuery<Model> q;
            ProductField pf = getProductFieldByNameValue("tag", tag);

            q = em.createQuery("SELECT m FROM Model m WHERE :pf MEMBER OF m.productFields", Model.class);
            q.setParameter("pf", pf);

            return q.getResultList();
        } catch (ProductFieldException ex) {
            return new ArrayList<Model>();
        }
    }

    public List<Model> getModelsByCategory(String category) {
        try {
            TypedQuery<Model> q;
            ProductField pf = getProductFieldByNameValue("category", category);

            q = em.createQuery("SELECT m FROM Model m WHERE :pf MEMBER OF m.productFields", Model.class);
            q.setParameter("pf", pf);

            return q.getResultList();
        } catch (ProductFieldException ex) {
            return new ArrayList<Model>();
        }
    }

    @Override
    public Model updateModel(Model model) throws ModelException {
        Model old = em.find(Model.class, model.getModelCode());

        if (old == null) {
            throw new ModelException("Model not found");
        }

        old.setDescription(model.getDescription());
        old.setAvailable(model.isAvailable());
        old.setName(model.getName());
        old.setOnlineOnly(model.isOnlineOnly());
        old.setPrice(model.getPrice());
        old.setProductFields(model.getProductFields());
        return old;
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
                return new ArrayList<Product>();
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
            return new ArrayList<Product>();
        }
    }

    @Override
    public Product updateProduct(Product product) throws ProductException {
        Product old = em.find(Product.class, product.getsku());

        if (old == null) {
            throw new ProductException("Product not found");
        }

        old.setProductItems(product.getProductItems());
        old.setProductFields(product.getProductFields());
        return old;
    }

    @Override
    public void createProductItem(String rfid, String sku) throws ProductItemException {
        try {
            Product p = getProduct(sku);
            ProductItem pi = new ProductItem(rfid);
            pi.setProductSKU(sku);
            em.persist(pi);

            p.addProductItem(pi);
        } catch (EntityExistsException ex) {
            throw new ProductItemException("ProductItem with rfid " + rfid + " already exist.");
        } catch (ProductException ex) {
            throw new ProductItemException("Product with sku " + sku + " does not exist.");
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

package com.iora.erp.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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
import com.iora.erp.utils.StringGenerator;

import org.hibernate.NonUniqueResultException;
import org.json.JSONException;
import org.json.JSONObject;
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
                "SELECT pf FROM ProductField pf WHERE pf.fieldName LIKE :fieldName AND pf.fieldValue LIKE :fieldValue");
        q.setParameter("fieldName", fieldName.trim().toUpperCase());
        q.setParameter("fieldValue", fieldValue.trim().toUpperCase());

        try {
            ProductField pf = (ProductField) q.getSingleResult();
            return pf;
        } catch (NoResultException | NonUniqueResultException ex) {
            throw new ProductFieldException("Field name " + fieldName + " does not exist.");
        }
    }

    @Override
    public String getProductFieldValue(Product product, String fieldName) throws ProductFieldException {
        Set<ProductField> pFields = product.getProductFields();
        for (ProductField pf : pFields) {
            if (pf.getFieldName().equals(fieldName.toUpperCase())) {
                return pf.getFieldValue();
            }
        }

        throw new ProductFieldException("Field value cannot be found with the given Product and Field Name.");
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
    public ProductField createProductField(String name, String value) {
        try {
            ProductField pf = getProductFieldByNameValue(name, value);
            return pf;
        } catch (ProductFieldException e) {
            ProductField pf = new ProductField(name, value);
            em.persist(pf);
            return pf;
        }
    }

    @Override
    public List<ProductField> getAllProductFields() {
        TypedQuery<ProductField> q1 = em.createQuery("SELECT pf FROM ProductField pf", ProductField.class);
        List<ProductField> productFields = q1.getResultList();
        productFields.removeAll(getPromotionFields());
        return productFields;
    }

    @Override
    public PromotionField getPromoField(String fieldName, String fieldValue)
            throws ProductFieldException {
        try {
            return em.createQuery(
                    "SELECT prf FROM PromotionField prf WHERE LOWER(prf.fieldName) LIKE :fieldName AND "
                            + " LOWER(prf.fieldValue) LIKE :fieldValue",
                    PromotionField.class)
                    .setParameter("fieldName", fieldName.trim().toLowerCase())
                    .setParameter("fieldValue", fieldValue.trim().toLowerCase()).getSingleResult();

        } catch (NoResultException | NonUniqueResultException ex) {
            throw new ProductFieldException("PromotionField does not exist.");
        }
    }

    @Override
    public PromotionField getPromoFieldOfModel(Model model) throws ProductFieldException {
        PromotionField promotionField = null;
        for (ProductField pf : model.getProductFields()) {
            if (pf instanceof PromotionField) {
                promotionField = (PromotionField) pf;
            }
        }

        if (promotionField != null) {
            return promotionField;
        } else {
            throw new ProductFieldException("There is no promotion going on for this product.");
        }
    }

    @Override
    public PromotionField createPromoField(PromotionField promotionField) throws ProductFieldException {
        promotionField.setFieldName(promotionField.getFieldName().trim().toUpperCase());
        promotionField.setFieldValue(promotionField.getFieldValue().trim().toUpperCase());
        try {
            getProductFieldByNameValue(promotionField.getFieldName(), promotionField.getFieldValue());
        } catch (ProductFieldException ex) {
            if (promotionField.getQuota() > 1 && promotionField.isGlobal()) {
                throw new ProductFieldException("Invalid Global Product Field. Needs to have quota = 1");
            }
            em.persist(promotionField);
            return promotionField;
        }
        throw new ProductFieldException("Product Field with name " + promotionField.getFieldName() + " and value "
                + promotionField.getFieldValue() + " already exist.");
    }

    @Override
    public PromotionField updatePromoField(PromotionField promotionField) throws ProductFieldException {
        PromotionField old = em.find(PromotionField.class, promotionField.getId());
        if (old == null) {
            throw new ProductFieldException("Promotion Field cannot be found.");
        }
        promotionField.setFieldName(old.getFieldName());
        return em.merge(promotionField);
    }

    @Override
    public Model addPromoLink(String modelCode, String category) throws ModelException {
        Model model = getModel(modelCode);

        try {
            PromotionField pf = getPromoField("category", category);
            if (pf.getQuota() > 1) {
                model.getProductFields()
                        .removeIf(x -> (x instanceof PromotionField) && ((PromotionField) x).getQuota() > 1);
            }
            model.addProductField(pf);
            return model;
        } catch (ProductFieldException ex) {
            return model;
        }
    }

    @Override
    public Model createModel(Model model) throws ModelException {
        try {
            em.persist(createProduct(model));
            return model;
        } catch (ProductException | ProductFieldException | EntityExistsException ex) {
            ex.printStackTrace();
            throw new ModelException(ex.getMessage());
        }
    }

    private Model createProduct(Model model) throws ProductException, ProductFieldException {
        try {
            List<String> colours = new ArrayList<>();
            List<String> sizes = new ArrayList<>();

            for (ProductField pf : model.getProductFields()) {
                if (pf.getFieldName().equals("COLOUR")) {
                    colours.add(pf.getFieldValue());
                } else if (pf.getFieldName().equals("SIZE")) {
                    sizes.add(pf.getFieldValue());
                }
            }

            int count = 1;

            // Loop for each combination of size and colour
            for (int i = 0; i < colours.size(); i++) {
                for (int j = 0; j < sizes.size(); j++) {
                    Product p = new Product(model.getModelCode() + "-" + count);

                    ProductField colourField = getProductFieldByNameValue("colour", colours.get(i));
                    p.addProductField(colourField);

                    ProductField sizeField = getProductFieldByNameValue("size", sizes.get(j));
                    p.addProductField(sizeField);

                    em.persist(p);
                    model.addProduct(p);
                    count++;
                }
            }

            return model;

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
    public Model getModelByProduct(Product product) throws ModelException {
        TypedQuery<Model> q = em.createQuery("SELECT m FROM Model m WHERE :product MEMBER OF m.products", Model.class);
        q.setParameter("product", product);
        try {
            return q.getSingleResult();
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ModelException(ex.getMessage());
        }
    }

    @Override
    public List<Model> getModelsBySKUList(List<String> SKUList) throws ModelException {
        List<Model> models = new ArrayList<>();
        for (String sku : SKUList) {
            String modelCode = sku.substring(0, sku.lastIndexOf("-"));
            models.add(getModel(modelCode.trim()));
        }
        return models;
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

    @Override
    public List<Model> getModelsByTag(String tag) {
        try {
            ProductField pf = getProductFieldByNameValue("TAG", tag.toUpperCase());

            return em
                    .createQuery("SELECT m FROM Model m WHERE :pf MEMBER OF m.productFields", Model.class)
                    .setParameter("pf", pf)
                    .getResultList();
        } catch (ProductFieldException ex) {
            return new ArrayList<Model>();
        }
    }

    @Override
    public List<Model> getModelsByCategory(String category) {
        try {
            ProductField pf = getProductFieldByNameValue("CATEOGRY", category.toUpperCase());

            return em.createQuery("SELECT m FROM Model m WHERE :pf MEMBER OF m.productFields", Model.class)
                    .setParameter("pf", pf)
                    .getResultList();
        } catch (ProductFieldException ex) {
            return new ArrayList<Model>();
        }
    }

    @Override
    public Model updateModel(Model model) throws ModelException, ProductFieldException {
        Model old = em.find(Model.class, model.getModelCode());

        if (old == null) {
            throw new ModelException("Model not found");
        } else if (model.getProductFields().size() < old.getProductFields().size()) {
            throw new ModelException("Sizes and Colours cannot be deleted.");
        }

        old.setDescription(model.getDescription());
        old.setAvailable(model.isAvailable());
        old.setName(model.getName());
        old.setOnlineOnly(model.isOnlineOnly());
        old.setListPrice(model.getListPrice());
        old.setDiscountPrice(model.getDiscountPrice());
        old.setImageLinks(model.getImageLinks());
        old = updateProduct(model, old);
        old.setProductFields(model.getProductFields());

        return em.merge(old);
    }

    private Model updateProduct(Model model, Model old) throws ModelException, ProductFieldException {
        List<String> coloursNew = new ArrayList<>();
        List<String> sizesNew = new ArrayList<>();
        for (ProductField pf : model.getProductFields()) {
            if (pf.getFieldName().equals("COLOUR")) {
                coloursNew.add(pf.getFieldValue());
            } else if (pf.getFieldName().equals("SIZE")) {
                sizesNew.add(pf.getFieldValue());
            }
        }

        List<String> coloursOld = new ArrayList<>();
        List<String> sizesOld = new ArrayList<>();
        for (ProductField pf : old.getProductFields()) {
            if (pf.getFieldName().equals("COLOUR")) {
                coloursOld.add(pf.getFieldValue());
            } else if (pf.getFieldName().equals("SIZE")) {
                sizesOld.add(pf.getFieldValue());
            }
        }

        if (!coloursNew.containsAll(coloursOld) || !sizesNew.containsAll(sizesOld)) {
            throw new ModelException("Sizes and Colours can only be added, not removed.");
        }

        List<String> coloursDiff = new ArrayList<>(coloursNew);
        coloursDiff.removeAll(coloursOld);
        List<String> sizesDiff = new ArrayList<>(sizesNew);
        sizesDiff.removeAll(sizesOld);
        int count = old.getProducts().size() + 1;

        if (coloursDiff.size() > 0) {
            // Loop for each combination of new colours and all sizes
            for (int i = 0; i < coloursDiff.size(); i++) {
                for (int j = 0; j < sizesNew.size(); j++) {
                    Product p = new Product(model.getModelCode() + "-" + count);

                    ProductField colourField = getProductFieldByNameValue("colour", coloursDiff.get(i));
                    p.addProductField(colourField);

                    ProductField sizeField = getProductFieldByNameValue("size", sizesNew.get(j));
                    p.addProductField(sizeField);

                    em.persist(p);
                    old.addProduct(p);
                    count++;
                }
            }
        }

        if (sizesDiff.size() > 0) {
            // Loop for each combination of new sizes and all colours
            for (int i = 0; i < sizesDiff.size(); i++) {
                for (int j = 0; j < coloursOld.size(); j++) {
                    Product p = new Product(model.getModelCode() + "-" + count);

                    ProductField sizeField = getProductFieldByNameValue("size", sizesDiff.get(i));
                    p.addProductField(sizeField);

                    ProductField colourField = getProductFieldByNameValue("colour", coloursOld.get(j));
                    p.addProductField(colourField);

                    em.persist(p);
                    old.addProduct(p);
                    count++;
                }
            }
        }
        return old;
    }

    @Override
    public Product getProduct(String rfidsku) throws ProductException {
        Product product = em.find(Product.class, rfidsku);
        ProductItem productItem = em.find(ProductItem.class, rfidsku);

        if (product == null && productItem == null) {
            throw new ProductException("Product cannot be found.");
        } else if (product == null) {
            product = productItem.getProduct();
        }

        return product;
    }

    @Override
    public List<Product> getProducts(List<String> rfidskus) throws ProductException {
        List<Product> products = new ArrayList<>();

        for (String rfidsku : rfidskus) {
            products.add(getProduct(rfidsku));
        }

        return products;
    }

    @Override
    public List<Product> searchProductsBySKU(String sku) {
        TypedQuery<Product> q;
        if (sku != null) {
            sku = sku.trim();
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
    public Product createProduct(Product product) throws ProductException {
        try {
            Model model = getModel(product.getSku().substring(0, product.getSku().indexOf("-")));

            for (ProductField pf : product.getProductFields()) {
                model.addProductField(pf);
            }
            em.merge(model);
            em.persist(product);
        } catch (ModelException | EntityExistsException e) {
            e.printStackTrace();
            System.err.println(e);
        }
        return product;
    }

    @Override
    public Product updateProduct(Product product) throws ProductException {
        Product old = em.find(Product.class, product.getSku());

        if (old == null) {
            throw new ProductException("Product not found");
        }

        old.setProductFields(product.getProductFields());
        return em.merge(old);
    }

    @Override
    public String deleteProduct(String sku) throws ProductException {
        em.remove(getProduct(sku));
        return sku;
    }

    @Override
    public ProductItem createProductItem(String rfid, String sku) throws ProductItemException {
        try {
            Product p = getProduct(sku);
            ProductItem pi = new ProductItem(rfid);
            pi.setProduct(p);
            em.persist(pi);
            return pi;
        } catch (EntityExistsException ex) {
            throw new ProductItemException("ProductItem with rfid " + rfid + " already exist.");
        } catch (ProductException ex) {
            throw new ProductItemException("Product with sku " + sku + " does not exist.");
        }
    }

    @Override
    public List<ProductItem> generateProductItems(String sku, int qty) throws ProductItemException {
        List<ProductItem> piList = new ArrayList<>();
        for (int i = 0; i < qty; i++) {
            String rfid = StringGenerator.generateRFID(sku);
            ProductItem pi = createProductItem(rfid, sku);
            piList.add(pi);
        }
        return piList;
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
    public List<ProductItem> getProductItems(String sku) {
        TypedQuery<ProductItem> q = em.createQuery("SELECT pi FROM ProductItem pi WHERE pi.product.sku = :sku",
                ProductItem.class);
        q.setParameter("sku", sku);

        return q.getResultList();
    }

    /*
     * Depracated
     * 
     * @Override
     * public List<ProductItem> getProductItemsBySKU(String sku) throws
     * ProductException {
     * Product p = getProduct(sku);
     * return p.getProductItems();
     * }
     * 
     * @Override
     * public List<ProductItem> searchProductItems(String rfid) {
     * TypedQuery<ProductItem> q;
     * 
     * if (rfid != null) {
     * q = em.
     * createQuery("SELECT pi FROM ProductItem pi WHERE LOWER(pi.rfid) LIKE :rfid",
     * ProductItem.class);
     * q.setParameter("rfid", "%" + rfid.toLowerCase() + "%");
     * } else {
     * q = em.createQuery("SELECT pi FROM ProductItem pi", ProductItem.class);
     * }
     * 
     * return q.getResultList();
     * }
     * 
     * @Override
     * public void sellProductItem(String rfid) throws ProductItemException {
     * rfid = rfid.trim();
     * ProductItem pi = getProductItem(rfid);
     * pi.setAvailable(false);
     * }
     * 
     * @Override
     * public void returnProductItem(String rfid) throws ProductItemException {
     * rfid = rfid.trim();
     * ProductItem pi = getProductItem(rfid);
     * pi.setAvailable(true);
     * }
     */

    @Override
    public JSONObject getProductCartDetails(String rfidsku)
            throws ProductException, ModelException, JSONException,
            ProductFieldException {
        JSONObject jo = new JSONObject();
        Product p = getProduct(rfidsku);

        Model m = getModelByProduct(p);
        jo.put("name", m.getName());
        jo.put("listPrice", m.getListPrice());
        jo.put("discountedPrice", m.getDiscountPrice());
        jo.put("colour", getProductFieldValue(p, "COLOUR"));
        jo.put("size", getProductFieldValue(p, "SIZE"));
        return jo;
    }
}
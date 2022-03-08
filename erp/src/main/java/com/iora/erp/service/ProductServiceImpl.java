package com.iora.erp.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import com.iora.erp.enumeration.PaymentType;
import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.ModelException;
import com.iora.erp.exception.NoStockLevelException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.exception.ProductFieldException;
import com.iora.erp.exception.ProductItemException;
import com.iora.erp.model.Currency;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.Payment;
import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.product.PromotionField;
import com.iora.erp.utils.StringGenerator;

import org.hibernate.NonUniqueResultException;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@SuppressWarnings("unchecked")
@Service("productServiceImpl")
@Transactional
public class ProductServiceImpl implements ProductService {

    @Autowired
    private SiteService siteService;
    @Autowired
    private CustomerOrderService customerOrderService;
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
                model.getProductFields().removeIf(x -> (x instanceof PromotionField)  && ((PromotionField) x).getQuota() > 1);
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
        old.setListPrice(model.getListPrice());
        old.setDiscountPrice(model.getDiscountPrice());
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
    public Product updateProduct(Product product) throws ProductException {
        Product old = em.find(Product.class, product.getSku());

        if (old == null) {
            throw new ProductException("Product not found");
        }

        old.setProductFields(product.getProductFields());
        return em.merge(old);
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
    public ProductItem getProductItem(String rfid) throws ProductItemException {
        ProductItem pi = em.find(ProductItem.class, rfid);

        if (pi == null) {
            throw new ProductItemException("ProductItem with RFID " + rfid + " cannot be found");
        } else {
            return pi;
        }
    }

    /* Depracated
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
    */

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
    public JSONObject getProductCartDetails(String rfid)
            throws ProductItemException, ProductException, ModelException, JSONException,
            ProductFieldException {
        ProductItem pi = getProductItem(rfid);
        Product p = pi.getProduct();
        Model m = getModelByProduct(p);
        JSONObject jo = new JSONObject();
        jo.put("name", m.getName());
        jo.put("listPrice", m.getListPrice());
        jo.put("discountedPrice", m.getDiscountPrice());
        jo.put("colour", getProductFieldValue(p, "COLOUR"));
        jo.put("size", getProductFieldValue(p, "SIZE"));
        return jo;
    }

    @Override
    public Currency getCurrency(String code) {
        return em.find(Currency.class, code);
    }

    @Override
    public void loadProducts(List<Object> productsJSON)
            throws ProductException, ProductFieldException, ProductItemException, CustomerException {

        for (Object j : productsJSON) {
            LinkedHashMap<Object, Object> hashMap = (LinkedHashMap<Object, Object>) j;
            List<Object> json = hashMap.values().stream().collect(Collectors.toList());
            // Decoding JSON Object
            String name = (String) json.get(0);
            String modelCode = (String) json.get(1);
            String description = (String) json.get(2);
            List<String> colours = (ArrayList<String>) json.get(3);
            List<String> sizes = (ArrayList<String>) json.get(4);
            String company = (String) json.get(5);
            List<String> tags = (ArrayList<String>) json.get(6);
            List<String> categories = (ArrayList<String>) json.get(7);

            LinkedHashMap<Object, Object> priceMap = (LinkedHashMap<Object, Object>) json.get(8);
            List<Object> priceList = (ArrayList<Object>) priceMap.values().stream().collect(Collectors.toList());
            double listPrice = Double.parseDouble((String) priceList.get(0));

            LinkedHashMap<Object, Object> discountedPriceMap = (LinkedHashMap<Object, Object>) json.get(9);
            List<Object> discountedPriceList = (ArrayList<Object>) discountedPriceMap.values().stream()
                    .collect(Collectors.toList());
            double discountPrice = discountedPriceList.isEmpty() ? listPrice
                    : Double.parseDouble((String) discountedPriceList.get(0));

            Model model = new Model(modelCode, name, description, listPrice, discountPrice,
                    categories.contains("SALE FROM $10"), true);
            List<ProductField> productFields = new ArrayList<>();

            for (String c : colours) {
                ProductField colour = createProductField("colour", c);
                model.addProductField(colour);
                productFields.add(colour);
            }

            for (String s : sizes) {
                ProductField size = createProductField("size", s);
                model.addProductField(size);
                productFields.add(size);
            }

            ProductField com = createProductField("company", company);
            model.addProductField(com);
            productFields.add(com);

            for (String t : tags) {
                ProductField tag = createProductField("tag", t);
                model.addProductField(tag);
                productFields.add(tag);
            }

            for (String cat : categories) {
                if (cat.contains("S$")) {
                    ProductField category = getPromoField("category", cat);
                    model.addProductField(category);
                    productFields.add(category);
                }
            }
            em.persist(model);
            createProduct(modelCode, productFields);
        }

        List<Product> products = searchProductsBySKU(null);
        for (Product p : products) {
            Random r = new Random();
            int stockLevel = r.nextInt(27) + 3;

            for (int i = 0; i < stockLevel; i++) {
                String rfid = StringGenerator.generateRFID(p.getSku());
                createProductItem(rfid, p.getSku());
                try {
                    siteService.addProductItemToSite(Long.valueOf(r.nextInt(20)) + 1, rfid);
                } catch (NoStockLevelException ex) {
                    // do nothing
                }
            }
        }

        // To fix other methods first
        // Customer Order
        // CustomerOrderLI coli1 = new CustomerOrderLI();
        // coli1.setProductItems(getProductItemsBySKU("BPD0010528A-1").stream().collect(Collectors.toList()));
        // customerOrderService.createCustomerOrderLI(coli1);

        // CustomerOrderLI coli2 = new CustomerOrderLI();
        // coli2.setProductItems(getProductItemsBySKU("BPS0009808X-1").stream().collect(Collectors.toList()));
        // customerOrderService.createCustomerOrderLI(coli2);

        // Payment payment1 = new Payment(300.15, "241563", PaymentType.VISA);
        // customerOrderService.createPayment(payment1);

        // CustomerOrder co1 = new CustomerOrder();
        // co1.setCustomerId(1L);
        // co1.setDateTime(LocalDateTime.parse("2022-02-10 13:34", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        // co1.addLineItem(coli1);
        // co1.addLineItem(coli2);
        // co1.setStoreSiteId(3L);
        // co1.addPayment(payment1);
        // customerOrderService.createCustomerOrder(co1);
    }
}
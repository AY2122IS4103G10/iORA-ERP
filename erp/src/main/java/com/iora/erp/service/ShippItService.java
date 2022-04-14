package com.iora.erp.service;

import java.util.List;

import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.model.customerOrder.Delivery;
import com.iora.erp.model.customerOrder.OnlineOrder;

import org.springframework.http.ResponseEntity;

public interface ShippItService {

    public abstract OnlineOrder createDelivery(Long orderId, Long siteId, List<Delivery> deliveries)
            throws CustomerOrderException, CustomerException;

    public abstract String tokenBearer();

    public abstract ResponseEntity<String> deliveryOrder();

}

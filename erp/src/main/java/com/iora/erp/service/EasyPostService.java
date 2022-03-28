package com.iora.erp.service;

import java.util.Date;
import java.util.List;

import com.easypost.exception.EasyPostException;
import com.easypost.model.Batch;
import com.easypost.model.ShipmentCollection;
import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.model.customerOrder.Delivery;
import com.iora.erp.model.customerOrder.OnlineOrder;

public interface EasyPostService {

    public abstract OnlineOrder createParcel(Long orderId, Long siteId, Delivery parcelInfo)
            throws CustomerOrderException, CustomerException;

    // done at the 1pm everyday
    public abstract Batch createBatchDelivery(Long siteId) throws EasyPostException;

    public abstract List<Delivery> onlineParcelAvailDeliveryBySite(Long siteId, Date dayBefore);

    public abstract ShipmentCollection retreiveListOfShipments() throws EasyPostException;
}

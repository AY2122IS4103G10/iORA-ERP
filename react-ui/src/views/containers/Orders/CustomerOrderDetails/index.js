import { useMemo } from "react";
import moment from "moment";
import { SimpleTable } from "../../../components/Tables/SimpleTable";
import { useOutletContext } from "react-router-dom";
import {
  ActivitySection,
  fetchAllActionBy,
} from "../../Procurement/ProcurementDetails";
import { useEffect } from "react";
import { useState } from "react";
import { eventTypes } from "../../../../constants/eventTypes";
import { classNames } from "../../../../utilities/Util";

const ItemTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "SKU",
        accessor: "product.sku",
      },
      {
        Header: "Name",
        accessor: "product.name",
      },
      {
        Header: "Color",
        accessor: (row) =>
          row.product.productFields.find(
            (field) => field.fieldName === "COLOUR"
          ).fieldValue,
      },
      {
        Header: "Size",
        accessor: (row) =>
          row.product.productFields.find((field) => field.fieldName === "SIZE")
            .fieldValue,
      },
      {
        Header: "Qty",
        accessor: "qty",
      },
    ],
    []
  );

  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Items</h3>
      </div>

      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

const OrderDetailsBody = ({
  history,
  dateTime,
  delivery,
  deliveryAddress,
  customer,
  totalAmount,
  payments,
  paid,
  pickupSite,
  country,
  lineItems,
  status,
}) => {
  return (
    <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
      <div
        className={classNames(
          "space-y-6 lg:col-start-1 ",
          Boolean(history.length) ? "lg:col-span-2" : "lg:col-span-3"
        )}
      >
        {/* Site Information list*/}
        <section aria-labelledby="applicant-information-title">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2
                id="order-information-title"
                className="text-lg leading-6 font-medium text-gray-900"
              >
                Order Information
              </h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
                {status && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{status}</dd>
                  </div>
                )}

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Date Created
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {moment(dateTime).format("DD/MM/YYYY, H:mm:ss")}
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Customer
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <address className="not-italic">
                      <span className="block">
                        {customer.firstName} {customer.lastName}
                      </span>
                      <span className="block">{customer.email}</span>
                      <span className="block">{customer.contactNumber}</span>
                    </address>
                  </dd>
                </div>

                {delivery !== undefined && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Delivery Type
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {delivery ? "DELIVERY" : "SELF-COLLECT"}
                    </dd>
                  </div>
                )}
                {delivery !== undefined &&
                  (delivery ? (
                    deliveryAddress && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Delivery Address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <address className="not-italic">
                            <span className="block">
                              {deliveryAddress.street1},{" "}
                              {deliveryAddress.street2}
                            </span>
                            <span className="block">
                              {deliveryAddress.city}, {deliveryAddress.zip}
                            </span>
                          </address>
                        </dd>
                      </div>
                    )
                  ) : (
                    pickupSite && <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Pickup At
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <address className="not-italic">
                          <span className="block">{pickupSite.name}</span>
                          <span className="block">
                            {pickupSite.address.road}
                          </span>
                          <span className="block">
                            {pickupSite.address.city},{" "}
                            {pickupSite.address.postalCode}
                          </span>
                          <span className="block">
                            {pickupSite.phoneNumber}
                          </span>
                        </address>
                      </dd>
                    </div>
                  ))}

                {country && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Country
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{country}</dd>
                  </div>
                )}

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Total Amount
                  </dt>

                  <dd className="mt-1 text-sm text-gray-900">
                    {totalAmount.toFixed(2)}
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Paid</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {paid ? "YES" : "NO"}
                  </dd>
                </div>

                {Boolean(payments.length) && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Payment Type
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {payments
                        .map((payment) => payment.paymentType)
                        .join(", ")}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </section>
      </div>
      {Boolean(history.length) && <ActivitySection history={history} />}
      {Boolean(lineItems.length) && (
        <div className="lg:col-start-1 lg:col-span-3">
          <section aria-labelledby="departments">
            <ItemTable data={lineItems} />
          </section>
        </div>
      )}
    </div>
  );
};

export const CustomerOrderDetails = () => {
  const {
    dateTime,
    customer,
    delivery,
    deliveryAddress,
    totalAmount,
    payments,
    paid,
    pickupSite,
    country,
    status,
    lineItems,
    statusHistory,
  } = useOutletContext();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    statusHistory !== undefined &&
      fetchAllActionBy(statusHistory).then((data) => {
        setHistory(
          statusHistory.map(({ status, timeStamp }, index) => ({
            id: index,
            type:
              status === "PENDING"
                ? index === 0
                  ? eventTypes.created
                  : eventTypes.completed
                : ["PICKING", "PACKING", "DELIVERING"].some((s) => s === status)
                ? eventTypes.action
                : status === "CANCELLED"
                ? eventTypes.cancelled
                : eventTypes.completed,
            content:
              status === "PENDING"
                ? `${index === 0 ? "Created" : "Updated"} by`
                : status === "READY_FOR_DELIVERY"
                ? "Ready for delivery by"
                : status === "READY_FOR_COLLECTION"
                ? "Ready for collection by"
                : `${status.charAt(0) + status.slice(1).toLowerCase()} by`,
            target: data[index].name,
            date: moment.unix(timeStamp / 1000).format("DD/MM, H:mm"),
          }))
        );
      });
  }, [statusHistory]);
  return (
    <OrderDetailsBody
      dateTime={dateTime}
      customer={customer}
      delivery={delivery}
      deliveryAddress={deliveryAddress}
      totalAmount={totalAmount}
      payments={payments}
      paid={paid}
      pickupSite={pickupSite}
      country={country}
      status={status.status}
      lineItems={lineItems}
      history={history}
    />
  );
};

import { useMemo } from "react";
import moment from "moment";
import { SimpleTable } from "../../../components/Tables/SimpleTable";
import { useOutletContext } from "react-router-dom";

const ItemTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "SKU",
        accessor: (row) => row.productItems[0].productSKU,
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
const OrderDetailsBody = ({order}) => {
  return <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
  <div className="space-y-6 lg:col-start-1 lg:col-span-2">
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
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Customer No.
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {order.customerId}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Transaction Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {moment(order.dateTime).format("DD/MM/YYYY")}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Total Amount
              </dt>

              <dd className="mt-1 text-sm text-gray-900">
                ${order.totalAmount.toFixed(2)}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Payment Type
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {order.payments.map((payment) => payment.paymentType).join(", ")}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
    {Boolean(order.lineItems.length) && (
      <section aria-labelledby="departments">
        <ItemTable data={order.lineItems} />
      </section>
    )}
  </div>
</div>
}

export const CustomerOrderDetails = () => {
  const {
    subsys,
    orderId,
    order,
    status,
    lineItems,
    setLineItems,
  } = useOutletContext()

  return (
    Boolean(order) && (
      <OrderDetailsBody order={order}/>
    )
  );
};

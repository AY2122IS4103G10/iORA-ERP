import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import {
  fetchSiteOrders,
  selectOrderById,
} from "../../../../stores/slices/posSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { SimpleTable } from "../../../components/Tables/SimpleTable";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import { useState } from "react";
import { fetchAllModelsBySkus } from "../../StockTransfer/StockTransferForm";

const Header = ({ order }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.id}
          </h1>
        </div>
      </div>
    </div>
  );
};

const ItemTable = ({ data }) => {
  const columns = useMemo(
    () => [
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
      // {
      //   Header: "Disc",
      //   accessor: "subTotal",
      //   Cell: ({ value, row }) => {
      //     const {product, subTotal} = row.original;
      //     if (subTotal <= 0 )
      //     return value <= 0 ? value : "-";
      //   },
      // },
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

export const OrderDetails = () => {
  const { orderId } = useParams();
  const order = useSelector((state) =>
    selectOrderById(state, parseInt(orderId))
  );
  const orderLineItems = order.lineItems;
  const [lineItems, setLineItems] = useState([]);
  const siteId = useSelector(selectUserSite);
  const dispatch = useDispatch();
  const orderStatus = useSelector((state) => state.pos.status);

  useEffect(() => {
    orderStatus === "idle" && dispatch(fetchSiteOrders(siteId));
  }, [orderStatus, dispatch, siteId]);

  useEffect(() => {
    if (orderLineItems) {
      const lIs = orderLineItems.filter((item) => item.subTotal > 0);
      const promoLIs = orderLineItems.filter((item) => item.subTotal <= 0);
      lIs.forEach((item) => {
        const promo = promoLIs.find((i) => i.product.sku === item.product.sku);
        if (promo !== undefined) item["prodDisc"] = promo.subTotal;
      });
      fetchAllModelsBySkus(lIs).then((data) =>
        setLineItems(
          lIs.map((item, index) => ({
            ...item,
            product: {
              ...item.product,
              modelCode: data[index].modelCode,
              name: data[index].name,
            },
          }))
        )
      );
    }
  }, [orderLineItems]);
  return (
    Boolean(order) && (
      <div className="py-4 xl:py-6">
        <NavigatePrev />
        <Header order={order} />
        <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
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
                        {order.payments
                          .map((payment) => payment.paymentType)
                          .join(", ")}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </section>
            {Boolean(order.lineItems.length) && (
              <section aria-labelledby="line-items">
                <ItemTable data={lineItems} />
              </section>
            )}
          </div>
        </div>
      </div>
    )
  );
};

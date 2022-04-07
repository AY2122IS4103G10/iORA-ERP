import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { productApi } from "../../../../environments/Api";
import {
  fetchCustomer,
  selectUser,
  selectUserOrderById,
} from "../../../../stores/slices/userSlice";
import { classNames } from "../../../../utilities/Util";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";

export const fetchModelBySku = async (sku) => {
  const { data } = await productApi.getModelBySku(sku);
  return data;
};

export const fetchAllModelsBySkus = async (items) => {
  return Promise.all(items.map((item) => fetchModelBySku(item.product.sku)));
};

export const PurchaseHistoryDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const user = useSelector(selectUser);
  const userId = user?.id;
  const order = useSelector((state) =>
    selectUserOrderById(state, parseInt(orderId))
  );
  const status = order?.statusHistory[order.statusHistory.length - 1];
  const [lineItems, setLineItems] = useState([]);

  useEffect(() => {
    userId && dispatch(fetchCustomer(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (!order) {
      addToast(`Error: You cannot view Customer Order ${orderId}`, {
        appearance: "error",
        autoDismiss: true,
      });
      navigate("/str/pos/orderHistory");
    }
    const orderLineItems = order?.lineItems || [];
    const status = order?.statusHistory[order.statusHistory.length - 1];
    fetchAllModelsBySkus(orderLineItems).then((data) =>
      setLineItems(
        orderLineItems.map((item, index) => {
          const promo = order.promotions.find(
            (promo) => promo.product.sku === item.product.sku
          );
          return {
            ...item,
            product: {
              ...item.product,
              ...data[index],
              step:
                status.status === "PENDING"
                  ? 0
                  : [
                      "PICKING",
                      "PICKED",
                      "PACKING",
                      "PACKED",
                      "READY_FOR_DELIVERY",
                      "READY_FOR_COLLECTION",
                    ].some((s) => status.status === s)
                  ? 1
                  : status.status === "COMPLETED"
                  ? 3
                  : 2,
            },
            promo: promo !== undefined ? promo.promotion.fieldValue : null,
          };
        })
      )
    );
  }, [order, addToast, navigate, orderId]);
  console.log(user);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-16 lg:px-8">
        <NavigatePrev page="Orders" path="/orders" />
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Order Details
        </h1>

        <div className="text-sm border-b border-gray-200 mt-2 pb-5 sm:flex sm:justify-between">
          <dl className="flex">
            <dt className="text-gray-500">Order number&nbsp;</dt>
            <dd className="font-medium text-gray-900">{order.id}</dd>
            <dt>
              <span className="sr-only">Date</span>
              <span className="text-gray-400 mx-2" aria-hidden="true">
                &middot;
              </span>
            </dt>
            <dd className="font-medium text-gray-900">
              {moment
                .unix(order.statusHistory[0].timeStamp / 1000)
                .format("MMMM Do, YYYY")}
            </dd>
          </dl>
          <div className="mt-4 sm:mt-0">
            <Link
              to={`/checkout/success/${orderId}`}
              className="font-medium text-gray-600 hover:text-gray-500"
            >
              View invoice<span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="mt-8">
          <h2 id="products-heading" className="sr-only">
            Products purchased
          </h2>

          <div className="space-y-24">
            {Boolean(lineItems.length) &&
              lineItems.map(({ product }) => {
                return (
                  <div
                    key={product.sku}
                    className="grid grid-cols-1 text-sm sm:grid-rows-1 sm:grid-cols-12 sm:gap-x-6 md:gap-x-8 lg:gap-x-8"
                  >
                    <div className="sm:col-span-4 md:col-span-5 md:row-end-2 md:row-span-2">
                      <div className="aspect-w-1 aspect-h-1 bg-gray-50 rounded-lg overflow-hidden">
                        <img
                          src={product.imageLinks[0]}
                          alt={product.name}
                          className="object-center object-cover"
                        />
                      </div>
                    </div>
                    <div className="mt-6 sm:col-span-7 sm:mt-0 md:row-end-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link to={`/products/view/${product.modelCode}`}>
                          {product.name}
                        </Link>
                        {order.refundedLIs.find(
                          (item) => item.product.sku === product.sku
                        ) && (
                          <span className="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            Refunded
                          </span>
                        )}
                        {order.exchangedLIs.find(
                          (item) => item.product.sku === product.sku
                        ) && (
                          <span className="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            Exchanged
                          </span>
                        )}
                      </h3>
                      <p className="font-medium text-gray-900 mt-1">
                        ${product.listPrice}
                      </p>
                      <p className="text-gray-500 mt-3">
                        {product.description}
                      </p>
                      <span className="mt-2 text-sm text-gray-600">
                        Colour:{" "}
                        {
                          product.productFields.find(
                            (field) => field.fieldName === "COLOUR"
                          ).fieldValue
                        }
                      </span>
                      <span className="mt-2 text-sm text-gray-600">
                        {" | "}Size:{" "}
                        {
                          product.productFields.find(
                            (field) => field.fieldName === "SIZE"
                          ).fieldValue
                        }
                      </span>
                    </div>
                    <div className="sm:col-span-12 md:col-span-7">
                      <dl className="grid grid-cols-1 gap-y-8 border-b py-8 border-gray-200 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
                        <div>
                          <dt className="font-medium text-gray-900">
                            Delivery address
                          </dt>
                          <dd className="mt-3 text-gray-500">
                            <address className="not-italic">
                              <span className="block">
                                {user.firstName} {user.lastName}
                              </span>
                              <span className="block">
                                {order.deliveryAddress.street1},{" "}
                                {order.deliveryAddress.street2}
                              </span>
                              <span className="block">
                                {order.deliveryAddress.city},{" "}
                                {order.deliveryAddress.zip}
                              </span>
                            </address>
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-900">
                            Contact
                          </dt>
                          <dd className="mt-3 text-gray-500 space-y-3">
                          <span className="block">
                                {user.email}
                              </span>
                              <span className="block">
                                {user.contactNumber}
                              </span>
                          </dd>
                        </div>
                      </dl>
                      <p className="font-medium text-gray-900 mt-6 md:mt-10">
                        {status.status.charAt(0) +
                          status.status.slice(1).toLowerCase()}{" "}
                        on{" "}
                        {moment
                          .unix(status.timeStamp / 1000)
                          .format("MMMM Do, YYYY")}
                      </p>
                      <div className="mt-6">
                        <div className="bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-gray-600 rounded-full"
                            style={{
                              width: `calc((${product.step} * 2 + 1) / 8 * 100%)`,
                            }}
                          />
                        </div>
                        <div className="hidden sm:grid grid-cols-4 font-medium text-gray-600 mt-6">
                          <div className="text-gray-600">Order placed</div>
                          <div
                            className={classNames(
                              product.step > 0 ? "text-gray-600" : "",
                              "text-center"
                            )}
                          >
                            Processing
                          </div>
                          <div
                            className={classNames(
                              product.step > 1 ? "text-gray-600" : "",
                              "text-center"
                            )}
                          >
                            {order.delivery
                              ? "Shipped"
                              : "Ready for Collection"}
                          </div>
                          <div
                            className={classNames(
                              product.step > 2 ? "text-gray-600" : "",
                              "text-right"
                            )}
                          >
                            {order.delivery ? "Delivered" : "Collected"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* Billing */}
        <section aria-labelledby="summary-heading" className="mt-24">
          <h2 id="summary-heading" className="sr-only">
            Billing Summary
          </h2>

          <div className="bg-gray-50 rounded-lg py-6 px-6 lg:px-0 lg:py-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
            <dl className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:pl-8 lg:col-span-5">
              <div>
                <dt className="font-medium text-gray-900">Billing address</dt>
                <dd className="mt-3 text-gray-500">
                  <address className="not-italic">
                    <span className="block">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="block">
                      {user.address.street1}, {user.address.street2}
                    </span>
                    <span className="block">
                      {user.address.city}, {user.address.zip}
                    </span>
                  </address>
                </dd>
              </div>
              {/* <div>
                <dt className="font-medium text-gray-900">
                  Payment information
                </dt>
                <dd className="mt-3 flex">
                  <div>
                    <svg
                      aria-hidden="true"
                      width={36}
                      height={24}
                      viewBox="0 0 36 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-auto"
                    >
                      <rect width={36} height={24} rx={4} fill="#224DBA" />
                      <path
                        d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                        fill="#fff"
                      />
                    </svg>
                    <p className="sr-only">Visa</p>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-900">Ending with 4242</p>
                    <p className="text-gray-600">Expires 02 / 24</p>
                  </div>
                </dd>
              </div> */}
            </dl>

            <dl className="mt-8 divide-y divide-gray-200 text-sm lg:mt-0 lg:pr-8 lg:col-span-7">
              <div className="pb-4 flex items-center justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium text-gray-900">$72</dd>
              </div>
              <div className="py-4 flex items-center justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd className="font-medium text-gray-900">
                  ${order.delivery ? "2.5" : "0"}
                </dd>
              </div>
              {/* <div className="py-4 flex items-center justify-between">
                <dt className="text-gray-600">Tax</dt>
                <dd className="font-medium text-gray-900">$6.16</dd>
              </div> */}
              <div className="pt-4 flex items-center justify-between">
                <dt className="font-medium text-gray-900">Order total</dt>
                <dd className="font-medium text-gray-600">
                  ${order.totalAmount.toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
};

import moment from "moment";
import { Fragment, useEffect, useMemo, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import {
  selectOrderById,
} from "../../../../stores/slices/posSlice";
import{
    fetchUserOrders,
    fetchAnOrder
} from "../../../../stores/slices/userSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { SimpleTable } from "../../../components/Tables/SimpleTable";
import {
  fetchAllModelsBySkus,
  fetchModelBySku,
} from "../../StockTransfer/StockTransferForm";

const Header = ({ order }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <div className="flex items-center space-x-3 w-full">
        <div className="grow">
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

const PromoTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "promotion.fieldValue",
      },
      {
        Header: "Qty",
        accessor: "qty",
      },
      {
        Header: "Discount",
        accessor: "subTotal",
        Cell: (e) => `-$${Number.parseFloat(-e.value).toFixed(2)}`,
      },
    ],
    []
  );

  return (
    <div className="pt-6">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Promotions Applied
        </h3>
      </div>

      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

const VoucherTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Voucher Code",
        accessor: "voucherCode",
      },
      {
        Header: "Discount",
        accessor: "amount",
        Cell: (e) => `-$${Number.parseFloat(e.value).toFixed(2)}`,
      },
      {
        Header: "Expiry",
        accessor: "expiry",
        Cell: (e) => moment(e.value).format("DD/MM/YY"),
      },
    ],
    []
  );
  
  return (
    <div className="pt-6">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Vouchers Claimed
        </h3>
      </div>

      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export const PurchaseHistoryDetails = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const user = useSelector((state) =>
    selectOrderById(state, parseInt(userId))
  );
  const userStatus = useSelector((state) => state.user.status);

  const [lineItems, setLineItems] = useState([]);

  useEffect(() => {
    userStatus === "idle" && dispatch(fetchUserOrders(user));
  }, [userStatus, dispatch, user]);

  useEffect(() => {
    if (!user) {
      addToast(`Error: You cannot view User Order ${orderId}`, {
        appearance: "error",
        autoDismiss: true,
      });
      navigate("/user/purchaseHistory");
    }
    const orderLineItems = order?.lineItems || [];
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
              modelCode: data[index].modelCode,
              name: data[index].name,
            },
            promo: promo !== undefined ? promo.promotion.fieldValue : null,
          };
        })
      )
    );
  }, [user, addToast, navigate, userId]);

  return userStatus === "loading" ? (
    <div className="flex mt-5 items-center justify-center">
      <TailSpin color="#00BFFF" height={20} width={20} />
    </div>
  ) : (
    userStatus === "succeeded" && (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <NavigatePrev />
        <Header
          user={user}
        />
        <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            {/* Site Information list*/}
            <section aria-labelledby="applicant-information-title">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2
                    id="user-information-title"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Purchase History Information
                  </h2>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Customer No.
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user.customerId}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Transaction Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {moment(user.dateTime).format("DD/MM/YYYY, H:mm:ss")}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Total Amount
                      </dt>

                      <dd className="mt-1 text-sm text-gray-900">
                        ${user.totalAmount.toFixed(2)}
                      </dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Payment Type
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user.payments
                          .map((payment) => payment.paymentType)
                          .join(", ")}
                      </dd>
                    </div>
                    {user.voucher && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Voucher
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <address className="not-italic">
                            <span className="block">
                              ${user.voucher.amount}
                            </span>
                            <span className="block">
                              {user.voucher.voucherCode}
                            </span>
                          </address>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </section>
            <section aria-labelledby="line-items">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="md:col-span-2">
                  {Boolean(lineItems?.length) && <ItemTable data={lineItems} />}
                </div>
                {Boolean(user.promotions?.length) && (
                  <PromoTable data={user.promotions} />
                )}
                {user?.voucher && <VoucherTable data={[user?.voucher]} />}
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  );
};

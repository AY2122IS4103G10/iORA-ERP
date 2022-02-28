import {Link} from "react-router-dom";
import {useState, useEffect, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {EditableCell, SimpleTable} from "../../../components/Tables/SimpleTable";
import {selectAllOrder} from "../../../../stores/slices/posSlice";
import {fetchSiteOrders} from "../../../../stores/slices/posSlice";
import {SectionHeading} from "../../../components/HeadingWithTabs";

const columns = [
  {
    Header: "OrderId",
    accessor: "id",
  },
  {
    Header: "DateTime",
    accessor: "dateTime",
  },
  {
    Header: "Amount",
    accessor: (row) => row.payments.amount,
  },
  {
    Header: "Customer Number",
    accessor: (row) => row.customer.id,
  },
];

export const OrderTable = (data) => {
  return (
    <section aria-labelledby="stocks-level">
      <h2 className="ml-2 mb-4 text-lg leading-6 font-bold text-gray-900">Orders</h2>
      <div className="ml-2 mr-2">
        {data == undefined ? <p>loading</p> : <SimpleTable columns={columns} data={data} />}
      </div>
    </section>
  );
};

const tabs = [
  {name: "Order", href: "", current: false},
  {name: "History", href: "orderHistory", current: true},
];

export const PosPurchaseHistory = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectAllOrder);
  const orderStatus = useSelector((state) => state.pos.status);
  const siteId = useState(1);

  useEffect(() => {
    orderStatus === "idle" && dispatch(fetchSiteOrders(siteId));
  }, [orderStatus, dispatch]);

  return (
    <>
      <div className="min-h-full">
        <main className="py-10">
          <section aria-labelledby="stocks-level">
            <h2 className="ml-2 mb-4 text-lg leading-6 font-bold text-gray-900">Orders</h2>
            <div className="ml-2 mr-2">
              {data == undefined ? <p>loading</p> : <SimpleTable columns={columns} data={data} />}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

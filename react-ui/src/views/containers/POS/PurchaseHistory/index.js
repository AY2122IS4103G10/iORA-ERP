import moment from "moment";
import { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchSiteOrders,
  selectAllOrder,
} from "../../../../stores/slices/posSlice";
import { getASite, selectSite } from "../../../../stores/slices/siteSlice";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import { SimpleTable } from "../../../components/Tables/SimpleTable";

const columns = [
  {
    Header: "#",
    accessor: "id",
  },
  {
    Header: "Transaction Date",
    accessor: "dateTime",
    Cell: (e) => moment(e.value).format("DD/MM/YYYY, H:mm:ss"),
  },
  {
    Header: "Total Amount",
    accessor: "totalAmount",
    Cell: (row) => `$${row.value.toFixed(2)}`,
  },
  {
    Header: "Customer No.",
    accessor: (row) => row.customerId,
  },
];

export const PosPurchaseHistory = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectAllOrder);
  const siteId = useSelector(selectUserSite);
  const site = useSelector(selectSite);
  const posStatus = useSelector((state) => state.pos.status);

  const handleOnClick = (row) => navigate(`${pathname}/${row.original.id}`);

  useEffect(() => {
    posStatus === "idle" && dispatch(fetchSiteOrders(siteId));
  }, [dispatch, siteId, posStatus]);

  useEffect(() => {
    dispatch(getASite(siteId));
  }, [dispatch, siteId]);

  return posStatus === "loading" ? (
    <div className="flex mt-5 items-center justify-center">
      <TailSpin color="#00BFFF" height={20} width={20} />
    </div>
  ) : (
    <div className="min-h-full">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-6xl md:flex md:items-center md:justify-between md:space-x-5 px-3 pt-4">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {siteId != null ? site.name : "No Records"}
              </h1>
            </div>
          </div>
        </div>
        <div className="mt-8 max-w-6xl grid grid-cols-1 gap-6 lg:grid-flow-col-dense lg:grid-cols-1">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            <section aria-labelledby="stocks-level">
              <div className="ml-2 mr-2">
                {data === undefined ? (
                  <p>No Records</p>
                ) : (
                  <SimpleTable
                    columns={columns}
                    data={data}
                    handleOnClick={handleOnClick}
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

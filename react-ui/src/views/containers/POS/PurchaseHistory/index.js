import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import moment from "moment";
import {SimpleTable} from "../../../components/Tables/SimpleTable";
import {selectAllOrder} from "../../../../stores/slices/posSlice";
import {selectUserSite} from "../../../../stores/slices/userSlice";
import {fetchSiteOrders} from "../../../../stores/slices/posSlice";
import {getASite, selectSite} from "../../../../stores/slices/siteSlice";

const columns = [
  {
    Header: "#",
    accessor: "id",
  },
  {
    Header: "Transaction Date",
    accessor: (row) => moment(row.dateTime).format("DD/MM/YYYY"),

  },
  {
    Header: "Total Amount",
    accessor: "totalAmount",
    Cell: (row) => `$${row.value.toFixed(2)}`
  },
  {
    Header: "Customer No.",
    accessor: (row) => row.customerId,
  },
];

export const PosPurchaseHistory = (subsys) => {
  const {pathname} = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectAllOrder);
  const orderStatus = useSelector((state) => state.pos.status);
  const siteStatus = useSelector((state) => state.sites.status);
  const siteId = useSelector(selectUserSite);
  const site = useSelector(selectSite);

  const handleOnClick = (row) => navigate(`/str/pos/${row.original.id}`);

  useEffect(() => {
    dispatch(fetchSiteOrders(siteId));
  }, [dispatch, siteId]);

  useEffect(() => {
    dispatch(getASite(siteId));
  }, [dispatch, siteId]);

  return (
    <>
      <div className="min-h-full">
        <main className="py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {siteId != null ? site.name : "No Records"}
                </h1>
              </div>
            </div>
          </div>
          <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
            <div className="space-y-6 lg:col-start-1 lg:col-span-2">
              <section aria-labelledby="stocks-level">
                <div className="ml-2 mr-2">
                  {data === undefined ? (
                    <p>No Records</p>
                  ) : (
                    <SimpleTable columns={columns} data={data} handleOnClick={handleOnClick} />
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

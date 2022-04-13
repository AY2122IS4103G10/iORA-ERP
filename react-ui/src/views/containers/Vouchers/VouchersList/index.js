import moment from "moment";
import { useEffect, useMemo } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchCustomers
} from "../../../../stores/slices/customerSlice";
import {
  fetchVouchers,
  selectAllVouchers
} from "../../../../stores/slices/voucherSlice";
import {
  SelectColumnFilter,
  SimpleTable
} from "../../../components/Tables/SimpleTable";

export const VouchersTable = ({ data, handleOnClick }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Campaign",
        accessor: "campaign",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Voucher Code",
        accessor: "voucherCode",
      },
      {
        Header: "Value",
        accessor: "amount",
        Cell: (e) => `$${e.value}`,
      },
      {
        Header: "Expiry Date",
        accessor: "expiry",
        Cell: (e) => moment(e.value).format("DD/MM/YYYY"),
      },
      {
        Header: "Issued",
        accessor: "issued",
        Cell: (e) => (e.value ? "Yes" : "No"),
      },
      {
        Header: "Redeemed",
        accessor: "redeemed",
        Cell: (e) => (e.value ? "Yes" : "No"),
      },
    ], []
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable
          columns={columns}
          data={data}
          path={`/sm/vouchers`}
          handleOnClick={handleOnClick}
        />
      </div>
    </div>
  );
};

export const VouchersList = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectAllVouchers);
  const voucherStatus = useSelector((state) => state.vouchers.status);

  const handleOnClick = (row) =>
    navigate(`${pathname}/${row.original.voucherCode}`);

  useEffect(() => {
    voucherStatus === "idle" && dispatch(fetchVouchers());
  }, [voucherStatus, dispatch]);
  
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  return voucherStatus === "loading" ? (
    <div className="flex mt-5 items-center justify-center">
      <TailSpin color="#00BFFF" height={20} width={20} />
    </div>
  ) : (
    <VouchersTable data={data} handleOnClick={handleOnClick} />
  );
};

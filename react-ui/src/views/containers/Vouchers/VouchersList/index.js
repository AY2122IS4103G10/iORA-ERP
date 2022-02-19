import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { CogIcon } from "@heroicons/react/outline";

import {
  SimpleTable,
  SelectColumnFilter,
  OptionsCell,
} from "../../../components/Tables/SimpleTable";
import { SelectableTable } from "../../../components/Tables/SelectableTable";
import {
  fetchVouchers,
  selectAllVouchers,
} from "../../../../stores/slices/voucherSlice";

export const VouchersTable = () => {
  const columns = useMemo(
    () => [
      // {
      //   Header: "Id",
      //   accessor: "id",
      //   Cell: (e) => (
      //     <Link
      //       to={`/sm/vouchers/${e.value}`}
      //       className="hover:text-gray-700 hover:underline"
      //     >
      //       {e.value}
      //     </Link>
      //   ),
      // },
      {
        Header: "Voucher Code",
        accessor: "voucherCode",
        Cell: (e) => (
          <Link
            to={`/sm/vouchers/${e.value}`}
            className="hover:text-gray-700 hover:underline"
          >
            {e.value}
          </Link>
        ),
      },
      {
        Header: "Value",
        accessor: "amount",
        Cell: (e) => `$${e.value}`,
      },
      {
        Header: "Expiry Date",
        accessor: "expiry",
        Cell: (e) => moment(e.value).format("DD/MM/YY"),
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
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      // {
      //   Header: CogIcon,
      //   accessor: "accessor",
      //   Cell: OptionsCell({
      //     options: [
      //       {
      //         name: "Delete",
      //         navigate: "/products",
      //       },
      //     ],
      //   }),
      // },
    ],
    []
  );
  const dispatch = useDispatch();
  const data = useSelector(selectAllVouchers);
  const voucherStatus = useSelector((state) => state.vouchers.status);
  useEffect(() => {
    voucherStatus === "idle" && dispatch(fetchVouchers());
  }, [voucherStatus, dispatch]);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable columns={columns} data={data} path={`/sm/vouchers`}/>
      </div>
    </div>
  );
};

export const VouchersList = () => {
  return <VouchersTable />;
};

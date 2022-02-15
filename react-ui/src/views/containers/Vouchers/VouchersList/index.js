import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { CogIcon } from "@heroicons/react/outline";

import {
  SimpleTable,
  SelectColumnFilter,
  OptionsCell,
} from "../../../components/Tables/SimpleTable";
import { selectAllVouchers } from "../../../../stores/slices/voucherSlice";

export const VouchersTable = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        Cell: (e) => (
          <Link
            to={`/vouchers/${e.value}`}
            className="hover:text-gray-700 hover:underline"
          >
            {e.value}
          </Link>
        ),
      },
      {
        Header: "Voucher Code",
        accessor: "code",
        
      },
      {
        Header: "Value",
        accessor: "value",
        Cell: (e) => `$${e.value}`,
      },
      {
        Header: "Issued Date",
        accessor: "issuedDate",
        Cell: (e) => moment(e.value).format("lll"),
      },
      {
        Header: "Expiry Date",
        accessor: "expDate",
        Cell: (e) => moment(e.value).format("lll"),
      },
      {
        Header: "Redeemed",
        accessor: "isRedeemed",
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
  const data = useSelector(selectAllVouchers);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export const VouchersList = () => {
  return <VouchersTable />;
};

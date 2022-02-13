import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CogIcon } from "@heroicons/react/outline";

import {
  SimpleTable,
  SelectColumnFilter,
  OptionsCell,
} from "../../../components/Tables/SimpleTable";

export const VouchersTable = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "id",
      },
      {
        Header: "Voucher Code",
        accessor: "code",
        Cell: (e) => (
          <Link
            to={`/products/${e.value}`}
            className="hover:text-gray-700 hover:underline"
          >
            {e.value}
          </Link>
        ),
      },
      {
        Header: "Value",
        accessor: "value",
        Cell: (e) => `$${e.value}`,
      },
      {
        Header: "Issued Date",
        accessor: "issuedDate",
      },
      {
        Header: "Expiry Date",
        accessor: "expDate",
      },
      {
        Header: "Redeemed",
        accessor: "isRedeemed",
        Filter: SelectColumnFilter,
        filter: 'includes',
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
  const data = useSelector((state) => state.vouchers);
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

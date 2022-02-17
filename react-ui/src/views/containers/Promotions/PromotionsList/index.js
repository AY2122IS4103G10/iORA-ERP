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
import { fetchVouchers, selectAllVouchers } from "../../../../stores/slices/voucherSlice";

export const PromotionsTable = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
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
        Header: "Name",
        accessor: "name",
        
      },
      {
        Header: "Discounted Price",
        accessor: "discPrice",
        Cell: (e) => `$${e.value}`,
      },
      {
        Header: "Products",
        accessor: "products",
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
  const dispatch = useDispatch()
  const data = useSelector(selectAllVouchers);
  const voucherStatus = useSelector((state) => state.vouchers.status)
  useEffect(() => {
    voucherStatus === "idle" && dispatch(fetchVouchers())
  }, [voucherStatus, dispatch])
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export const PromotionsList = () => {
  return <PromotionsTable />;
};

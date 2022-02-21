import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CogIcon } from "@heroicons/react/outline";

import {
  SimpleTable,
  OptionsCell,
} from "../../../components/Tables/SimpleTable";
import {
  fetchPromotions,
  selectAllPromotions,
} from "../../../../stores/slices/promotionsSlice";
import {
  fetchProducts,
  selectAllProducts,
} from "../../../../stores/slices/productSlice";
import axios from "axios";
import { REST_ENDPOINT } from "../../../../constants/restEndpoint";

export const PromotionsTable = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        // Cell: (e) => (
        //   <Link
        //     to={`/sm/promotions/${e.value}`}
        //     className="hover:text-gray-700 hover:underline"
        //   >
        //     {e.value}
        //   </Link>
        // ),
      },
      {
        Header: "Name",
        accessor: "fieldValue",
      },
      {
        Header: "Discounted Price",
        accessor: "discountedPrice",
        Cell: (e) => `$${e.value}`,
      },
      {
        Header: (
          <div className="flex items-center">
            <CogIcon className="h-4 w-4" />
          </div>
        ),
        accessor: "accessor",
        disableSortBy: true,
        Cell: OptionsCell({
          options: [
            {
              name: "Delete",
              navigate: "/products",
            },
          ],
        }),
      },
    ],
    []
  );
  const dispatch = useDispatch();
  const data = useSelector(selectAllPromotions);
  // const products = useSelector(selectAllProducts);
  const promoStatus = useSelector((state) => state.promotions.status);
  const productStatus = useSelector((state) => state.products.status);

  useEffect(() => {
    promoStatus === "idle" && dispatch(fetchPromotions());
    // productStatus === "idle" && dispatch(fetchProducts());
  }, [promoStatus, productStatus, dispatch]);

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

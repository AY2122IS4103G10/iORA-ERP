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

export const PromotionsTable = ({ data, openModal, setName, setDiscPrice, setModalState }) => {
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
        Cell: (e) => {
          return (
            <button
              className="hover:text-gray-700 hover:underline"
              onClick={() => {
                setModalState("view")
                setName(e.value);
                setDiscPrice(e.row.original.discountedPrice);
                openModal();
              }}
            >
              {e.value}
            </button>
          );
        },
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
    [openModal,setName, setDiscPrice, setModalState]
  );
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export const PromotionsList = ({
  dispatch,
  openModal,
  setName,
  setDiscPrice,
  setModalState,
}) => {
  const data = useSelector(selectAllPromotions);
  const promoStatus = useSelector((state) => state.promotions.status);
  const productStatus = useSelector((state) => state.products.status);

  useEffect(() => {
    promoStatus === "idle" && dispatch(fetchPromotions());
  }, [promoStatus, productStatus, dispatch]);
  return (
    <PromotionsTable
      data={data}
      openModal={openModal}
      setName={setName}
      setDiscPrice={setDiscPrice}
      setModalState={setModalState}
    />
  );
};

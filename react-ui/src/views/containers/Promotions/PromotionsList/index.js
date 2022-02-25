import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { CogIcon } from "@heroicons/react/outline";
import {
  SimpleTable,
  DeleteCell,
} from "../../../components/Tables/SimpleTable";
import {
  fetchPromotions,
  selectAllPromotions,
  updateExistingPromotion,
} from "../../../../stores/slices/promotionsSlice";
import {
  fetchProducts,
  selectAllProducts,
} from "../../../../stores/slices/productSlice";

export const PromotionsTable = ({
  data,
  openModal,
  setName,
  setDiscPrice,
  setPromoId,
  setModalState,
  onDeletePromoClicked,
}) => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "fieldValue",
        Cell: (e) => {
          return (
            <button
              className="hover:text-gray-700 hover:underline"
              onClick={() => {
                setModalState("view");
                setName(e.value);
                setDiscPrice(e.row.original.discountedPrice);
                setPromoId(e.row.original.id);
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
        Header: "Status",
        accessor: "available",
        Cell: (e) =>
          e.row.original.available ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Disabled
            </span>
          ),
      },
      {
        Header: "",
        accessor: "accessor",
        disableSortBy: true,
        Cell: (e) =>
          e.row.original.available ? (
            <DeleteCell onClick={() => onDeletePromoClicked(e.row.original)} />
          ) : (
            <div></div>
          ),
      },
    ],
    [
      openModal,
      setName,
      setDiscPrice,
      setModalState,
      setPromoId,
      onDeletePromoClicked,
    ]
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
  setPromoId,
  setModalState,
}) => {
  const data = useSelector(selectAllPromotions);
  const promoStatus = useSelector((state) => state.promotions.status);
  const productStatus = useSelector((state) => state.products.status);

  const onDeletePromoClicked = ({
    id,
    fieldName,
    fieldValue,
    discountedPrice,
  }) => {
    dispatch(
      updateExistingPromotion({
        id,
        fieldName,
        fieldValue,
        discountedPrice,
        available: false,
      })
    )
      .unwrap()
      .then(() => {
        alert("Successfully disabled promotion");
      });
  };

  useEffect(() => {
    promoStatus === "idle" && dispatch(fetchPromotions());
  }, [promoStatus, productStatus, dispatch]);
  return (
    <PromotionsTable
      data={data}
      openModal={openModal}
      setName={setName}
      setDiscPrice={setDiscPrice}
      setPromoId={setPromoId}
      setModalState={setModalState}
      onDeletePromoClicked={onDeletePromoClicked}
    />
  );
};

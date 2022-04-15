import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
// import { PlusIcon } from "@heroicons/react/outline";
import { SimpleTable } from "../../../components/Tables/SimpleTable";
import {
  fetchPromotions,
  selectAllPromotions,
  updateExistingPromotion,
} from "../../../../stores/slices/promotionsSlice";
import { ToggleLeftLabel } from "../../../components/Toggles/LeftLabel";

export const PromotionsTable = ({
  data,
  handleOnClick,
  onDeletePromoClicked,
  // openProductsModal,
}) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "fieldValue",
        Cell: (e) => (
          <button
            className="font-medium hover:underline"
            onClick={() => handleOnClick(e.row)}
          >
            {e.value}
          </button>
        ),
      },
      {
        Header: "Quota",
        accessor: "quota",
      },
      {
        Header: "% Disc.",
        accessor: "coefficients",
        Cell: (e) => {
          return e.value
            .map((c) => ((1 - c) * 100).toFixed(0))
            .map((val) => {
              return val !== 100 ? val : 0;
            })
            .join(", ");
        },
      },
      {
        Header: "Fixed Disc.",
        accessor: "constants",
        Cell: (e) => e.value.join(", "),
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
        Cell: (e) => {
          const { available } = e.row.original;
          return (
            <div className="flex">
              <ToggleLeftLabel
                enabled={available}
                onEnabledChanged={() => onDeletePromoClicked(e.row.original)}
                label={!available ? "Enable" : "Disable"}
                toggleColor="red"
              />
            </div>
          );
        },
      },
    ],
    [onDeletePromoClicked, handleOnClick]
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
  setQuota,
  setPercent,
  setFixed,
  setCoefficients,
  setConstants,
  setGlobal,
  setStackable,
  setPromoId,
  setModalState,
}) => {
  const { addToast } = useToasts();
  const data = useSelector(selectAllPromotions);
  const promoStatus = useSelector((state) => state.promotions.status);
  useEffect(() => {
    promoStatus === "idle" && dispatch(fetchPromotions());
  }, [promoStatus, dispatch]);

  const handleOnClick = (row) => {
    setModalState("view");
    setName(row.original.fieldValue);
    setQuota(row.original.quota);
    setPercent(!row.original.coefficients.every((val) => val === 0.0));
    setFixed(!row.original.constants.every((val) => val === 0.0));
    setCoefficients(
      row.original.coefficients.map((c) => ((1 - c) * 100).toFixed(0)).join(",")
    );
    setConstants(row.original.constants.join(","));
    setGlobal(row.original.global);
    setStackable(row.original.stackable);
    setPromoId(row.original.id);
    openModal();
  };

  const onDeletePromoClicked = (item) => {
    dispatch(
      updateExistingPromotion({
        ...item,
        available: !item.available,
      })
    )
      .unwrap()
      .then(() => {
        addToast(
          `Success: ${item.available ? "Disabled" : "Enabled"} promotion`,
          {
            appearance: "success",
            autoDismiss: true,
          }
        );
      })
      .catch((err) =>
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        })
      );
  };

  return (
    <PromotionsTable
      data={data}
      openModal={openModal}
      handleOnClick={handleOnClick}
      setPromoId={setPromoId}
      setModalState={setModalState}
      onDeletePromoClicked={onDeletePromoClicked}
    />
  );
};

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
// import {
//   fetchProducts,
//   selectAllProducts,
// } from "../../../../stores/slices/productSlice";
// import { SimpleModal } from "../../../components/Modals/SimpleModal";
// import { Dialog } from "@headlessui/react";
// import { Link } from "react-router-dom";

// const ProductsModal = ({
//   open,
//   closeModal,
//   data,
//   onAddItemsClicked,
//   selectedRows,
//   setRowSelect,
// }) => {
//   const columns = useMemo(
//     () => [
//       {
//         Header: "Product Code",
//         accessor: "modelCode",
//         Cell: (e) => (
//           <Link
//             to={`/sm/products/${e.value}`}
//             className="hover:text-gray-700 hover:underline"
//           >
//             {e.value}
//           </Link>
//         ),
//       },
//       {
//         Header: "Name",
//         accessor: "name",
//       },
//       {
//         Header: "Color",
//         accessor: (row) =>
//           row.productFields
//             .filter((field) => field.fieldName === "COLOUR")
//             .map((field) => field.fieldValue)
//             .join(", "),
//       },
//       {
//         Header: "Size",
//         accessor: (row) =>
//           row.productFields
//             .filter((field) => field.fieldName === "SIZE")
//             .map((field) => field.fieldValue)
//             .join(", "),
//       },
//       {
//         Header: "List Price",
//         accessor: "price",
//         Cell: (e) => `$${e.value}`,
//       },
//       {
//         Header: "Available",
//         accessor: "available",
//         Cell: (e) => (e.value ? "Yes" : "No"),
//       },
//     ],

//     []
//   );
//   return (
//     <SimpleModal open={open} closeModal={closeModal}>
//       <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
//         <div>
//           <div className="mt-3 sm:mt-5">
//             <Dialog.Title
//               as="h3"
//               className="text-center text-lg leading-6 font-medium text-gray-900"
//             >
//               Add Items
//             </Dialog.Title>
//             <SimpleTable
//               columns={columns}
//               data={data}
//               rowSelect={true}
//               selectedRows={selectedRows}
//               setSelectedRows={setRowSelect}
//             />
//           </div>
//         </div>
//         <div className="pt-5">
//           <div className="flex justify-end">
//             <button
//               type="button"
//               className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
//               onClick={closeModal}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
//               onClick={onAddItemsClicked}
//             >
//               {!Boolean(data.length) ? "Add" : "Save"} items
//             </button>
//           </div>
//         </div>
//       </div>
//     </SimpleModal>
//   );
// };

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
        Header: "Coeff.",
        accessor: "coefficients",
        Cell: (e) => e.value.join(", "),
      },
      {
        Header: "Constants",
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
    setCoefficients(row.original.coefficients.join(","));
    setConstants(row.original.constants.join(","));
    setGlobal(row.original.global);
    setStackable(row.original.stackable);
    setPromoId(row.original.id);
    openModal();
  };

  // const [openProdModal, setOpenProdModal] = useState(false);
  // const products = useSelector(selectAllProducts);
  // const productStatus = useSelector((state) => state.products.status);
  // useEffect(() => {
  //   productStatus === "idle" && dispatch(fetchProducts());
  // }, [productStatus, dispatch]);

  // const [itemsToAdd, setItemsToAdd] = useState([]);
  // const [selectedRows, setSelectedRows] = useState([]);
  // const onAddItemsClicked = (evt) => {
  //   evt.preventDefault();
  //   const selectedRowKeys = Object.keys(selectedRows).map((key) =>
  //     parseInt(key)
  //   );
  //   const lineItems = [];
  //   selectedRowKeys.map((key) => lineItems.push(products[key]));
  //   setItemsToAdd(lineItems);
  //   closeProductsModal();
  // };

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
          `Successfully ${item.available ? "disabled" : "enabled"} promotion`,
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

  // const openProductsModal = () => setOpenProdModal(true);
  // const closeProductsModal = () => setOpenProdModal(false);

  return (
    <>
      <PromotionsTable
        data={data}
        openModal={openModal}
        handleOnClick={handleOnClick}
        setPromoId={setPromoId}
        setModalState={setModalState}
        onDeletePromoClicked={onDeletePromoClicked}
        // openProductsModal={openProductsModal}
      />
      {/* {Boolean(products.length) && (
        <ProductsModal
          open={openProdModal}
          closeModal={closeProductsModal}
          data={products}
          onAddItemsClicked={onAddItemsClicked}
          selectedRows={selectedRows}
          setRowSelect={setSelectedRows}
        />
      )} */}
    </>
  );
};

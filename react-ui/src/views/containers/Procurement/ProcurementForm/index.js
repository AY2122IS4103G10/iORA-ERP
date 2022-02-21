import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { api, sitesApi } from "../../../../environments/Api";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import {
  DeleteCell,
  EditableCell,
  SelectColumnFilter,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import {
  fetchProducts,
  selectAllProducts,
} from "../../../../stores/slices/productSlice";
import {
  fetchSites,
  selectAllSites,
} from "../../../../stores/slices/siteSlice";

const addModalColumns = [
  {
    Header: "Product Code",
    accessor: "modelCode",
    Filter: SelectColumnFilter,
    filter: "includes",
  },
  {
    Header: "SKU",
    accessor: "sku",
  },
  {
    Header: "Name",
    accessor: "name",
    Filter: SelectColumnFilter,
    filter: "includes",
  },
  {
    Header: "Color",
    accessor: (row) =>
      row.productFields.find((field) => field.fieldName === "COLOUR")
        .fieldValue,
  },
  {
    Header: "Size",
    accessor: (row) =>
      row.productFields.find((field) => field.fieldName === "SIZE").fieldValue,
  },
];

const itemsListColumns = [
  {
    Header: "Product Code",
    accessor: "modelCode",
  },
  {
    Header: "SKU",
    accessor: "sku",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Color",
    accessor: (row) =>
      row.productFields.find((field) => field.fieldName === "COLOUR")
        .fieldValue,
  },
  {
    Header: "Size",
    accessor: (row) =>
      row.productFields.find((field) => field.fieldName === "SIZE").fieldValue,
  },
  // {
  //   Header: "Quantity",
  //   accessor: "accessor",
  //   disableSortBy: true,
  //   Cell: <EditableCell />,
  // },
];

const storesListColumns = [
  {
    Header: "Product Code",
    accessor: "modelCode",
  },
  {
    Header: "SKU",
    accessor: "sku",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Color",
    accessor: (row) =>
      row.productFields.find((field) => field.fieldName === "COLOUR")
        .fieldValue,
  },
  {
    Header: "Size",
    accessor: (row) =>
      row.productFields.find((field) => field.fieldName === "SIZE").fieldValue,
  },
  {
    Header: "",
    accessor: "accessor",
    disableSortBy: true,
    Cell: (
      <div className="items-center">
        <DeleteCell />
      </div>
    ),
  },
];

export const ItemsList = ({
  cols,
  data,
  rowSelect = false,
  selectedRows,
  setRowSelect,
}) => {
  const columns = useMemo(() => cols, [cols]);
  return (
    <div className="mt-4">
      <SimpleTable
        columns={columns}
        data={data}
        rowSelect={rowSelect}
        selectedRows={selectedRows}
        setSelectedRows={setRowSelect}
      />
    </div>
  );
};

const AddProductItemModal = ({
  items,
  open,
  closeModal,
  selectedRows,
  setRowSelect,
  onAddItemsClicked,
}) => {
  return (
    <SimpleModal open={open} closeModal={closeModal}>
      <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
        <div>
          <div className="mt-3 sm:mt-5">
            <Dialog.Title
              as="h3"
              className="text-center text-lg leading-6 font-medium text-gray-900"
            >
              Add Items
            </Dialog.Title>
            <ItemsList
              cols={addModalColumns}
              data={items}
              rowSelect={true}
              selectedRows={selectedRows}
              setRowSelect={setRowSelect}
            />
          </div>
        </div>
        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={onAddItemsClicked}
            >
              {!Boolean(items.length) ? "Add" : "Save"} items
            </button>
          </div>
        </div>
      </div>
    </SimpleModal>
  );
};

const ProcurementFormBody = ({
  isEditing,
  factories,
  manufacturingSelected,
  setManufacturingSelected,
  warehouses,
  setWarehouseSelected,
  warehouseSelected,
  items,
  openProducts,
  onCancelClicked,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <div className="rounded-lg bg-white overflow-hidden shadow">
      <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="sr-only">
          {!isEditing ? "New" : "Edit"} Procurement Order
        </h1>
        <form className="p-8 space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-xl leading-6 font-medium text-gray-900">
                  {!isEditing ? "New" : "Edit"} Procurement Order
                </h3>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  {[
                    factories,
                    manufacturingSelected,
                    setManufacturingSelected,
                  ].every(Boolean) ? (
                    <SimpleSelectMenu
                      label="Manufacturing"
                      options={factories}
                      selected={manufacturingSelected}
                      setSelected={setManufacturingSelected}
                    />
                  ) : (
                    <div>No factories</div>
                  )}
                </div>
                <div className="sm:col-span-3">
                  {[warehouses, warehouseSelected, setWarehouseSelected].every(
                    Boolean
                  ) ? (
                    <SimpleSelectMenu
                      label="Warehouse"
                      options={warehouses}
                      selected={warehouseSelected}
                      setSelected={setWarehouseSelected}
                    />
                  ) : (
                    <div>No factories</div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-8">
              <div className="md:flex md:items-center md:justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Items List
                </h3>
                <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    onClick={openProducts}
                  >
                    {!Boolean(items.length) ? "Add" : "Edit"} items
                  </button>
                </div>
              </div>
              {Boolean(items.length) && (
                <ItemsList cols={itemsListColumns} data={items} />
              )}
            </div>

            <div className="pt-8">
              <div className="md:flex md:items-center md:justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Stores
                </h3>
                <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    onClick={openProducts}
                  >
                    Add store
                  </button>
                </div>
              </div>
            </div>
            {/* {Boolean(items.length) && (
            <ItemsList cols={itemsListColumns} data={stores} />
          )} */}
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                onClick={onCancelClicked}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export const ProcurementForm = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [manufacturing, setManufacturing] = useState(null);
  const [warehouse, setWarehouse] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [manufacturingSelected, setManufacturingSelected] = useState(null);
  const [warehouseSelected, setWarehouseSelected] = useState(null);
  const [openProducts, setOpenProducts] = useState(false);

  const skus = useSelector(selectAllProducts).flatMap((model) =>
    model.products.map((product) => ({
      ...product,
      modelCode: model.modelCode,
      name: model.name,
    }))
  );
  const prodStatus = useSelector((state) => state.products.status);
  useEffect(() => {
    prodStatus === "idle" && dispatch(fetchProducts());
  }, [prodStatus, dispatch]);

  const [factories, setFactories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  useEffect(() => {
    sitesApi
      .searchByType("Manufacturing")
      .then((response) => {
        setFactories(response.data);
        setWarehouseSelected(response.data[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    sitesApi
      .searchByType("Warehouse")
      .then((response) => {
        setWarehouses(response.data);
        setWarehouseSelected(response.data[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  const onManufacturingChanged = (e) => setManufacturing(e.target.value);
  const onWarehouseChanged = (e) => setWarehouse(e.target.value);

  const [selectedRows, setSelectedRows] = useState([]);

  const onAddItemsClicked = (evt) => {
    evt.preventDefault();
    const selectedRowKeys = Object.keys(selectedRows).map((key) =>
      parseInt(key)
    );
    const lineItems = []
    selectedRowKeys.map((key) => lineItems.push(skus[key]))
    setLineItems(lineItems);
    closeModal()
  };
  const openModal = () => setOpenProducts(true);
  const closeModal = () => setOpenProducts(false);

  const [requestStatus, setRequestStatus] = useState("idle");
  const canAdd =
    [manufacturingSelected, warehouseSelected, lineItems].every(Boolean) &&
    requestStatus === "idle";
  const onAddOrderClicked = (evt) => {
    evt.preventDefault();
    // if (canAdd)
    //   try {
    //     setRequestStatus("pending");
    //     dispatch(addNewVouchers({ name, expiry: siteCode })).unwrap();
    //     alert("Successfully added site");
    //     setName("");
    //     setManufacturing("");
    //     navigate(!isEditing ? "/ad/sites" : `/ad/sites/${orderId}`);
    //   } catch (err) {
    //     console.error("Failed to add site: ", err);
    //   } finally {
    //     setRequestStatus("idle");
    //   }
  };

  const onCancelClicked = () =>
    navigate(!isEditing ? "/sm/procurements" : `/sm/procurements/${orderId}`);

  useEffect(() => {
    Boolean(orderId) &&
      api.get("sam/procurementOrder", orderId).then((response) => {
        const {
          name,
          address,
          siteCode,
          active,
          stockLevel,
          company,
          procurementOrders,
        } = response.data;
        setIsEditing(true);
      });
  }, [orderId]);

  return (
    <>
      <ProcurementFormBody
        isEditing={isEditing}
        manufacturing={manufacturing}
        onManufacturingChanged={onManufacturingChanged}
        warehouse={warehouse}
        onWarehouseChanged={onWarehouseChanged}
        factories={factories}
        manufacturingSelected={manufacturingSelected}
        setManufacturingSelected={setManufacturingSelected}
        warehouses={warehouses}
        warehouseSelected={warehouseSelected}
        setWarehouseSelected={setWarehouseSelected}
        items={lineItems}
        openProducts={openModal}
        onCancelClicked={onCancelClicked}
      />
      <AddProductItemModal
        items={skus}
        open={openProducts}
        closeModal={closeModal}
        selectedRows={selectedRows}
        setRowSelect={setSelectedRows}
        onAddItemsClicked={onAddItemsClicked}
      />
    </>
  );
};

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { api, sitesApi } from "../../../../environments/Api";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import {
  EditableCell,
  SelectColumnFilter,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import {
  fetchProducts,
  selectAllProducts,
} from "../../../../stores/slices/productSlice";

import {
  addNewProcurement,
  updateExistingProcurement,
} from "../../../../stores/slices/procurementSlice";

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

const ProcurementItemsList = ({ data, setData }) => {
  const [skipPageReset, setSkipPageReset] = useState(false);

  const columns = useMemo(() => {
    const updateMyData = (rowIndex, columnId, value) => {
      setSkipPageReset(true);
      setData((old) =>
        old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              [columnId]: value,
            };
          }
          return row;
        })
      );
    };
    return [
      {
        Header: "Product Code",
        accessor: "modelCode",
      },
      {
        Header: "SKU",
        accessor: (row) => row.product.sku,
      },
      {
        Header: "Name",
        accessor: (row) => row.product.name,
      },
      {
        Header: "Color",
        accessor: (row) =>
          row.product.productFields.find(
            (field) => field.fieldName === "COLOUR"
          ).fieldValue,
      },
      {
        Header: "Size",
        accessor: (row) =>
          row.product.productFields.find((field) => field.fieldName === "SIZE")
            .fieldValue,
      },
      {
        Header: "Quantity",
        accessor: "requestedQty",
        disableSortBy: true,
        Cell: (row) => {
          return (
            <EditableCell
              value={1}
              row={row.row}
              column={row.column}
              updateMyData={updateMyData}
            />
          );
        },
      },
    ];
  }, [setData]);

  return (
    <div className="mt-4">
      <SimpleTable
        columns={columns}
        data={data}
        skipPageReset={skipPageReset}
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
  headquarters,
  hqSelected,
  setHqSelected,
  factories,
  manufacturingSelected,
  setManufacturingSelected,
  warehouses,
  setWarehouseSelected,
  warehouseSelected,
  items,
  setItems,
  openProducts,
  onAddOrderClicked,
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
                <div className="sm:col-span-2">
                  {[headquarters, hqSelected, setHqSelected].every(Boolean) ? (
                    <SimpleSelectMenu
                      label="HQ"
                      options={headquarters}
                      selected={hqSelected}
                      setSelected={setHqSelected}
                    />
                  ) : (
                    <div>No headquarters</div>
                  )}
                </div>
                <div className="sm:col-span-2">
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
                <div className="sm:col-span-2">
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
                <ProcurementItemsList data={items} setData={setItems} />
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
                  >
                    Add store
                  </button>
                </div>
              </div>
            </div>
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
                onClick={onAddOrderClicked}
              >
                {!isEditing ? "Create" : "Save"} order
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
  const [lineItems, setLineItems] = useState([]);
  const [hqSelected, setHqSelected] = useState(null);
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

  const [headquarters, setHeadquarters] = useState([]);
  const [factories, setFactories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  useEffect(() => {
    sitesApi
      .searchByType("Headquarters")
      .then((response) => {
        setHeadquarters(response.data);
        setHqSelected(response.data[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    sitesApi
      .searchByType("Manufacturing")
      .then((response) => {
        setFactories(response.data);
        setManufacturingSelected(response.data[0]);
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

  const [selectedRows, setSelectedRows] = useState([]);
  const onAddItemsClicked = (evt) => {
    evt.preventDefault();
    const selectedRowKeys = Object.keys(selectedRows).map((key) =>
      parseInt(key)
    );
    const lineItems = [];
    selectedRowKeys.map((key) => lineItems.push(skus[key]));
    setLineItems(
      lineItems.map(({ modelCode, ...item }) => ({
        modelCode,
        product: { ...item },
        requestedQty: 1,
      }))
    );
    closeModal();
  };
  const openModal = () => setOpenProducts(true);
  const closeModal = () => setOpenProducts(false);

  const [requestStatus, setRequestStatus] = useState("idle");

  const canAdd =
    [manufacturingSelected, warehouseSelected, lineItems].every(Boolean) &&
    requestStatus === "idle";

  const onAddOrderClicked = (evt) => {
    evt.preventDefault();
    if (canAdd)
      try {
        setRequestStatus("pending");
        if (!isEditing)
          dispatch(
            addNewProcurement({
              siteId: hqSelected.id,
              initialProcurement: {
                lineItems: lineItems.map(({ product, requestedQty }) => ({
                  product,
                  requestedQty,
                })),
                headquarters: hqSelected,
                manufacturing: manufacturingSelected,
                warehouse: warehouseSelected,
              },
            })
          )
            .unwrap()
            .then(() => {
              alert("Successfully created procurement order");
              navigate("/sm/procurements");
            });
        else
          dispatch(
            updateExistingProcurement({
              siteId: hqSelected.id,
              existingProcurement: {
                lineItems: lineItems.map(({ product, requestedQty }) => ({
                  product,
                  requestedQty,
                })),
                headquarters: hqSelected,
                manufacturing: manufacturingSelected,
                warehouse: warehouseSelected,
              },
            })
          )
            .unwrap()
            .then(() => {
              alert("Successfully updated procurement order");
              navigate(`/sm/procurements/${orderId}`);
            });
      } catch (err) {
        console.error("Failed to add procurement: ", err);
      } finally {
        setRequestStatus("idle");
      }
  };

  const onCancelClicked = () =>
    navigate(!isEditing ? "/sm/procurements" : `/sm/procurements/${orderId}`);

  useEffect(() => {
    Boolean(orderId) &&
      api.get("sam/procurementOrder", orderId).then((response) => {
        const { lineItems, headquarters, manufacturing, warehouse } =
          response.data;
        setIsEditing(true);
        setLineItems(lineItems);
        api
          .get("sam/viewSite", headquarters)
          .then((response) => response.data && setHqSelected(response.data));
        api
          .get("sam/viewSite", manufacturing)
          .then(
            (response) =>
              response.data && setManufacturingSelected(response.data)
          );
        api
          .get("sam/viewSite", warehouse)
          .then(
            (response) => response.data && setWarehouseSelected(response.data)
          );
      });
  }, [orderId]);

  return (
    <>
      <ProcurementFormBody
        isEditing={isEditing}
        headquarters={headquarters}
        hqSelected={hqSelected}
        setHqSelected={setHqSelected}
        factories={factories}
        manufacturingSelected={manufacturingSelected}
        setManufacturingSelected={setManufacturingSelected}
        warehouses={warehouses}
        warehouseSelected={warehouseSelected}
        setWarehouseSelected={setWarehouseSelected}
        items={lineItems}
        setItems={setLineItems}
        openProducts={openModal}
        onAddOrderClicked={onAddOrderClicked}
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

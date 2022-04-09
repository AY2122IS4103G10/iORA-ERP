import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { uploadFile } from "react-s3";
import { Dialog } from "@headlessui/react";
import { api, sitesApi } from "../../../../environments/Api";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import {
  EditableCell,
  SelectColumnFilter,
  SimpleTable,
  UploadFileCell,
} from "../../../components/Tables/SimpleTable";
import {
  fetchProducts,
  selectAllProducts,
} from "../../../../stores/slices/productSlice";
import {
  fetchHeadquarters,
  fetchManufacturing,
  fetchWarehouse,
  selectAllHeadquarters,
  selectAllManufacturing,
  selectAllWarehouse,
} from "../../../../stores/slices/siteSlice";
import { classNames } from "../../../../utilities/Util";
import { PaperClipIcon, XIcon } from "@heroicons/react/solid";
import { useRef } from "react";
import { awsConfig } from "../../../../config";
import { fetchAllModelsBySkus } from "../../StockTransfer/StockTransferForm";
import { TailSpin } from "react-loader-spinner";
window.Buffer = window.Buffer || require("buffer").Buffer;

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

const ProcurementItemsList = ({
  data,
  setData,
  setSelectedProduct,
  openInfoModal,
  stores,
  storeCheckedState,
}) => {
  const [skipPageReset, setSkipPageReset] = useState(false);

  const columns = useMemo(() => {
    const siteCols = stores
      .filter((_, index) => storeCheckedState[index])
      .map((store) => ({
        Header: () => (
          <div className="flex items-center justify-between">
            <span>{store.id}</span>
          </div>
        ),
        minWidth: 100,
        maxWidth: 130,
        accessor: `siteQuantities.${store.id}`,
        Cell: (row) => {
          const storeId = parseInt(row.column.id.split(".")[1]);
          return (
            <EditableCell
              value={row.row.original.siteQuantities[storeId]}
              row={row.row}
              column={row.column}
              updateMyData={updateSiteCol}
            />
          );
        },
      }));
    const updateSiteCol = (rowIndex, columnId, value) => {
      const split = columnId.split(".");
      columnId = split[0];
      const storeId = split[1];
      setSkipPageReset(true);
      setData((old) =>
        old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              [columnId]: { ...old[rowIndex][columnId], [storeId]: value },
              requestedQty: Object.values({
                ...old[rowIndex][columnId],
                [storeId]: value,
              })
                .map((val) => parseInt(val))
                .reduce((partialSum, a) => partialSum + a, 0),
            };
          }
          return row;
        })
      );
    };
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
        Header: "SKU",
        accessor: "product.sku",
        Cell: (e) => {
          return (
            <button
              className="font-medium hover:underline"
              onClick={() => {
                setSelectedProduct(e.row.original.product);
                openInfoModal();
              }}
            >
              <span className="text-ellipsis overflow-hidden">{e.value}</span>
            </button>
          );
        },
      },
      {
        Header: "Color",
        minWidth: 100,
        maxWidth: 130,
        accessor: (row) =>
          row.product.productFields.find(
            (field) => field.fieldName === "COLOUR"
          ).fieldValue,
        Cell: (e) => (
          <div className="text-ellipsis overflow-hidden">{e.value}</div>
        ),
      },
      {
        Header: "Size",
        minWidth: 30,
        maxWidth: 60,
        accessor: (row) =>
          row.product.productFields.find((field) => field.fieldName === "SIZE")
            .fieldValue,
      },
      {
        Header: "Cost Price",
        accessor: "costPrice",
        disableSortBy: true,
        Cell: (row) => {
          return (
            <EditableCell
              value={row.row.original.costPrice}
              step="0.01"
              min="0"
              row={row.row}
              column={row.column}
              updateMyData={updateMyData}
            />
          );
        },
      },
      {
        Header: "Sites",
        columns: siteCols,
      },
      {
        Header: "Total",
        accessor: "requestedQty",
        disableSortBy: true,
      },
    ];
  }, [setData, setSelectedProduct, openInfoModal, stores, storeCheckedState]);

  return (
    <div className="mt-4">
      <SimpleTable
        columns={columns}
        data={data}
        skipPageReset={skipPageReset}
        flex
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

const UploadFileList = ({ data, setData }) => {
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
        Header: "Name",
        accessor: "name",
        Cell: (e) => {
          return e.row.original.imageLinks.length ? (
            <a
              href={e.row.original.imageLinks[0]}
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {e.value}
            </a>
          ) : (
            e.value
          );
        },
      },
      {
        Header: "",
        accessor: "files",
        Cell: (e) => {
          const fileRef = useRef();
          return (
            <div>
              {e.value && Boolean(e.value.length) && (
                <div className="mt-1 mb-2 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {e.value.map((file, index) => {
                      const idx = index;
                      return (
                        <li
                          key={index}
                          className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                        >
                          <div className="w-0 flex-1 flex items-center">
                            <PaperClipIcon
                              className="flex-shrink-0 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="ml-2 flex-1 w-0 truncate">
                              {file.name ? file.name : file}
                            </span>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex space-x-4">
                            <button
                              type="button"
                              className="bg-white rounded-md font-medium text-cyan-600 hover:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                              onClick={() => {
                                setData((old) =>
                                  old.map((row, index) => {
                                    if (index === e.row.index) {
                                      return {
                                        ...old[e.row.index],
                                        files: e.value.filter(
                                          (_, index) => index !== idx
                                        ),
                                      };
                                    }
                                    return row;
                                  })
                                );
                              }}
                            >
                              <XIcon
                                className="flex-shrink-0 h-4 w-4"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              <div className="rounded-md font-medium">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-cyan-600 hover:text-cyan-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-500"
                >
                  <span>Upload</span>
                  <UploadFileCell
                    ref={fileRef}
                    value={e.value}
                    row={e.row}
                    column={e.column}
                    updateMyData={updateMyData}
                  />
                </label>
              </div>
            </div>
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

export const ProductModal = ({
  open,
  closeModal,
  product,
  files,
  onDownloadClicked,
}) => {
  return (
    <SimpleModal open={open} closeModal={closeModal}>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
        <div className="sm:block absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            onClick={closeModal}
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {product.name}
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Product Code
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {product.modelCode}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">SKU</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {product.sku}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Colour</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {
                  product.productFields.find(
                    (field) => field.fieldName === "COLOUR"
                  ).fieldValue
                }
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Size</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {
                  product.productFields.find(
                    (field) => field.fieldName === "SIZE"
                  ).fieldValue
                }
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {product.description}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Images</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                  {Boolean(product.imageLinks.length)
                    ? product.imageLinks.map((file, index) => (
                        <li key={index} className="relative">
                          <div className="group block w-full rounded-lg bg-gray-100 overflow-hidden">
                            <img
                              src={file}
                              alt=""
                              className="object-cover pointer-events-none"
                            />
                          </div>
                        </li>
                      ))
                    : "No images"}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </SimpleModal>
  );
};

const FormCheckboxes = ({
  legend,
  options,
  inputField,
  onFieldsChanged,
  fieldValues = [],
  isEditing,
  ...rest
}) => {
  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{legend}</legend>
      {options.map((option, index) => {
        return (
          <div key={index} className="ml-1 relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id={inputField}
                aria-describedby={inputField}
                name={inputField}
                type="checkbox"
                className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded"
                checked={
                  Boolean(fieldValues.length) ? fieldValues[index] : false
                }
                onChange={() => onFieldsChanged(index)}
                {...rest}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="comments" className="font-medium text-gray-700">
                {option.id}. {option.name}
              </label>
            </div>
          </div>
        );
      })}
    </fieldset>
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
  stores,
  onStoresChanged,
  storeCheckedState,
  setStoreCheckedState,
  items,
  setItems,
  models,
  setModels,
  openProducts,
  remarks,
  onRemarksChanged,
  onSaveOrderClicked,
  onCancelClicked,
  canAdd,
  loading,
  setSelectedProduct,
  openInfoModal,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <div className="rounded-lg bg-white overflow-hidden shadow">
      <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="sr-only">
          {!isEditing ? "New" : "Edit"} Procurement Order
        </h1>
        <form
          className="p-8 space-y-8 divide-y divide-gray-200"
          onSubmit={onSaveOrderClicked}
        >
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
                    <div>No warehouses</div>
                  )}
                </div>
                <div className="sm:col-span-2 max-h-56 overflow-auto">
                  {Boolean(stores.length) ? (
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          Stores
                        </label>
                        <button
                          className="mr-1 block text-sm font-medium text-cyan-700"
                          onClick={() => onStoresChanged(-1)}
                        >
                          {!storeCheckedState.every(Boolean)
                            ? "Select"
                            : "Deselect"}{" "}
                          all
                        </button>
                      </div>
                      <FormCheckboxes
                        legend="Stores"
                        options={stores}
                        inputField="Store"
                        onFieldsChanged={onStoresChanged}
                        fieldValues={storeCheckedState}
                        isEditing={isEditing}
                      />
                    </div>
                  ) : (
                    <div>No Stores</div>
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
                <ProcurementItemsList
                  data={items}
                  setData={setItems}
                  setSelectedProduct={setSelectedProduct}
                  openInfoModal={openInfoModal}
                  stores={stores}
                  storeCheckedState={storeCheckedState}
                />
              )}
            </div>
            {Boolean(models.length) && (
              <div className="pt-8">
                <div className="md:flex md:items-center md:justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Upload Files
                  </h3>
                </div>
                <UploadFileList data={models} setData={setModels} />
              </div>
            )}
            <div className="pt-8">
              <div className="md:flex md:items-center md:justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Remarks
                </h3>
              </div>
              <textarea
                rows={4}
                name="skus"
                id="skus"
                className="mt-4 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Leave remarks for manufacturer. Eg. Pack items into boxes of 5."
                value={remarks}
                onChange={onRemarksChanged}
              />
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
                className={classNames(
                  canAdd ? "bg-cyan-600 hover:bg-cyan-700" : "bg-cyan-800",
                  "ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                )}
                disabled={!canAdd}
              >
                {!isEditing ? "Create" : "Save"} order
                {loading && (
                  <div className="flex ml-2 items-center">
                    <TailSpin color="#FFFFFF" height={15} width={15} />
                  </div>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export const ProcurementForm = () => {
  const { addToast } = useToasts();
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [lineItems, setLineItems] = useState([]);
  const [models, setModels] = useState([]);
  const [files, setFiles] = useState([]);
  const [hqSelected, setHqSelected] = useState(null);
  const [manufacturingSelected, setManufacturingSelected] = useState(null);
  const [warehouseSelected, setWarehouseSelected] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [openProducts, setOpenProducts] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const skus = useSelector(selectAllProducts).flatMap((model) =>
    model.products.map((product) => ({
      ...product,
      modelCode: model.modelCode,
      name: model.name,
      imageLinks: model.imageLinks,
      description: model.description,
    }))
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const headquarters = useSelector(selectAllHeadquarters);
  const hq = headquarters[0];
  const hqStatus = useSelector((state) => state.sites.hqStatus);

  useEffect(() => {
    hqStatus === "idle" && dispatch(fetchHeadquarters());
  }, [hqStatus, dispatch]);

  useEffect(() => {
    setHqSelected(hq);
  }, [hq]);

  const factories = useSelector(selectAllManufacturing);
  const factory = factories[0];
  const factoryStatus = useSelector((state) => state.sites.manStatus);
  useEffect(() => {
    factoryStatus === "idle" && dispatch(fetchManufacturing());
  }, [factoryStatus, dispatch]);

  useEffect(() => {
    setManufacturingSelected(factory);
  }, [factory]);

  const warehouses = useSelector(selectAllWarehouse);
  const warehouse = warehouses[0];
  const warehouseStatus = useSelector((state) => state.sites.warStatus);
  useEffect(() => {
    warehouseStatus === "idle" && dispatch(fetchWarehouse());
  }, [warehouseStatus, dispatch]);

  useEffect(() => {
    setWarehouseSelected(warehouse);
  }, [warehouse]);

  const [stores, setStores] = useState([]);
  const [storeCheckedState, setStoreCheckedState] = useState([]);

  const onStoresChanged = (pos) => {
    const updateCheckedState = storeCheckedState.map((item, index) =>
      index === pos || pos === -1 ? !item : item
    );
    setStoreCheckedState(updateCheckedState);
    const siteQuantities = lineItems.length ? lineItems[0]?.siteQuantities : {};
    stores
      .filter((store, index) => {
        return (
          updateCheckedState[index] &&
          !Object.keys(siteQuantities).includes(store.id.toString())
        );
      })
      .forEach((store) => {
        siteQuantities[store.id] = 0;
      });
    stores
      .filter((store, index) => {
        return (
          !updateCheckedState[index] &&
          Object.keys(siteQuantities).includes(store.id.toString())
        );
      })
      .forEach((store) => {
        delete siteQuantities[store.id];
      });
    setLineItems(
      lineItems.map((item) => ({
        ...item,
        siteQuantities,
        requestedQty: Object.values(siteQuantities)
          .map((val) => parseInt(val))
          .reduce((partialSum, a) => partialSum + a, 0),
      }))
    );
  };

  useEffect(() => {
    const fetchStores = async () => {
      const { data } = await sitesApi.searchByType("Store");
      setStores(data);
      setStoreCheckedState(new Array(data.length).fill(false));
    };
    fetchStores();
  }, []);

  const [selectedRows, setSelectedRows] = useState([]);

  const onAddItemsClicked = (evt) => {
    evt.preventDefault();
    const selectedRowKeys = Object.keys(selectedRows).map((key) =>
      parseInt(key)
    );
    const lineItems = [];
    selectedRowKeys.map((key) => lineItems.push(skus[key]));
    const siteQuantities = {};
    stores
      .filter((_, index) => storeCheckedState[index])
      .forEach((store) => (siteQuantities[store.id] = 0));

    setLineItems(
      lineItems.map(({ ...item }) => ({
        product: { ...item },
        requestedQty: 0,
        costPrice: 0,
        siteQuantities,
      }))
    );
    const set = Array.from(
      new Set(lineItems.map((item) => item.modelCode))
    ).map((prod) => lineItems.find((i) => i.modelCode === prod));

    setModels(
      set.map(({ modelCode, name, imageLinks }) => ({
        modelCode,
        name,
        imageLinks,
        files: [],
      }))
    );
    closeModal();
  };

  const canAdd = [
    hqSelected,
    manufacturingSelected,
    warehouseSelected,
    lineItems.length,
    storeCheckedState.some(Boolean),
  ].every(Boolean);

  const handleUpload = async (file) => {
    try {
      const data = await uploadFile(file, awsConfig);
      return data.key;
    } catch (error) {
      addToast(`Error: ${error.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const handleAllUpload = async () => {
    const data = await Promise.all(
      models.map(async (item) => {
        return {
          ...item,
          files: await Promise.all(
            item.files.map(async (file) => {
              const data =
                typeof file === "string" ? file : await handleUpload(file);
              return data;
            })
          ),
        };
      })
    );
    return data;
  };

  const createProcurement = async (order) => {
    try {
      const { data } = await api.create(
        `sam/procurementOrder/create/${hqSelected.id}`,
        order
      );
      addToast("Successfully created procurement order", {
        appearance: "success",
        autoDismiss: true,
      });
      navigate(`/sm/procurements/${data.id}`);
    } catch (error) {
      addToast(`Error: ${error.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const updateProcurement = async (order) => {
    try {
      const { data } = await api.update(
        `sam/procurementOrder/update/${hqSelected.id}`,
        order
      );
      addToast("Successfully updated procurement order", {
        appearance: "success",
        autoDismiss: true,
      });
      navigate(`/sm/procurements/${data.id}`);
    } catch (error) {
      addToast(`Error: ${error.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const onSaveOrderClicked = async (evt) => {
    evt.preventDefault();
    if (canAdd) {
      setLoading(true);
      try {
        const uploaded = await handleAllUpload();
        const lIs = lineItems.map((item) => {
          const model = uploaded.find(
            (model) => model.modelCode === item.product.modelCode
          );
          const lineItem = {
            product: {
              sku: item.product.sku,
              productFields: item.product.productFields,
            },
            requestedQty: item.requestedQty,
            costPrice: item.costPrice,
            siteQuantities: item.siteQuantities,
          };
          if (model !== undefined) {
            lineItem.files = model.files;
          }
          return lineItem;
        });
        const order = {
          lineItems: lIs,
          headquarters: { id: hqSelected.id },
          manufacturing: { id: manufacturingSelected.id },
          warehouse: { id: warehouseSelected.id },
          notes: remarks,
        };
        if (isEditing) order["id"] = orderId;
        if (!isEditing) createProcurement(order);
        else updateProcurement(order);
      } catch (error) {
        addToast(`Error: ${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const onCancelClicked = () =>
    navigate(!isEditing ? "/sm/procurements" : `/sm/procurements/${orderId}`);

  const onFilesChanged = (e) =>
    setFiles(files.concat(Array.from(e.target.files)));

  const onRemarksChanged = (e) => setRemarks(e.target.value);

  useEffect(() => {
    const fetchSite = async (site) => {
      const { data } = await api.get("sam/viewSite", site);
      return data;
    };
    const fetchProcurement = async () => {
      const { data } = await api.get("sam/procurementOrder", orderId);
      const {
        lineItems: lIs,
        headquarters,
        manufacturing,
        warehouse,
        notes,
      } = data;
      setIsEditing(true);
      lIs.length &&
        setStoreCheckedState(
          stores
            .map((store) => store.id)
            .map((store) => {
              return Object.keys(lIs[0]?.siteQuantities)
                .map((qty) => parseInt(qty))
                .includes(store);
            })
        );
      fetchAllModelsBySkus(lIs).then((data) => {
        const arr = lIs.map((item, index) => ({
          ...item,
          product: {
            ...item.product,
            ...data[index],
          },
        }));
        setLineItems(arr);
        const set = Array.from(
          new Set(arr.map((item) => item.product.modelCode))
        ).map((prod) => arr.find((i) => i.product.modelCode === prod));
        setModels(
          set.map(({ product, files }) => ({
            modelCode: product.modelCode,
            name: product.name,
            imageLinks: product.imageLinks,
            files,
          }))
        );
      });
      setRemarks(notes);
      fetchSite(headquarters).then((data) => data && setHqSelected(data));
      fetchSite(manufacturing).then(
        (data) => data && setManufacturingSelected(data)
      );
      fetchSite(warehouse).then((data) => data && setWarehouseSelected(data));
      let selectedRows = {};
      lIs.forEach((_, index) => (selectedRows[index] = true));
      setSelectedRows(selectedRows);
    };

    Boolean(orderId) &&
      fetchProcurement().catch((error) =>
        addToast(`Error: ${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        })
      );
  }, [orderId, addToast, stores]);

  const openModal = () => setOpenProducts(true);
  const closeModal = () => setOpenProducts(false);

  const openInfoModal = () => setOpenInfo(true);
  const closeInfoModal = () => setOpenInfo(false);

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
        stores={stores}
        onStoresChanged={onStoresChanged}
        storeCheckedState={storeCheckedState}
        setStoreCheckedState={setStoreCheckedState}
        items={lineItems}
        setItems={setLineItems}
        models={models}
        setModels={setModels}
        openProducts={openModal}
        remarks={remarks}
        onRemarksChanged={onRemarksChanged}
        onSaveOrderClicked={onSaveOrderClicked}
        onCancelClicked={onCancelClicked}
        canAdd={canAdd}
        files={files}
        onFilesChanged={onFilesChanged}
        loading={loading}
        setSelectedProduct={setSelectedProduct}
        openInfoModal={openInfoModal}
      />
      <AddProductItemModal
        items={skus}
        open={openProducts}
        closeModal={closeModal}
        selectedRows={selectedRows}
        setRowSelect={setSelectedRows}
        onAddItemsClicked={onAddItemsClicked}
      />
      {selectedProduct && (
        <ProductModal
          open={openInfo}
          closeModal={closeInfoModal}
          product={selectedProduct}
        />
      )}
    </>
  );
};

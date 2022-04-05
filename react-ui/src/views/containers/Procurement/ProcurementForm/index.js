import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { uploadFile } from "react-s3";
import { Dialog } from "@headlessui/react";
import { api } from "../../../../environments/Api";
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
import { PaperClipIcon } from "@heroicons/react/solid";
import { useRef } from "react";
import { awsConfig } from "../../../../config";
import { fetchAllModelsBySkus } from "../../StockTransfer/StockTransferForm";

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

const ProcurementItemsList = ({ data, setData, isEditing }) => {
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
        Header: "SKU",
        accessor: "product.sku",
      },
      {
        Header: "Name",
        accessor: "product.name",
        enableRowSpan: true,
        Cell: (e) => {
          return e.row.original.product.imageLinks.length ? (
            <a
              href={e.row.original.product.imageLinks[0]}
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
        Header: "Cost Price",
        accessor: "costPrice",
        disableSortBy: true,
        Cell: (row) => {
          return (
            <EditableCell
              value={isEditing ? row.row.original.costPrice : 0}
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
        Header: "Quantity",
        accessor: "requestedQty",
        disableSortBy: true,
        Cell: (row) => {
          return (
            <EditableCell
              value={isEditing ? row.row.original.requestedQty : 1}
              row={row.row}
              column={row.column}
              updateMyData={updateMyData}
            />
          );
        },
      },
      // {
      //   Header: "Sites",
      //   columns: [
      //     {
      //       Header: "Site A",
      //       accessor: "[siteA]",
      //     },
      //     {
      //       Header: "Site B",
      //       accessor: "[siteB]",
      //     },
      //   ],
      // },
    ];
  }, [setData, isEditing]);

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

const UploadFileList = ({ data, setData }) => {
  const fileRef = useRef();
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
        accessor: "imageLinks",
        Cell: (e) => {
          return (
            <div>
              {e.value && Boolean(e.value.length) && (
                <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
                              Remove
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              <div className="mt-2 rounded-md font-medium">
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
  models,
  setModels,
  openProducts,
  remarks,
  onRemarksChanged,
  onSaveOrderClicked,
  onCancelClicked,
  canAdd,
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
                  isEditing={isEditing}
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
  const skus = useSelector(selectAllProducts).flatMap((model) =>
    model.products.map((product) => ({
      ...product,
      modelCode: model.modelCode,
      name: model.name,
      imageLinks: model.imageLinks,
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
        costPrice: 0,
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
      }))
    );
    closeModal();
  };

  const canAdd = [
    hqSelected,
    manufacturingSelected,
    warehouseSelected,
    lineItems.length,
  ].every(Boolean);

  const handleUpload = async (file) => {
    try {
      const { location } = await uploadFile(file, awsConfig);
      return location;
    } catch (error) {
      addToast(`Error: ${error.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const handleAllUpload = async () => {
    return Promise.all(
      models.map((item) => ({
        ...item,
        files: item.files.map((file) => handleUpload(file)),
      }))
    );
  };

  const createProcurement = async (order) => {
    try {
      const models = await handleAllUpload(order.lineItems);
      // console.log(models);
      // order.lineItems = lineItems;
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

  const onSaveOrderClicked = (evt) => {
    evt.preventDefault();
    if (canAdd)
      if (!isEditing)
        createProcurement({
          lineItems: lineItems.map(({ product, requestedQty, costPrice }) => ({
            product: {
              sku: product.sku,
              productFields: product.productFields,
            },
            requestedQty,
            costPrice,
          })),
          headquarters: { id: hqSelected.id },
          manufacturing: { id: manufacturingSelected.id },
          warehouse: { id: warehouseSelected.id },
          notes: remarks,
        });
      else
        updateProcurement({
          id: orderId,
          lineItems: lineItems.map(({ product, requestedQty, costPrice }) => ({
            product,
            requestedQty,
            costPrice,
          })),
          headquarters: { id: hqSelected.id },
          manufacturing: { id: manufacturingSelected.id },
          warehouse: { id: warehouseSelected.id },
          notes: remarks,
        });
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
      fetchAllModelsBySkus(lIs).then((data) => {
        const arr = lIs.map((item, index) => ({
          ...item,
          modelCode: data[index].modelCode,
          name: data[index].name,
          imageLinks: data[index].imageLinks,
        }));
        setLineItems(arr);
        console.log(arr);
        const set = Array.from(new Set(arr.map((item) => item.modelCode))).map(
          (prod) => arr.find((i) => i.modelCode === prod)
        );
        setModels(
          set.map(({ modelCode, name, imageLinks }) => ({
            modelCode,
            name,
            imageLinks,
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
      lineItems.forEach((_, index) => (selectedRows[index] = true));
      setSelectedRows(selectedRows);
    };

    Boolean(orderId) &&
      fetchProcurement().catch((error) =>
        addToast(`Error: ${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        })
      );
  }, [orderId, addToast, lineItems]);

  const openModal = () => setOpenProducts(true);
  const closeModal = () => setOpenProducts(false);

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

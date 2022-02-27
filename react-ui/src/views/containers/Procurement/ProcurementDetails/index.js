import {useDispatch} from "react-redux";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {PencilIcon} from "@heroicons/react/solid";
import {TrashIcon} from "@heroicons/react/outline";
import {NavigatePrev} from "../../../components/Breadcrumbs/NavigatePrev";
import {useEffect, useMemo, useState} from "react";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete/index.js";
import {deleteExistingProcurement} from "../../../../stores/slices/procurementSlice";
import {EditableCell, SimpleTable} from "../../../components/Tables/SimpleTable";
import {api, procurementApi} from "../../../../environments/Api";

const Header = ({
  pathname,
  procurementId,
  status,
  openModal,
  onAcceptClicked,
  onCancelOrderClicked,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{`Order #${procurementId}`}</h1>
        </div>
      </div>
      {status === "PENDING" &&
        (pathname.includes("/sm/procurements") ? (
          <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
            <Link to={`/sm/procurements/edit/${procurementId}`}>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
                disabled={status !== "PENDING"}>
                <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <span>Edit</span>
              </button>
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
              onClick={openModal}
              disabled={status !== "PENDING"}>
              <TrashIcon className="-ml-1 mr-2 h-5 w-5 text-white" aria-hidden="true" />
              <span>Delete</span>
            </button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
              onClick={onAcceptClicked}
              disabled={status !== "PENDING"}>
              <span>Accept order</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
              onClick={onCancelOrderClicked}
              disabled={status !== "PENDING"}>
              <span>Cancel order</span>
            </button>
          </div>
        ))}
    </div>
  );
};

const ItemsSummary = ({
  data,
  status,
  setData,
  pathname,
  onVerifyItemsClicked,
  onVerifyReceivedClicked,
}) => {
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
        accessor: (row) => row.product.sku,
      },
      {
        Header: "Color",
        accessor: (row) =>
          row.product.productFields.find((field) => field.fieldName === "COLOUR").fieldValue,
      },
      {
        Header: "Size",
        accessor: (row) =>
          row.product.productFields.find((field) => field.fieldName === "SIZE").fieldValue,
      },
      {
        Header: "Requested Qty",
        accessor: "requestedQty",
      },
      {
        Header: "Actual Qty",
        accessor: "actualQty",
        disableSortBy: true,
        Cell: (row) => {
          return status === "ACCEPTED" && pathname.includes("mf") ? (
            <EditableCell value={0} row={row.row} column={row.column} updateMyData={updateMyData} />
          ) : (
            "-"
          );
        },
      },
      {
        Header: "Qty Shipped",
        accessor: (row) => row.fulfilledProductItems.length,
        Cell: (row) => {
          return status === "SHIPPED" && pathname.includes("mf") ? row : "-";
        },
      },
      {
        Header: "Qty Received",
        accessor: (row) => row.actualProductItems.length,
        Cell: (row) => {
          return status === "SHIPPED" && pathname.includes("wh") ? (
            <EditableCell value={0} row={row.row} column={row.column} updateMyData={updateMyData} />
          ) : (
            "-"
          );
        },
      },
    ];
  }, [setData, status, pathname]);
  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Summary</h3>
        <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
          {status === "ACCEPTED" && pathname.includes("mf") ? (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={onVerifyItemsClicked}>
              Verify items
            </button>
          ) : status === "SHIPPED" && pathname.includes("wh") ? (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={onVerifyReceivedClicked}>
              Verify items
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      {Boolean(data.length) && (
        <div className="mt-4">
          <SimpleTable
            columns={columns}
            data={data}
            skipPageReset={skipPageReset}
            // hiddenColumns={["actualQty"]}
          />
        </div>
      )}
    </div>
  );
};

const ProcurementDetailsBody = ({
  status,
  lineItems,
  manufacturing,
  headquarters,
  warehouse,
  setLineItems,
  pathname,
  onVerifyItemsClicked,
  onVerifyReceivedClicked,
}) => (
  <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
    <div className="space-y-6 lg:col-start-1 lg:col-span-2">
      {/* Site Information*/}
      <section aria-labelledby="order-information-title">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2
              id="warehouse-information-title"
              className="text-lg leading-6 font-medium text-gray-900">
              Order Information
            </h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">{status}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">HQ</dt>
                <dd className="mt-1 text-sm text-gray-900">{headquarters}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Manufacturing</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {manufacturing ? manufacturing : "-"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Warehouse</dt>
                <dd className="mt-1 text-sm text-gray-900">{warehouse}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      <section aria-labelledby="order-summary">
        <ItemsSummary
          data={lineItems}
          status={status}
          setData={setLineItems}
          pathname={pathname}
          onVerifyItemsClicked={onVerifyItemsClicked}
          onVerifyReceivedClicked={onVerifyReceivedClicked}
        />
      </section>
    </div>
  </div>
);

export const ProcurementDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const {procurementId} = useParams();
  const [headquarters, setHeadquarters] = useState(null);
  const [manufacturing, setManufacturing] = useState(null);
  const [warehouse, setWarehouse] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [status, setStatus] = useState("");
  const [productItems, setProductItems] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    api.get("sam/procurementOrder", procurementId).then((response) => {
      const {headquarters, manufacturing, warehouse, lineItems, statusHistory} = response.data;
      setHeadquarters(headquarters);
      setManufacturing(manufacturing);
      setWarehouse(warehouse);
      setLineItems(
        lineItems.map((item) => ({
          ...item,
          // actualQuantity: 0,
        }))
      );
      setStatus(statusHistory[statusHistory.length - 1].status);
    });
  }, [procurementId]);

  const onDeleteSiteClicked = () => {
    try {
      dispatch(deleteExistingProcurement(procurementId))
        .unwrap()
        .then(() => {
          alert("Successfully deleted procurement");
          closeModal();
          navigate("/sm/procurements");
        });
    } catch (err) {
      console.error("Failed to add procurement: ", err);
    }
  };

  const onAcceptClicked = () => {
    procurementApi
      .acceptOrder(procurementId, manufacturing)
      .then((response) => {
        const {statusHistory} = response.data;
        setStatus(statusHistory[statusHistory.length - 1].status);
      })
      .then(() => {
        alert("Successfully accepted procurement");
      })
      .catch((error) => console.error("Failed to accept procurement: ", error.message));
  };

  const onCancelOrderClicked = () => {
    procurementApi
      .cancelOrder(procurementId, manufacturing)
      .then((response) => {
        const {statusHistory} = response.data;
        setStatus(statusHistory[statusHistory.length - 1].status);
      })
      .then(() => {
        alert("Successfully cancelled procurement");
      })
      .catch((error) => console.error("Failed to cancelled procurement: ", error.message));
  };

  const onVerifyItemsClicked = () => {
    lineItems.forEach((item) => {
      const {product, actualQty} = item;
      procurementApi
        .generateItems(product.sku, actualQty)
        .then((response) => {
          setProductItems(productItems.concat(response.data));
        })
        .catch((error) => console.error("Failed to cancelled procurement: ", error.message));
    });
    console.log(productItems);
    // procurementApi
    //   .fulfillOrder(manufacturing, {
    //     id: procurementId,
    //     lineItems: lineItems.map(({ id, product, requestedQty }) => ({
    //       id,
    //       product: {
    //         sku: product.sku,
    //       },
    //       requestedQty,
    //       fulfilledProductItems: productItems,
    //     })),
    //   })
    //   .then((response) => {
    //     const {
    //       headquarters,
    //       manufacturing,
    //       warehouse,
    //       fulfilledProductItems,
    //       statusHistory,
    //     } = response.data;
    //     setHeadquarters(headquarters);
    //     setManufacturing(manufacturing);
    //     setWarehouse(warehouse);
    //     setLineItems(
    //       lineItems.map((item) => ({
    //         ...item,
    //         actualQuantity: fulfilledProductItems.length,
    //       }))
    //     );
    //     setStatus(statusHistory[statusHistory.length - 1].status);
    //   })
    //   .catch((error) =>
    //     console.error("Failed to cancelled procurement: ", error.message)
    //   );
  };
  const onVerifyReceivedClicked = () => {};
  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);

  return (
    Boolean(procurementId) && (
      <>
        <div className="py-8 xl:py-10">
          <NavigatePrev
            page="Procurement Orders"
            path={
              pathname.includes("mf")
                ? "/mf/procurements"
                : pathname.includes("wh")
                ? "/wh/procurements"
                : "/sm/procurements"
            }
          />
          <Header
            pathname={pathname}
            procurementId={procurementId}
            status={status}
            openModal={openModal}
            onAcceptClicked={onAcceptClicked}
            onCancelOrderClicked={onCancelOrderClicked}
          />
          <ProcurementDetailsBody
            procurementId={procurementId}
            status={status}
            manufacturing={manufacturing}
            headquarters={headquarters}
            warehouse={warehouse}
            lineItems={lineItems}
            setLineItems={setLineItems}
            pathname={pathname}
            onVerifyItemsClicked={onVerifyItemsClicked}
            onVerifyReceivedClicked={onVerifyReceivedClicked}
          />
        </div>
        <ConfirmDelete
          item={`Order #${procurementId}`}
          open={openDelete}
          closeModal={closeModal}
          onConfirm={onDeleteSiteClicked}
        />
      </>
    )
  );
};

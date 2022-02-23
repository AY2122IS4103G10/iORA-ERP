import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PencilIcon } from "@heroicons/react/solid";
import { TrashIcon } from "@heroicons/react/outline";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { useEffect, useMemo, useState } from "react";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete/index.js";
import {
  deleteExistingProcurement,
  fetchProcurements,
  selectProcurementById,
} from "../../../../stores/slices/procurementSlice";
import {
  EditableCell,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";

const Header = ({ procurementId, status, openModal }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{`Order #${procurementId}`}</h1>
        </div>
      </div>
      {status === "PENDING" && (
        <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
          <Link to={`/sm/procurements/edit/${procurementId}`}>
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
            >
              <PencilIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span>Edit</span>
            </button>
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
          >
            <TrashIcon
              className="-ml-1 mr-2 h-5 w-5 text-white"
              aria-hidden="true"
            />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

const ItemsSummary = ({ data }) => {
  const columns = useMemo(() => {
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
      },
    ];
  }, []);
  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Summary</h3>
        <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            // onClick={openProducts}
          >
            Verify items
          </button>
        </div>
      </div>
      {Boolean(data.length) && (
        <div className="mt-4">
          <SimpleTable columns={columns} data={data} />
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
}) => (
  <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
    <div className="space-y-6 lg:col-start-1 lg:col-span-2">
      {/* Site Information*/}
      <section aria-labelledby="order-information-title">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2
              id="warehouse-information-title"
              className="text-lg leading-6 font-medium text-gray-900"
            >
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
                <dt className="text-sm font-medium text-gray-500">
                  Manufacturing
                </dt>
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
        <ItemsSummary data={lineItems} />
      </section>
    </div>
  </div>
);

export const ProcurementDetails = () => {
  const { procurementId } = useParams();
  const procurement = useSelector((state) =>
    selectProcurementById(state, parseInt(procurementId))
  );
  const [openDelete, setOpenDelete] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const procurementsStatus = useSelector((state) => state.procurements.status);
  useEffect(() => {
    procurementsStatus === "idle" && dispatch(fetchProcurements());
  }, [procurementsStatus, dispatch]);

  const onDeleteSiteClicked = () => {
    try {
      dispatch(deleteExistingProcurement(procurementId));
      alert("Successfully deleted procurement");
      closeModal();
      navigate("/ad/sites");
    } catch (err) {
      console.error("Failed to add promo: ", err);
    }
  };

  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);

  return (
    Boolean(procurement) && (
      <>
        <div className="py-8 xl:py-10">
          <NavigatePrev page="Procurement Orders" path="/sm/procurements" />
          <Header
            procurementId={procurementId}
            status={
              procurement.statusHistory[procurement.statusHistory.length - 1]
                .status
            }
          />
          <ProcurementDetailsBody
            procurementId={procurementId}
            status={
              procurement.statusHistory[procurement.statusHistory.length - 1]
                .status
            }
            manufacturing={procurement.manufacturing}
            headquarters={procurement.headquarters}
            warehouse={procurement.warehouse}
            lineItems={procurement.lineItems}
            openModal={openModal}
          />
        </div>
        <ConfirmDelete
          item={`Order #${procurement.id}`}
          open={openDelete}
          closeModal={closeModal}
          onConfirm={onDeleteSiteClicked}
        />
      </>
    )
  );
};

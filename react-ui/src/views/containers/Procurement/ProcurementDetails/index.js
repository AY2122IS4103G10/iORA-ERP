import { useMemo, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import AWS from "aws-sdk";
import moment from "moment";
import { SimpleTable } from "../../../components/Tables/SimpleTable";
import { useOutletContext } from "react-router-dom";
import { classNames } from "../../../../utilities/Util";
import { sitesApi } from "../../../../environments/Api";
import { eventTypes } from "../../../../constants/eventTypes";
import { ProductSticker } from "../../Products/ProductPrint";
import { forwardRef } from "react";
import { awsConfig } from "../../../../config";
import { DownloadIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ProductModal } from "../ProcurementForm";

const ItemsSummary = ({
  subsys,
  data,
  handlePrint,
  onDownloadClicked,
  setSelectedProduct,
  openInfoModal,
  status,
}) => {
  const siteCols = Object.keys(data[0]?.siteQuantities).map((store) => ({
    Header: () => (
      <div className="flex items-center justify-between">
        <span>{store}</span>
      </div>
    ),
    minWidth: 100,
    maxWidth: 130,
    accessor: `siteQuantities.${store}`,
  }));
  const columns = useMemo(() => {
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
        Header: "Cost",
        accessor: "costPrice",
        Cell: (e) => `$${e.value.toFixed(2)}`,
      },
      {
        Header: "Total Cost",
        accessor: (row) => {
          var qty;
          if (status === "PICKED" || status === "PACKING") {
            qty = row.pickedQty;
          } else if (
            ["PENDING", "ACCEPTED", "MANUFACTURED", "PICKING"].some(
              (s) => s === status
            )
          ) {
            qty = row.requestedQty;
          } else qty = row.packedQty;
          return row.costPrice * qty;
        },
        Cell: (e) => `$${e.value.toFixed(2)}`,
      },
      {
        Header: "Sites",
        accessor: "siteQuantities",
        columns: siteCols,
      },
      {
        Header: "Total Qty",
        accessor: (row) => {
          if (status === "PICKED" || status === "PACKING") {
            return row.pickedQty;
          } else if (
            ["PENDING", "ACCEPTED", "MANUFACTURED", "PICKING"].some(
              (s) => s === status
            )
          ) {
            return row.requestedQty;
          } else return row.packedQty;
        },
      },
      {
        Header: "",
        accessor: "files",
        disableSortBy: true,
        Cell: (e) => {
          return (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
                  disabled={!e.value.length}
                >
                  Files
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="z-20 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {e.value.map((file, index) => {
                      return (
                        <Menu.Item key={index}>
                          <div className="pr-4 flex items-center justify-between text-sm">
                            <div className="overflow-hidden truncate block px-4 py-2 text-sm text-gray-700">
                              <span className="flex-1 w-0 truncate">
                                {file}
                              </span>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex space-x-4">
                              <button
                                type="button"
                                className="bg-white rounded-md font-medium text-cyan-600 hover:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                onClick={() => onDownloadClicked(file)}
                              >
                                <DownloadIcon
                                  className="flex-shrink-0 h-4 w-4"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        </Menu.Item>
                      );
                    })}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          );
        },
      },
    ];
  }, [onDownloadClicked, openInfoModal, setSelectedProduct, siteCols, status]);
  const hiddenColumns = subsys === "lg" ? ["files"] : [];
  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Summary</h3>
        <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
          <button
            type="button"
            className="ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
            onClick={handlePrint}
          >
            <span>Print Labels</span>
          </button>
        </div>
      </div>
      {Boolean(data.length) && (
        <div className="mt-4">
          <SimpleTable
            columns={columns}
            data={data}
            hiddenColumns={hiddenColumns}
          />
        </div>
      )}
    </div>
  );
};

export const ActivitySection = ({ history }) => {
  return (
    <section
      aria-labelledby="timeline-title"
      className="lg:col-start-3 lg:col-span-1 max-h-96"
    >
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6 max-h-full overflow-auto">
        <h2 id="timeline-title" className="text-lg font-medium text-gray-900">
          Activity
        </h2>

        {/* Activity Feed */}
        <div className="mt-6 flow-root">
          <ul className="-mb-8">
            {history.map((item, itemIdx) => (
              <li key={item.id}>
                <div className="relative pb-8">
                  {itemIdx !== history.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={classNames(
                          item.type.bgColorClass,
                          "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                        )}
                      >
                        <item.type.icon
                          className="w-5 h-5 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {item.content}{" "}
                          <span className="font-medium text-gray-900">
                            {item.target}
                          </span>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {item.date}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const ProcurementDetailsBody = ({
  subsys,
  history,
  status,
  lineItems,
  manufacturing,
  headquarters,
  warehouse,
  notes,
  handlePrint,
  onDownloadClicked,
  openInfoModal,
  setSelectedProduct,
}) => (
  <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
    <div className="space-y-6 lg:col-start-1 lg:col-span-2">
      {/* Procurement Information*/}
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
              {headquarters && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Created by
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <address className="not-italic">
                      <span className="block">{headquarters.name}</span>
                      <span className="block">{headquarters.address.road}</span>
                      <span className="block">
                        {headquarters.address.city},{" "}
                        {headquarters.address.postalCode}
                      </span>
                      <span className="block">{headquarters.phoneNumber}</span>
                    </address>
                  </dd>
                </div>
              )}
              {manufacturing && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">From</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <address className="not-italic">
                      <span className="block">{manufacturing.name}</span>
                      <span className="block">
                        {manufacturing.address.road}
                      </span>
                      <span className="block">
                        {manufacturing.address.city},{" "}
                        {manufacturing.address.postalCode}
                      </span>
                      <span className="block">{manufacturing.phoneNumber}</span>
                    </address>
                  </dd>
                </div>
              )}
              {warehouse && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">To</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <address className="not-italic">
                      <span className="block">{warehouse.name}</span>
                      <span className="block">{warehouse.address.road}</span>
                      <span className="block">
                        {warehouse.address.city}, {warehouse.address.postalCode}
                      </span>
                      <span className="block">{warehouse.phoneNumber}</span>
                    </address>
                  </dd>
                </div>
              )}
              {notes && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Remarks</dt>
                  <dd className="mt-1 text-sm text-gray-900">{notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>
    </div>
    {history && Boolean(history.length) && (
      <ActivitySection history={history} />
    )}
    {Boolean(lineItems.length) && (
      <div className="lg:col-start-1 lg:col-span-3">
        <section aria-labelledby="order-summary">
          <ItemsSummary
            subsys={subsys}
            status={status}
            data={lineItems}
            handlePrint={handlePrint}
            onDownloadClicked={onDownloadClicked}
            openInfoModal={openInfoModal}
            setSelectedProduct={setSelectedProduct}
          />
        </section>
      </div>
    )}
  </div>
);

const ProductStickerPrint = forwardRef(({ products }, ref) => {
  return (
    <div ref={ref} className="py-4 overflow-auto">
      <ul className="grid grid-cols-3 gap-6">
        {products.map((product, index) =>
          new Array(parseInt(product.requestedQty))
            .fill(product)
            .map((product, index) => (
              <li key={index} className="ml-3 col-span-1">
                <ProductSticker product={product.product} />
              </li>
            ))
        )}
      </ul>
    </div>
  );
});

export const fetchActionBy = async (actionBy) => {
  const { data } = await sitesApi.getSiteSAM(
    Boolean(actionBy.id) ? actionBy.id : actionBy
  );
  return data;
};
export const fetchAllActionBy = async (statusHistory) => {
  return Promise.all(
    statusHistory.map(({ actionBy }) => fetchActionBy(actionBy))
  );
};
export const ProcurementDetails = () => {
  const {
    subsys,
    status,
    statusHistory,
    headquarters,
    manufacturing,
    warehouse,
    notes,
    lineItems,
    setLineItems,
  } = useOutletContext();
  const { pathname } = useLocation();
  const [history, setHistory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const onDownloadClicked = (file) => {
    AWS.config.update({
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
    });
    const handleDownload = () => {
      const s3 = new AWS.S3({ region: awsConfig.region });
      const bucketParams = {
        Bucket: awsConfig.bucketName,
        Key: file,
      };

      s3.getObject(bucketParams, (err, data) => {
        if (err) {
          console.log(err, err.stack);
        } else {
          let blob = new Blob([data.Body], { type: data.ContentType });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = `/${file}`;
          link.click();
        }
      });
    };
    return handleDownload();
  };

  useEffect(() => {
    fetchAllActionBy(statusHistory).then((data) => {
      setHistory(
        statusHistory.map(({ status, timeStamp }, index) => ({
          id: index,
          type:
            status === "PENDING"
              ? index === 0
                ? eventTypes.created
                : eventTypes.completed
              : ["PICKING", "PACKING", "SHIPPING"].some((s) => s === status)
              ? eventTypes.action
              : status === "CANCELLED"
              ? eventTypes.cancelled
              : eventTypes.completed,
          content:
            status === "PENDING"
              ? `${index === 0 ? "Created" : "Updated"} by`
              : status === "READY_FOR_SHIPPING"
              ? "Ready for shipping by"
              : status === "SHIPPING_MULTIPLE"
              ? "Shipping multiple"
              : `${status.charAt(0) + status.slice(1).toLowerCase()} by`,
          target: data[index].name,
          date: moment.unix(timeStamp / 1000).format("DD/MM, H:mm"),
        }))
      );
    });
  }, [statusHistory]);

  const openInfoModal = () => setOpenInfo(true);
  const closeInfoModal = () => setOpenInfo(false);

  console.log(lineItems);
  return (
    <>
      <ProcurementDetailsBody
        subsys={subsys}
        status={status.status}
        statusHistory={statusHistory}
        manufacturing={manufacturing}
        headquarters={headquarters}
        warehouse={warehouse}
        notes={notes}
        lineItems={lineItems}
        setLineItems={setLineItems}
        pathname={pathname}
        history={history}
        handlePrint={handlePrint}
        onDownloadClicked={onDownloadClicked}
        openInfoModal={openInfoModal}
        setSelectedProduct={setSelectedProduct}
      />
      <div className="hidden">
        <ProductStickerPrint
          ref={componentRef}
          products={lineItems.map(({ product, requestedQty }) => ({
            product,
            requestedQty,
          }))}
        />
      </div>
      {selectedProduct && (
        <ProductModal
          open={openInfo}
          closeModal={closeInfoModal}
          product={selectedProduct}
          onDownloadClicked={onDownloadClicked}
        />
      )}
    </>
  );
};

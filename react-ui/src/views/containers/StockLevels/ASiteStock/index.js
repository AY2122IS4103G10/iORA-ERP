import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import {
  fetchSites,
  selectSiteById,
} from "../../../../stores/slices/siteSlice";
import { SimpleTable } from "../../../components/Tables/SimpleTable";
import { fetchAllModelsBySkus } from "../../StockTransfer/StockTransferForm";
import { useState } from "react";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { SelectColumnFilter } from "../../../components/Tables/ClickableRowTable";

const columns = [
  {
    Header: "Product Code",
    accessor: "modelCode",
    Filter: SelectColumnFilter,
    filter: "includes",
    Cell: (e) =>
      e.row.original.status === "Low" ? (
        <span className="text-red-500">{e.value}</span>
      ) : (
        e.value
      ),
  },
  {
    Header: "SKU Code",
    accessor: "sku",
    Cell: (e) =>
      e.row.original.status === "Low" ? (
        <span className="text-red-500">{e.value}</span>
      ) : (
        e.value
      ),
  },
  {
    Header: "Name",
    accessor: "name",
    Cell: (e) => {
      return e.row.original.imageLinks?.length ? (
        <a
          href={e.row.original.imageLinks[0]}
          className="hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {e.row.original.status === "Low" ? (
            <span className="text-red-500">{e.value}</span>
          ) : (
            e.value
          )}
        </a>
      ) : e.row.original.status === "Low" ? (
        <span className="text-red-500">{e.value}</span>
      ) : (
        e.value
      );
    },
  },
  {
    Header: "Color",
    accessor: (row) =>
      row.product.productFields.find((field) => field.fieldName === "COLOUR")
        .fieldValue,
    Cell: (e) =>
      e.row.original.status === "Low" ? (
        <span className="text-red-500">{e.value}</span>
      ) : (
        e.value
      ),
  },
  {
    Header: "Size",
    accessor: (row) =>
      row.product.productFields.find((field) => field.fieldName === "SIZE")
        .fieldValue,
    Cell: (e) =>
      e.row.original.status === "Low" ? (
        <span className="text-red-500">{e.value}</span>
      ) : (
        e.value
      ),
  },
  {
    Header: "Qty",
    accessor: "qty",
    Cell: (e) =>
      e.row.original.status === "Low" ? (
        <span className="text-red-500">{e.value}</span>
      ) : (
        e.value
      ),
  },
  {
    Header: "Status",
    accessor: "status",
    Filter: SelectColumnFilter,
    filter: "includes",
    Cell: (e) =>
      e.value === "Low" ? <span className="text-red-500">Low</span> : e.value,
  },
];

const processAddress = (addressObj) => {
  const str =
    addressObj.city +
    ", " +
    addressObj.road +
    ", " +
    addressObj.unit +
    ", " +
    addressObj.postalCode;
  return str;
};

export const AsiteStock = ({ subsys }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const site = useSelector((state) => selectSiteById(state, parseInt(id)));
  const status = useSelector((state) => state.sites.status);
  const [loading, setLoading] = useState(false);
  const [lineItems, setLineItems] = useState([]);

  useEffect(() => {
    dispatch(fetchSites());
  }, [dispatch, id]);

  useEffect(() => {
    setLoading(true);
    if (Boolean(site)) {
      const products = site?.stockLevel.products;
      products &&
        fetchAllModelsBySkus(products).then((data) => {
          setLineItems(
            products.map((stock, index) => ({
              ...stock,
              modelCode: data[index].modelCode,
              name: data[index].name,
              imageLinks: data[index].imageLinks,
              status: stock.product.baselineQty > stock.qty ? "Low" : "Normal",
            }))
          );
          setLoading(false);
        });
    }
  }, [site]);
  return status === "succeeded" ? (
    <>
      <div className="min-h-full">
        <main className="py-10">
          {/* Page header */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <NavigatePrev
              page="Stock Levels"
              path={`/${subsys}/stocklevels/sites`}
            />
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {site.length !== 0 ? site.name : "loading"}
                </h1>
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
            <div className="space-y-6 lg:col-start-1 lg:col-span-2">
              {/* Site Information list*/}
              <section aria-labelledby="applicant-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2
                      id="applicant-information-title"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Site Information
                    </h2>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Site Code
                        </dt>
                        {site.length !== 0 ? (
                          <dd className="mt-1 text-sm text-gray-900">
                            {site.siteCode}
                          </dd>
                        ) : (
                          <dd className="mt-1 text-sm text-gray-900">
                            loading
                          </dd>
                        )}
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Company
                        </dt>
                        {site.length !== 0 ? (
                          <dd className="mt-1 text-sm text-gray-900">
                            {site.company.name}
                          </dd>
                        ) : (
                          <dd className="mt-1 text-sm text-gray-900">
                            loading
                          </dd>
                        )}
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {site.length !== 0
                            ? processAddress(site.address)
                            : "loading"}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Telephone
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {site.length !== 0 ? site.phoneNumber : "loading"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </section>

              {/* Stock Levels*/}
              <section aria-labelledby="stocks-level">
                <h2 className="ml-2 mb-4 text-lg leading-6 font-bold text-gray-900">
                  Stock Levels
                </h2>
                <div className="ml-2 mr-2">
                  {loading ? (
                    <div className="flex mt-5 items-center justify-center">
                      <TailSpin color="#00BCD4" height={20} width={20} />
                    </div>
                  ) : (
                    <SimpleTable columns={columns} data={lineItems} />
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  ) : (
    <div className="flex mt-5 items-center justify-center">
      <TailSpin color="#00BCD4" height={20} width={20} />
    </div>
  );
};

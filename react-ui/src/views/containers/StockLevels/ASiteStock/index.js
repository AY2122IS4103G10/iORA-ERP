import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import { getASite, selectSite } from "../../../../stores/slices/siteSlice";
import { SimpleTable } from "../../../components/Tables/SimpleTable";
import { fetchAllModelsBySkus } from "../../StockTransfer/StockTransferForm";
import { useState } from "react";

const columns = [
  {
    Header: "SKU Code",
    accessor: "sku",
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
      row.product.productFields.find((field) => field.fieldName === "COLOUR")
        .fieldValue,
  },
  {
    Header: "Size",
    accessor: (row) =>
      row.product.productFields.find((field) => field.fieldName === "SIZE")
        .fieldValue,
  },
  {
    Header: "Qty",
    accessor: "qty",
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

export const AsiteStock = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const site = useSelector(selectSite);
  const status = useSelector((state) => state.sites.status);
  const [lineItems, setLineItems] = useState([]);

  useEffect(() => {
    dispatch(getASite(id));
  }, [dispatch, id]);

  useEffect(() => {
    const { stockLevel } = site && site;
    if (stockLevel !== undefined) {
      const products = stockLevel.products;
      fetchAllModelsBySkus(products).then((data) => {
        setLineItems(
          products.map((stock, index) => ({
            ...stock,
            modelCode: data[index].modelCode,
            name: data[index].name,
            imageLinks: data[index].imageLinks,
          }))
        );
      });
    }
  }, [site]);
  return status === "succeeded" ? (
    <>
      <div className="min-h-full">
        <main className="py-10">
          {/* Page header */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
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
                  {lineItems === null || lineItems === undefined ? (
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

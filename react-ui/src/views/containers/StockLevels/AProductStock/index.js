import { useState } from "react";
import { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getAProduct } from "../../../../stores/slices/productSlice";
import {
  getProductStockLevel,
} from "../../../../stores/slices/stocklevelSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { SelectColumnFilter, SimpleTable } from "../../../components/Tables/SimpleTable";
import { fetchModelBySku } from "../../StockTransfer/StockTransferForm";

export const AProductStock = ({ subsys }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lineItems, setLineItems] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await dispatch(getAProduct(id)).unwrap();
      const model = await fetchModelBySku(data.sku);
      return { ...data, name: model.name, modelCode: model.modelCode };
    };
    const onPageLoad = async () => {
      setLoading(true);
      const product = await fetchProduct();
      const data = await dispatch(getProductStockLevel(id)).unwrap();
      setLineItems(
        data.map((stock) => ({
          ...stock,
          status: product?.baselineQty > stock.qty ? "Low" : "Normal",
        }))
      );
      setProduct(product);
      setLoading(false);
    };
    onPageLoad();
  }, [dispatch, id]);

  const columns = [
    {
      Header: "#",
      accessor: "site.id",
      Cell: (e) =>
        e.row.original.status === "Low" ? (
          <span className="text-red-500">{e.value}</span>
        ) : (
          e.value
        ),
    },
    {
      Header: "Code",
      accessor: "site.siteCode",
      Cell: (e) =>
        e.row.original.status === "Low" ? (
          <span className="text-red-500">{e.value}</span>
        ) : (
          e.value
        ),
    },
    {
      Header: "Name",
      accessor: "site.name",
      Cell: (e) => {
        return (
          <Link
            to={`/${subsys}/stocklevels/${e.row.original.site.id}`}
            className="hover:underline"
          >
            {e.row.original.status === "Low" ? (
              <span className="text-red-500">{e.value}</span>
            ) : (
              e.value
            )}
          </Link>
        );
      },
    },
    {
      Header: "Phone",
      accessor: "site.phoneNumber",
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
        e.value === "Low" ? (
          <span className="text-red-500">Low</span>
        ) : (
          "Normal"
        ),
    },
  ];

  return loading ? (
    <div className="flex mt-5 items-center justify-center">
      <TailSpin color="#00BFFF" height={20} width={20} />
    </div>
  ) : (
    product && (
      <div className="min-h-full">
        <main className="py-10">
          {/* Page header */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <NavigatePrev
              page="Stock Levels"
              path={`/${subsys}/stocklevels/products`}
            />
            <div className="flex justify-start items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="relative">
                  <span
                    className="absolute inset-0 shadow-inner rounded-full"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h1>
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
            <div className="space-y-6 lg:col-start-1 lg:col-span-2">
              {/* Product information*/}
              <section aria-labelledby="applicant-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2
                      id="applicant-information-title"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Product Information
                    </h2>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Product Code
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {product.modelCode}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          SKU
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {product.sku}
                        </dd>
                      </div>
                      {product.productFields.map((field) => {
                        return (
                          <div key={field.id} className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              {field.fieldName}
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {field.fieldValue}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                </div>
              </section>

              {/* Stock Levels By Products*/}
              <section aria-labelledby="stocks-level">
                <div className="m-1">
                  {loading ? (
                    <div className="flex mt-5 items-center justify-center">
                      <TailSpin color="#00BFFF" height={20} width={20} />
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
    )
  );
};

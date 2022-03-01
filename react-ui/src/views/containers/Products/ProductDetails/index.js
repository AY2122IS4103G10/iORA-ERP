import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  PencilIcon,
} from "@heroicons/react/solid";
import { CurrencyDollarIcon } from "@heroicons/react/outline";
import {
  fetchProducts,
  selectProductByCode,
} from "../../../../stores/slices/productSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { useEffect, useMemo } from "react";
import {
  SelectColumnFilter,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";

const fieldSection = ({ fieldName, fields }) => {
  return Boolean(fields.length) ? (
    <div>
      <h2 className="text-sm font-medium text-gray-500">{fieldName}</h2>
      <ul className="mt-2 leading-8">
        {fields.map((field, index) => (
          <li key={index} className="inline">
            <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
              <div className="absolute flex-shrink-0 flex items-center justify-center">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-red-500"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3.5 text-sm font-medium text-gray-900">
                {field.fieldValue}
              </div>
            </div>{" "}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div>No {fieldName}</div>
  );
};

export const SKUTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "SKU",
        accessor: "sku",
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
          row.productFields.find((field) => field.fieldName === "SIZE")
            .fieldValue,
      },
    ],
    []
  );
  return <SimpleTable columns={columns} data={data} />;
};
const ProductDetailsBody = ({
  prodCode,
  name,
  description,
  price,
  colors,
  sizes,
  tags,
  categories,
  available,
  products,
}) => (
  <div className="py-8 xl:py-10">
    <div className="max-w-3xl mx-auto xl:max-w-5xl">
      <NavigatePrev page="Products" path="/sm/products" />
      <div className="px-4 sm:px-6 lg:px-8 xl:grid xl:grid-cols-3">
        <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
          <div>
            <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>

                <p className="mt-2 text-sm text-gray-500">{prodCode}</p>
              </div>
              <div className="mt-4 flex space-x-3 md:mt-0">
                <Link to={`/sm/products/edit/${prodCode}`}>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-700"
                  >
                    <PencilIcon
                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span>Edit</span>
                  </button>
                </Link>
              </div>
            </div>
            <aside className="mt-8 xl:hidden">
              <h2 className="sr-only">Details</h2>
              <div className="space-y-5">
                {available ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Unavailable
                  </span>
                )}
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="text-gray-900 text-sm font-medium">
                    {`List Price: $${price}`}
                  </span>
                </div>
              </div>
              <div className="mt-6 border-t border-b border-gray-200 py-6 space-y-8">
                {fieldSection({
                  fieldName: "Colors",
                  fields: colors,
                })}
                {fieldSection({
                  fieldName: "Sizes",
                  fields: sizes,
                })}
                {fieldSection({ fieldName: "Categories", fields: categories })}
                {fieldSection({
                  fieldName: "Tags",
                  fields: tags,
                })}
              </div>
            </aside>
            <div className="py-3 xl:pt-6 xl:pb-0">
              <h2 className="sr-only">Description</h2>
              <div className="prose max-w-none">
                <p>{description}</p>
              </div>
            </div>
          </div>
          <section aria-labelledby="activity-title" className="mt-8 xl:mt-10">
            <div>
              <div className="divide-y divide-gray-200">
                <div className="pb-4">
                  <h2
                    id="activity-title"
                    className="text-lg font-medium text-gray-900"
                  >
                    SKUs
                  </h2>
                </div>
                <div className="pt-6">
                  <SKUTable data={products} />
                </div>
              </div>
            </div>
          </section>
        </div>
        <aside className="hidden xl:block xl:pl-8">
          <h2 className="sr-only">Details</h2>
          <div className="space-y-5">
            {available ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Available
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Unavailable
              </span>
            )}
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span className="text-gray-900 text-sm font-medium">
                {`List Price: $${price}`}
              </span>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-200 py-6 space-y-8">
            {fieldSection({
              fieldName: "Colors",
              fields: colors,
            })}
            {fieldSection({
              fieldName: "Sizes",
              fields: sizes,
            })}
            {fieldSection({ fieldName: "Categories", fields: categories })}
            {fieldSection({
              fieldName: "Tags",
              fields: tags,
            })}
          </div>
        </aside>
      </div>
    </div>
  </div>
);

export const ProductDetails = () => {
  const { prodCode } = useParams();
  const product = useSelector((state) => selectProductByCode(state, prodCode));
  const dispatch = useDispatch();
  const prodStatus = useSelector((state) => state.products.status);

  useEffect(() => {
    prodStatus === "idle" && dispatch(fetchProducts());
  }, [prodStatus, dispatch]);

  return (
    Boolean(product) && (
      <>
        <ProductDetailsBody
          prodCode={prodCode}
          name={product.name}
          description={product.description}
          price={product.price}
          colors={product.productFields.filter(
            (field) => field.fieldName === "COLOUR"
          )}
          sizes={product.productFields.filter(
            (field) => field.fieldName === "SIZE"
          )}
          tags={product.productFields.filter(
            (field) => field.fieldName === "TAG"
          )}
          categories={product.productFields.filter(
            (field) => field.fieldName === "CATEGORY"
          )}
          available={product.available}
          products={product.products}
        />
      </>
    )
  );
};

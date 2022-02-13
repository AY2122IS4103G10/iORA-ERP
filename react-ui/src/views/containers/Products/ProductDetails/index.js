import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  PencilIcon,
} from "@heroicons/react/solid";

import { CurrencyDollarIcon } from "@heroicons/react/outline";

const fieldSection = ({ fieldName, fields }) => {
  return (
    <div>
      <h2 className="text-sm font-medium text-gray-500">{fieldName}</h2>
      <ul className="mt-2 leading-8">
        {fields.map((field) => (
          <li className="inline">
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
  );
};
const ProductDetailsBody = ({
  prodCode,
  name,
  description,
  listPrice,
  discPrice,
  colors,
  sizes,
  tags,
  categories,
}) => (
  <div className="py-8 xl:py-10">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3">
      <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
        <div>
          <div>
            <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <p className="mt-2 text-sm text-gray-500">{prodCode}</p>
              </div>
              <div className="mt-4 flex space-x-3 md:mt-0">
                <Link to={`/products/edit/${prodCode}`}>
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
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="text-gray-900 text-sm font-medium">
                    {`List Price: $${listPrice}`}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIconSolid
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="text-gray-900 text-sm font-medium">
                    {`Discount Price: $${discPrice}`}
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
                {fieldSection({
                  fieldName: "Categories",
                  fields: categories,
                })}
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
        </div>
      </div>
      <aside className="hidden xl:block xl:pl-8">
        <h2 className="sr-only">Details</h2>
        <div className="mt-6 border-t border-gray-200 py-6 space-y-8">
          {fieldSection({
            fieldName: "Colors",
            fields: colors,
          })}
          {fieldSection({
            fieldName: "Sizes",
            fields: sizes,
          })}
          {fieldSection({
            fieldName: "Categories",
            fields: categories,
            className: "border-b",
          })}
          {fieldSection({
            fieldName: "Tags",
            fields: tags,
          })}
        </div>
      </aside>
    </div>
  </div>
);

export const ProductDetails = () => {
  const { prodCode } = useParams();
  const product = useSelector((state) =>
    state.products.find((product) => product.prodCode === prodCode)
  );

  const fields = product.fields;
  const colors = fields.filter((field) => field.fieldName === "Color");
  const sizes = fields.filter((field) => field.fieldName === "Size");
  const tags = fields.filter((field) => field.fieldName === "Tag");
  const categories = fields.filter((field) => field.fieldName === "Category");

  return (
    <ProductDetailsBody
      prodCode={prodCode}
      name={product.name}
      description={product.description}
      listPrice={product.listPrice}
      discPrice={product.discPrice}
      colors={colors}
      sizes={sizes}
      tags={tags}
      categories={categories}
    />
  );
};

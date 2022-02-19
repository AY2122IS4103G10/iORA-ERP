import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  PencilIcon,
} from "@heroicons/react/solid";
import { CurrencyDollarIcon, TrashIcon } from "@heroicons/react/outline";
import {
  deleteExistingProduct,
  fetchProducts,
  selectProductByCode,
} from "../../../../stores/slices/productSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { useEffect, useState } from "react";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete.js";

const fieldSection = ({ fieldName, fields }) => {
  return (
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
  );
};
const ProductDetailsBody = ({
  prodCode,
  name,
  description,
  price,
  colors,
  sizes,
  tags,
  category,
  openModal,
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
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={openModal}
                >
                  <TrashIcon
                    className="-ml-1 mr-2 h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                  <span>Delete</span>
                </button>
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
                    {`List Price: $${price}`}
                  </span>
                </div>
                {Boolean(category) && (
                  <div className="flex items-center space-x-2">
                    <CurrencyDollarIconSolid
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="text-gray-900 text-sm font-medium">
                      {`Discount Price: $${category.discountedPrice}`}
                    </span>
                  </div>
                )}
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
                <div>
                  <h2 className="text-sm font-medium text-gray-500">
                    Category
                  </h2>
                  <div className="mt-2 leading-8">
                    <div className="inline">
                      {Boolean(category) ? (
                        <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                          <div className="absolute flex-shrink-0 flex items-center justify-center">
                            <span
                              className="h-1.5 w-1.5 rounded-full bg-red-500"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-3.5 text-sm font-medium text-gray-900">
                            {category.fieldValue}
                          </div>
                        </div>
                      ) : (
                        <p>No category</p>
                      )}
                    </div>
                  </div>
                </div>
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
        <aside className="hidden xl:block xl:pl-8">
          <h2 className="sr-only">Details</h2>
          <div className="space-y-5">
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span className="text-gray-900 text-sm font-medium">
                {`List Price: $${price}`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CurrencyDollarIconSolid
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span className="text-gray-900 text-sm font-medium">
                {`Discount Price: $${price}`}
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
            <div>
              <h2 className="text-sm font-medium text-gray-500">Category</h2>
              <div className="mt-2 leading-8">
                <div className="inline">
                  {Boolean(category) ? (
                    <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                      <div className="absolute flex-shrink-0 flex items-center justify-center">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-red-500"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3.5 text-sm font-medium text-gray-900">
                        {category.fieldValue}
                      </div>
                    </div>
                  ) : (
                    <p>No category</p>
                  )}
                </div>
              </div>
            </div>
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
  const [openDelete, setOpenDelete] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const prodStatus = useSelector((state) => state.products.status);

  useEffect(() => {
    prodStatus === "idle" && dispatch(fetchProducts());
  }, [prodStatus, dispatch]);

  const onDeleteProdClicked = () => {
    dispatch(deleteExistingProduct(product.modelCode));
    closeModal();
    navigate("/sm/products");
  };

  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);

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
          category={product.productFields.find(
            (field) => field.fieldName === "category"
          )}
          openModal={openModal}
        />
        <ConfirmDelete
          item={product.name}
          open={openDelete}
          closeModal={closeModal}
          onConfirm={onDeleteProdClicked}
        />
      </>
    )
  );
};

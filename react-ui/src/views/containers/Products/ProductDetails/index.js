import { Dialog, Transition } from "@headlessui/react";
import { CurrencyDollarIcon } from "@heroicons/react/outline";
import {
  CurrencyDollarIcon as CurrencyDollarSolid,
  PencilIcon,
} from "@heroicons/react/solid";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import {
  fetchProducts,
  selectProductByCode,
  updateBaselineQty,
  updateExistingProduct,
} from "../../../../stores/slices/productSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { SimpleButton } from "../../../components/Buttons/SimpleButton";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import {
  SelectColumnFilter,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import { ToggleLeftLabel } from "../../../components/Toggles/LeftLabel";

const FieldSection = ({ fieldName, fields }) => {
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
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Size",
        accessor: (row) =>
          row.productFields.find((field) => field.fieldName === "SIZE")
            .fieldValue,
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Baseline Qty",
        accessor: "accessor",
        Cell: (e) => {
          const [open, setOpen] = useState(false);
          const cancelButtonRef = useRef(null);
          const [qty, setQty] = useState(e.row.original.baselineQty);
          const onQtyChange = (e) => setQty(e.target.value);
          const { addToast } = useToasts();
          const dispatch = useDispatch();
          const onEditClicked = (evt) => {
            evt.preventDefault();
            const sku = e.row.original.sku;
            dispatch(updateBaselineQty({ sku, qty }))
              .unwrap()
              .then(() => {
                addToast("Baseline Quantity Updated", {
                  appearance: "success",
                  autoDismiss: true,
                });
              })
              .catch((err) =>
                addToast(`Error: ${err.message}`, {
                  appearance: "error",
                  autoDismiss: true,
                })
              )
              .finally(() => setOpen(false));
          };

          return (
            <div>
              {qty}
              <SimpleButton onClick={() => setOpen(true)} className="ml-5">
                Edit
              </SimpleButton>
              <EditModal
                open={open}
                setOpen={setOpen}
                cancelButtonRef={cancelButtonRef}
                qty={qty}
                onQtyChange={onQtyChange}
                sku={e.row.original.sku}
                onEditClicked={onEditClicked}
              />
            </div>
          );
        },
      },
    ],
    []
  );
  return <SimpleTable columns={columns} data={data} />;
};

const EditModal = ({
  open,
  setOpen,
  cancelButtonRef,
  qty,
  onQtyChange,
  sku,
  onEditClicked,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={() => setOpen(false)}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <form>
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Edit baseline quantity for {sku}
                    </Dialog.Title>
                    <div className="mt-2">
                      <SimpleInputBox
                        type="number"
                        name="baselineQty"
                        id="baselineQty"
                        value={qty}
                        onChange={onQtyChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:col-start-2 sm:text-sm"
                    onClick={onEditClicked}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const ProductDetailsBody = ({
  prodCode,
  name,
  description,
  listPrice,
  discountPrice,
  colors,
  sizes,
  tags,
  categories,
  available,
  products,
  onToggleEnableClicked,
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
                <ToggleLeftLabel
                  enabled={available}
                  onEnabledChanged={onToggleEnableClicked}
                  label={!available ? "Enable" : "Disable"}
                  toggleColor="red"
                />
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
                    {`List Price: $${listPrice}`}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="text-gray-900 text-sm font-medium">
                    {`Discount Price: $${discountPrice}`}
                  </span>
                </div>
              </div>
              <div className="mt-6 border-t border-b border-gray-200 py-6 space-y-8">
                {Boolean(colors.length) && (
                  <FieldSection fieldName="Colors" fields={colors} />
                )}
                {Boolean(sizes.length) && (
                  <FieldSection fieldName="Sizes" fields={sizes} />
                )}
                {Boolean(categories.length) && (
                  <FieldSection fieldName="Categories" fields={categories} />
                )}
                {Boolean(tags.length) && (
                  <FieldSection fieldName="Tags" fields={tags} />
                )}
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
                {`List Price: $${listPrice}`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CurrencyDollarSolid
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span className="text-gray-900 text-sm font-medium">
                {`Discount Price: $${discountPrice}`}
              </span>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-200 py-6 space-y-8">
            {Boolean(colors.length) && (
              <FieldSection fieldName="Colors" fields={colors} />
            )}
            {Boolean(sizes.length) && (
              <FieldSection fieldName="Sizes" fields={sizes} />
            )}
            {Boolean(categories.length) && (
              <FieldSection fieldName="Categories" fields={categories} />
            )}
            {Boolean(tags.length) && (
              <FieldSection fieldName="Tags" fields={tags} />
            )}
          </div>
        </aside>
      </div>
    </div>
  </div>
);

export const ProductDetails = () => {
  const { prodCode } = useParams();
  const { addToast } = useToasts();
  const product = useSelector((state) => selectProductByCode(state, prodCode));
  const dispatch = useDispatch();
  const prodStatus = useSelector((state) => state.products.status);

  useEffect(() => {
    prodStatus === "idle" && dispatch(fetchProducts());
  }, [prodStatus, dispatch]);

  const onToggleEnableClicked = () => {
    dispatch(
      updateExistingProduct({
        ...product,
        available: !product.available,
      })
    )
      .unwrap()
      .then(() => {
        addToast(
          `Successfully ${!product.available ? "enabled" : "disabled"} product`,
          {
            appearance: "success",
            autoDismiss: true,
          }
        );
      })
      .catch((err) =>
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        })
      );
  };

  return (
    Boolean(product) && (
      <>
        <ProductDetailsBody
          prodCode={prodCode}
          name={product.name}
          description={product.description}
          listPrice={product.listPrice}
          discountPrice={product.discountPrice}
          colors={product.productFields
            .filter((field) => field.fieldName === "COLOUR")
            .sort((f1, f2) =>
              f1.fieldValue < f2.fieldValue
                ? -1
                : f1.fieldValue > f2.fieldValue
                ? 1
                : 0
            )}
          sizes={product.productFields.filter(
            (field) => field.fieldName === "SIZE"
          )}
          tags={product.productFields
            .filter((field) => field.fieldName === "TAG")
            .sort((f1, f2) =>
              f1.fieldValue < f2.fieldValue
                ? -1
                : f1.fieldValue > f2.fieldValue
                ? 1
                : 0
            )}
          categories={product.productFields
            .filter((field) => field.fieldName === "CATEGORY")
            .sort((f1, f2) =>
              f1.fieldValue < f2.fieldValue
                ? -1
                : f1.fieldValue > f2.fieldValue
                ? 1
                : 0
            )}
          available={product.available}
          products={product.products}
          onToggleEnableClicked={onToggleEnableClicked}
        />
      </>
    )
  );
};

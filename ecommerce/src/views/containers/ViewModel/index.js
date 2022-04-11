import { RadioGroup } from "@headlessui/react";
import { CurrencyDollarIcon, GlobeIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addToCart } from "../../../stores/slices/cartSlice";
import {
  fetchModel,
  fetchProductStock,
  selectModel,
  selectProductStock
} from "../../../stores/slices/listingSlice";

const policies = [
  {
    name: "Doorstep delivery",
    icon: GlobeIcon,
    description: "Enjoy Free Shipping with $25 purchase within Singapore.",
  },
  {
    name: "30 Days Exchange",
    icon: CurrencyDollarIcon,
    description:
      "Exchange at any of our retail stores in Singapore within 30 days from date of order placement. Exchange not applicable for items purchased during a sale or a campaign. Items purchased on regular price, 2 for $29 and 2 for $49 will be eligible for exchange.",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const ColourPicker = ({ model, selectedColor, setSelectedColor }) => {
  const colours = model.productFields.filter(
    (field) => field.fieldName === "COLOUR"
  );

  return (
    <div>
      <h2 className="text-sm font-medium text-gray-900">Color</h2>
      <RadioGroup
        value={selectedColor}
        onChange={setSelectedColor}
        className="mt-2"
      >
        <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
        <div className="grid grid-cols-3 items-center gap-2">
          {colours.map((colour) => {
            return (
              <RadioGroup.Option
                key={colour.fieldValue}
                value={colour.id}
                className={({ active, checked }) =>
                  classNames(
                    // color.selectedColor,
                    checked ? "ring-2 ring-gray-700 bg-gray-100" : "",
                    "-m-0.5 relative p-2 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                  )
                }
              >
                {/* className="sr-only" */}
                <RadioGroup.Label as="p" className="text-sm px-3 py-1">
                  {colour.fieldValue}
                </RadioGroup.Label>
              </RadioGroup.Option>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
};

export const SizePicker = ({ model, selectedSize, setSelectedSize }) => {
  const sizes = model.productFields.filter(
    (field) => field.fieldName === "SIZE"
  );

  return (
    <div className="mt-8">
      {/* <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-900">Size</h2>
                <a href="#" className="text-sm font-medium text-black hover:text-gray-500">
                    See sizing chart
                </a>
            </div> */}

      <RadioGroup
        value={selectedSize}
        onChange={setSelectedSize}
        className="mt-2"
      >
        <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {sizes.map((size) => (
            <RadioGroup.Option
              key={size.fieldValue}
              value={size.id}
              className={({ active, checked }) =>
                classNames(
                  // size.inStock ? 'cursor-pointer focus:outline-none' : 'opacity-25 cursor-not-allowed',
                  active ? "ring-2 ring-offset-2 ring-gray-500" : "",
                  checked
                    ? "bg-gray-600 border-transparent text-white hover:bg-gray-700"
                    : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
                  "border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1"
                )
              }
              // disabled={!size.inStock}
            >
              <RadioGroup.Label as="p">{size.fieldValue}</RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export const StockAvailability = ({ productStock }) => {
  return (
    <div className="text-center mt-6">
      {productStock !== null && productStock.qty !== 0 ? (
        <p>In Stock: {productStock.qty}</p>
      ) : (
        <p>Out of Stock</p>
      )}
    </div>
  );
};

const findProduct = (model, selectedColor, selectedSize) => {
  return model.products.find((prod) => {
    if (
      prod.productFields.some(
        (field) => field.fieldName === "COLOUR" && field.id === selectedColor
      ) &&
      prod.productFields.some(
        (field) => field.fieldName === "SIZE" && field.id === selectedSize
      )
    ) {
      return true;
    } else {
      return false;
    }
  });
};

export default function ViewModel() {
  const dispatch = useDispatch();
  const { modelCode } = useParams();
  const model = useSelector(selectModel);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [clicked, setClicked] = useState(false);

  const productStock = useSelector(selectProductStock);

  useEffect(() => {
    modelCode && dispatch(fetchModel(modelCode));
    window.scrollTo(0, 0);
  }, [dispatch, modelCode]);

  //fetch the stock availability
  useEffect(() => {
    if (model !== null && model !== undefined) {
      const product = findProduct(model, selectedColor, selectedSize);
      if (product !== undefined) {
        dispatch(fetchProductStock(product?.sku));
      }
    }
  }, [dispatch, model, selectedColor, selectedSize]);

  const onAddCartClicked = (e) => {
    e.preventDefault();
    setClicked(true);
    setTimeout(() => setClicked(false), 500);
    if (selectedColor !== 0 && selectedSize !== 0) {
      const product = findProduct(model, selectedColor, selectedSize);
      dispatch(
        addToCart({ model: model, product: product, stock: productStock.qty })
      );
    }
  };

  return (
    Boolean(model) && (
      <div className="bg-white">
        <div className="pt-6 pb-16 sm:pb-24">
          <nav
            aria-label="Breadcrumb"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            {/* <ol role="list" className="flex items-center space-x-4">
                        {product.breadcrumbs.map((breadcrumb) => (
                            <li key={breadcrumb.id}>
                                <div className="flex items-center">
                                    <a href={breadcrumb.href} className="mr-4 text-sm font-medium text-gray-900">
                                        {breadcrumb.name}
                                    </a>
                                    <svg
                                        viewBox="0 0 6 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                        className="h-5 w-auto text-gray-300"
                                    >
                                        <path d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z" fill="currentColor" />
                                    </svg>
                                </div>
                            </li>
                        ))}
                        <li className="text-sm">
                            <a href={product.href} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                                {model.name}
                            </a>
                        </li>
                    </ol> */}
          </nav>
          <div className="mt-8 max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:auto-rows-min lg:gap-x-8">
              <div className="lg:col-start-8 lg:col-span-5">
                <div className="flex justify-between">
                  <h1 className="text-xl font-medium text-gray-900">
                    {model.name}
                  </h1>
                  <div>
                    {model.listPrice !== model.discountPrice ? (
                      <>
                        <span className="line-through text-md mr-2 text-gray-500">
                          ${model.listPrice}
                        </span>
                        <span className="text-xl font-medium text-gray-900">
                          ${model.discountPrice}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-medium text-gray-900">
                        ${model.listPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Image gallery */}
              <div className="mt-8 lg:mt-0 lg:col-start-1 lg:col-span-7 lg:row-start-1 lg:row-span-3">
                <h2 className="sr-only">Images</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
                  {model.imageLinks.map((image) => (
                    <img
                      alt={model.name}
                      key={image}
                      src={image}
                      className={classNames(
                        image.primary
                          ? "lg:col-span-2 lg:row-span-2"
                          : "hidden lg:block",
                        "rounded-lg"
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8 lg:col-span-5">
                <form>
                  <ColourPicker
                    model={model}
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                  />

                  <SizePicker
                    model={model}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                  />
                  {model !== null &&
                  selectedColor !== 0 &&
                  selectedSize !== 0 ? (
                    <StockAvailability productStock={productStock} />
                  ) : null}
                  <button
                    type="submit"
                    className="mt-8 w-full bg-gray-800 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={onAddCartClicked}
                    disabled={
                      productStock === null || productStock?.qty === 0
                        ? true
                        : false
                    }
                  >
                    Add to cart
                  </button>
                  <span
                    className={`${
                      clicked ? "" : "hidden "
                    }animate-ping absolute -top-4 -right-4 inline-flex h-24 w-24 rounded-full bg-green-600 opacity-75`}
                  ></span>
                </form>

                {/* Product details */}
                <div className="mt-10">
                  <h2 className="text-md font-semibold text-gray-900">
                    Description
                  </h2>

                  <div className="mt-4 text-sm text-gray-900">
                    <ul>
                      {model.description.split(".").map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-8">
                  <span className="text-sm font-medium text-gray-900">
                    SKU:{" "}
                  </span>
                  <span className="text-sm text-gray-900">
                    {" " + model.modelCode}
                  </span>
                  <div className="mt-4 text-sm text-gray-900">
                    <span className="font-medium">CATEGORIES: </span>
                    {model.productFields
                      .filter((field) => field.fieldName === "CATEGORY")
                      .map((item, id) => (
                        <span key={id}>
                          {id !== 0 ? ", " : ""}
                          {item.fieldValue}
                        </span>
                      ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-900">
                    <span className="font-medium">TAGS: </span>
                    {model.productFields
                      .filter((field) => field.fieldName === "TAG")
                      .map((item, id) => (
                        <span key={id}>
                          {id !== 0 ? ", " : ""}
                          {item.fieldValue}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Policies */}
                <section aria-labelledby="policies-heading" className="mt-10">
                  <h2 id="policies-heading" className="sr-only">
                    Our Policies
                  </h2>

                  <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {policies.map((policy) => (
                      <div
                        key={policy.name}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center"
                      >
                        <dt>
                          <policy.icon
                            className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="mt-4 text-sm font-medium text-gray-900">
                            {policy.name}
                          </span>
                        </dt>
                        <dd className="mt-1 text-sm text-gray-500">
                          {policy.description}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

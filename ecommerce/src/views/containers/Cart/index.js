import {
  CheckIcon,
  ClockIcon,
  PlusSmIcon,
  MinusSmIcon,
  QuestionMarkCircleIcon,
  XIcon as XIconSolid,
} from "@heroicons/react/solid";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addCartItemQty, minusCartItemQty, selectCart } from "../../../stores/slices/cartSlice";

const products = [
  {
    id: 1,
    name: "Basic Tee",
    href: "#",
    price: "$32.00",
    color: "Sienna",
    inStock: true,
    size: "Large",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in sienna.",
  },
  {
    id: 2,
    name: "Basic Tee",
    href: "#",
    price: "$32.00",
    color: "Black",
    inStock: false,
    leadTime: "3–4 weeks",
    size: "Large",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-02.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 3,
    name: "Nomad Tumbler",
    href: "#",
    price: "$35.00",
    color: "White",
    inStock: true,
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-03.jpg",
    imageAlt: "Insulated bottle with white base and black snap lid.",
  },
];


export const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);

  const onAddQtyClicked = (e, product) => {
    e.preventDefault();
    dispatch(addCartItemQty(product))
  }

  const onMinusQtyClicked = (e, product) => {
    e.preventDefault();
    dispatch(minusCartItemQty(product))
  }

  return (
    <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        My Cart
      </h1>

      <form className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <h2 id="cart-heading" className="sr-only">
            Items in your shopping cart
          </h2>

          <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
            {cart.map((item, id) => (
              <li key={id} className="flex py-6 sm:py-10">
                <div className="flex-shrink-0">
                  <img
                    // src={product.imageSrc}
                    // alt={product.imageAlt}
                    className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"
                  />
                </div>

                <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm">
                          <Link
                            to={`/products/view/${item.product.sku}`}
                            className="font-medium text-gray-700 hover:text-gray-800"
                          >
                            {item.model.name}
                          </Link>
                        </h3>
                      </div>
                      <div className="mt-1 flex text-sm">
                        <p className="text-gray-500">{item.product?.productFields.find((field) => field.fieldName === "COLOUR").fieldValue}</p>
                        <p className="ml-4 pl-4 border-l border-gray-200 text-gray-500">
                          {item.product?.productFields.find((field) => field.fieldName === "SIZE").fieldValue}
                        </p>
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {item.product.listPrice}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <label
                        htmlFor={`quantity-${id}`}
                        className="sr-only"
                      >
                        Quantity, {item.product.name}
                      </label>
                      
                      <span className="relative z-0 inline-flex shadow-sm rounded-md">
                        <button
                          type="button"
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                          onClick={(e) => onMinusQtyClicked(e, item.product)}
                        >
                          <span className="sr-only">Previous</span>
                          <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <input
                          name="qty"
                          id="qty"
                          className="text-center block w-full sm:text-sm border border-gray-300"
                          placeholder="0"
                          value={item.qty}
                          disabled 
                        />
                        <button
                          type="button"
                          className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                          onClick={(e) => onAddQtyClicked(e, item.product)}
                        >
                          <span className="sr-only">Next</span>
                          <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </span>
                      <div className="absolute top-0 right-0">
                        <button
                          type="button"
                          className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">Remove</span>
                          <XIconSolid className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 flex text-sm text-gray-700 space-x-2">
                    {/* {product.inStock ? (
                      <CheckIcon
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <ClockIcon
                        className="flex-shrink-0 h-5 w-5 text-gray-300"
                        aria-hidden="true"
                      />
                    )} */}

                    {/* <span>
                      {product.inStock
                        ? "In stock"
                        : `Ships in ${product.leadTime}`}
                    </span> */}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Order summary */}
        <section
          aria-labelledby="summary-heading"
          className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
        >
          <h2
            id="summary-heading"
            className="text-lg font-medium text-gray-900"
          >
            Order summary
          </h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">$99.00</dd>
            </div>
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <dt className="flex items-center text-sm text-gray-600">
                <span>Shipping estimate</span>
                <a
                  href="#"
                  className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">
                    Learn more about how shipping is calculated
                  </span>
                  <QuestionMarkCircleIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </a>
              </dt>
              <dd className="text-sm font-medium text-gray-900">$5.00</dd>
            </div>
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <dt className="flex text-sm text-gray-600">
                <span>Tax estimate</span>
                <a
                  href="#"
                  className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">
                    Learn more about how tax is calculated
                  </span>
                  <QuestionMarkCircleIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </a>
              </dt>
              <dd className="text-sm font-medium text-gray-900">$8.32</dd>
            </div>
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <dt className="text-base font-medium text-gray-900">
                Order total
              </dt>
              <dd className="text-base font-medium text-gray-900">$112.32</dd>
            </div>
          </dl>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
            >
              Checkout
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
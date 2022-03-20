import {
  CheckIcon,
  ClockIcon,
  PlusSmIcon,
  MinusSmIcon,
  QuestionMarkCircleIcon,
  XIcon as XIconSolid,
} from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { checkoutApi } from "../../../environments/Api";
import { addCartItemQty, minusCartItemQty, removeItemFromCart, selectCart } from "../../../stores/slices/cartSlice";
import { classNames } from "../../../utilities/Util";

const deliveryOptions = [
  { id: 1, name: "Standard Shipping", description: "Shipping: $2.50" },
  { id: 2, name: "Collect In-Stores", description: "Pick up in a physical store of your choice" }
]


export const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [amount, setAmount] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [delivery, setDelivery] = useState(0);
  const cart = useSelector(selectCart);

  const onAddQtyClicked = (e, product) => {
    e.preventDefault();
    dispatch(addCartItemQty(product))
  }

  const onMinusQtyClicked = (e, product) => {
    e.preventDefault();
    dispatch(minusCartItemQty(product))
  }

  const onRemoveItemClicked = (e, product) => {
    e.preventDefault();
    dispatch(removeItemFromCart(product))
  }

  const onCheckoutClicked = (e) => {
      e.preventDefault();
      if (cart.length > 0) {
        navigate("checkout");
      }
  }


  useEffect(() => {
    async function calculate() {
      let lineItems = cart.map((item) => {
        const { model, ...lineItem } = item;
        return lineItem;
      });
      console.log(lineItems);
      const response = await checkoutApi.calculatePromotions(lineItems);
      setPromotions(response.data[1]);
      setAmount(
        response.data
          .map((y) => y.map((x) => x.subTotal).reduce((x, y) => x + y, 0))
          .reduce((x, y) => x + y, 0)
      );
      console.log(amount);
      console.log(promotions);
      console.log(response.data);
    }
    calculate();
  }, [cart]);

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
                        ${item.model.listPrice}
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
                          onClick={(e) => onRemoveItemClicked(e, item.product)}
                        >
                          <span className="sr-only">Remove</span>
                          <XIconSolid className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 flex flex-row-reverse font-bold text-sm text-gray-700 space-x-2">
                    Subtotal: ${parseInt(item.model.listPrice) * item.qty}
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
              </dt>
              <dd className="text-sm font-medium text-gray-900">$2.50</dd>
            </div>

            <fieldset>
              {deliveryOptions.map((option) => (
                <div key={option.id} className="relative flex items-start mb-1">
                  <div className="flex items-center h-5">
                    <input
                      id={option.id}
                      value={option.id}
                      name="shipping-type"
                      type="radio"
                      className="focus:ring-gray-600 h-4 w-4 text-gray-700 border-gray-300"
                      onChange={(e) => setDelivery(option.id)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={option.id} className="font-medium text-gray-700">
                      {option.name}
                    </label>
                    <p id={`${option.id}-description`} className="text-gray-500">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </fieldset>

            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <dt className="text-base font-medium text-gray-900">
                Order total
              </dt>
              <dd className="text-base font-medium text-gray-900">${delivery === 1 ? amount + 2.50 : amount}</dd>
            </div>
          </dl>

          <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-gray-800 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                onClick={onCheckoutClicked}
              >
                Checkout
              </button>
          </div>
        </section>
      </form>
    </div>
  );
}
import { Dialog } from "@headlessui/react";
import {
  CashIcon,
  CreditCardIcon,
  DeviceMobileIcon,
  XIcon,
} from "@heroicons/react/outline";
import { ExclamationIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { orderApi } from "../../../../environments/Api";
import { getCustomerByPhone } from "../../../../stores/slices/customerSlice";
import { SimpleModal } from "../../../components/Modals/SimpleModal";

const paymentTypes = [
  {
    name: "Cash",
    icon: CashIcon,
    id: 1,
  },
  {
    name: "Mastercard",
    icon: CreditCardIcon,
    id: 2,
  },
  {
    name: "Visa",
    icon: CreditCardIcon,
    id: 3,
  },
  {
    name: "NETS",
    icon: CreditCardIcon,
    id: 4,
  },
  {
    name: "PayLah",
    icon: DeviceMobileIcon,
    id: 5,
  },
  {
    name: "GrabPay",
    icon: DeviceMobileIcon,
    id: 6,
  },
  {
    name: "Fave",
    icon: DeviceMobileIcon,
    id: 7,
  },
];

export const CheckoutForm = ({ open, closeModal, amount, order }) => {
  const [mode, setMode] = useState(0);
  const [customerId, setCustomerId] = useState(null);
  const { addToast } = useToasts();

  const handleSubmit = async () => {
    try {
      const response = await orderApi.createOrder({
        ...order,
        customerId: customerId,
        paid: true,
        payments: [
          {
            amount: amount,
            paymentType: "CASH",
            ccTransactionId: null,
          },
        ],
      });
      addToast(`Success: Order with ID ${response.data.id} created`, {
        appearance: "success",
        autoDismiss: true,
      });
      console.log(response.data.customerId);
    } catch (err) {
      addToast(`Error: Order was not created`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <SimpleModal open={open} closeModal={closeModal}>
      <div className="inline-block align-middle bg-white rounded-lg px-4 pt-4 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
        <div className="flex justify-between">
          <Dialog.Title
            as="h3"
            className="m-3 text-center text-lg leading-6 font-medium text-gray-900"
          >
            Payment
          </Dialog.Title>
          <button
            type="button"
            className="relative h-full inline-flex items-center space-x-2 px-2 py-2 text-sm font-medium rounded-full text-gray-700"
            onClick={closeModal}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        {mode === 0 && <Choice setMode={setMode} closeModal={closeModal} />}
        {mode === 1 && (
          <Cash
            amount={amount}
            handleSubmit={handleSubmit}
            setCustomerId={setCustomerId}
            addToast={addToast}
          />
        )}
        {mode !== 0 && (
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setMode(0)}
          >
            Back
          </button>
        )}
      </div>
    </SimpleModal>
  );
};

const Choice = ({ setMode }) => {
  return (
    <div className="rounded-lg bg-white overflow-hidden divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-3 sm:gap-0">
      {paymentTypes.map((type, index) => (
        <div
          key={type.id}
          className="m-2 border shadow rounded-lg align-middle sm:rounded-md relative bg-white p-6 
                  focus-within:ring-2 focus-within:ring-inset focus-within:ring-cyan-500"
        >
          <div className="m-0 flex justify-center">
            <button onClick={() => setMode(type.id)}>
              {/* Extend touch target to entire panel */}
              <span className="absolute inset-0" aria-hidden="true" />

              <div className="flex text-lg justify-center align-middle ">
                <h3>{type.name}</h3>
                <type.icon
                  className="ml-2 inline-flex h-6 w-6 text-cyan-500 row-span-1"
                  aria-hidden="true"
                />
              </div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const Cash = ({ amount, handleSubmit, setCustomerId, addToast }) => {
  const [received, setReceived] = useState(amount);
  const [phone, setPhone] = useState("");
  const [showBtn, setShowBtn] = useState(false);
  const dispatch = useDispatch();

  const errorCheck = () => {
    if (received < amount) {
      addToast(`Error: Cash tendered is insufficient`, {
        appearance: "error",
        autoDismiss: true,
      });
      setReceived(amount);
    }
    setShowBtn(true);
  };

  const getCustomerId = async () => {
    if (phone === "") {
      addToast(`Warning: You did not key in a phone number`, {
        appearance: "warning",
        autoDismiss: true,
      });
      setShowBtn(true);
    } else {
      const data = await dispatch(getCustomerByPhone(phone)).unwrap();
      if (data.length === 0) {
        setCustomerId(null);
        addToast(`Error: No Customer found`, {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        setCustomerId(data[0]?.id);
        addToast(
          `Success: Customer ${data[0]?.firstName} ${data[0]?.lastName} was found`,
          {
            appearance: "success",
            autoDismiss: true,
          }
        );
        setShowBtn(true);
      }
    }
  };

  return (
    <div className="rounded-lg bg-white overflow-hidden divide-y divide-gray-200 sm:divide-y-0 flex justify-center">
      <div className="grow max-w-md sm:grid sm:grid-cols-2 gap-4">
        <dt className="text-lg font-medium text-indigo-800 mt-3">
          Customer Phone Number:
        </dt>
        <dd className="text-lg font-medium text-gray-800">
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              name="phone"
              id="phone"
              value={phone}
              placeholder="91234567"
              onChange={(e) => setPhone(e.target.value)}
              onBlur={getCustomerId}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-3 sm:text-lg border-gray-300 rounded-md"
              aria-describedby="price-currency"
            />
          </div>
        </dd>
        <dt className="text-lg font-medium text-indigo-800 mt-3">
          Payment Amount:
        </dt>
        <dd className="text-lg font-medium text-gray-800">
          <div className="mt-1 relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-lg">$</span>
            </div>
            <input
              type="text"
              name="payment"
              id="payment"
              value={Number.parseFloat(amount).toFixed(2)}
              disabled
              className="block w-full pl-7 pr-12 sm:text-lg rounded-md border-none"
              aria-describedby="price-currency"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-lg" id="price-currency">
                SGD
              </span>
            </div>
          </div>
        </dd>
        <dt className="text-lg font-medium text-indigo-800 mt-3">
          Cash tendered:
        </dt>
        <dd className="text-lg font-medium text-gray-800">
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-lg">$</span>
            </div>
            <input
              type="text"
              name="price"
              id="price"
              value={received}
              onChange={(e) => setReceived(e.target.value)}
              onBlur={errorCheck}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-lg border-gray-300 rounded-md"
              placeholder="0.00"
              aria-describedby="price-currency"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-lg" id="price-currency">
                SGD
              </span>
            </div>
          </div>
        </dd>
        <dt className="text-lg font-medium text-indigo-800 mt-3">Change:</dt>
        <dd className="text-lg font-medium text-gray-800">
          <div className="mt-1 relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-lg">$</span>
            </div>
            <input
              type="text"
              name="change"
              id="change"
              value={Number.parseFloat(received - amount).toFixed(2)}
              disabled
              className="block w-full pl-7 pr-12 sm:text-lg rounded-md border-none"
              aria-describedby="price-currency"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-lg" id="price-currency">
                SGD
              </span>
            </div>
          </div>
        </dd>
        {showBtn ? (
          <div className="col-span-2 mb-3">
            <button
              type="button"
              className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleSubmit}
            >
              I have returned the customer a change of $
              {Number.parseFloat(received - amount).toFixed(2)} SGD
            </button>
          </div>
        ) : (
          <div className="rounded-md bg-yellow-50 p-4 col-span-2 border-yellow-400 border-2 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationIcon
                  className="h-8 w-8 text-yellow-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-nd font-medium text-yellow-800">
                  Attention
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Please confirm the customer's phone number if they are a
                    member and the cash tendered before proceeding
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

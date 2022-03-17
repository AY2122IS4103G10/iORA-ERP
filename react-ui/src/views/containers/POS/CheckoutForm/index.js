import { Dialog } from "@headlessui/react";
import {
  CashIcon,
  CreditCardIcon,
  DeviceMobileIcon,
  XIcon,
} from "@heroicons/react/outline";
import {
  DeviceTabletIcon,
  ExclamationIcon,
  InformationCircleIcon,
} from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { orderApi, posApi } from "../../../../environments/Api";
import { getCustomerByPhone } from "../../../../stores/slices/customerSlice";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import { loadStripeTerminal } from "@stripe/terminal-js";

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

export const CheckoutForm = ({ open, closeModal, amount, order, clear }) => {
  const [mode, setMode] = useState(0);
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [showChoice, setShowChoice] = useState(false);
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  const closeModalComplex = () => {
    closeModal();
    setShowChoice(false);
    setPhone("");
    setCustomerName("");
    setCustomerId(null);
  };

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
      closeModalComplex();
      clear();
    } catch (err) {
      addToast(`Error: Order was not created`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const getCustomerId = async () => {
    if (phone === "") {
      addToast(`Info: You did not key in a phone number`, {
        appearance: "info",
        autoDismiss: true,
      });
      setShowChoice(true);
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
        setCustomerName(data[0]?.firstName + " " + data[0]?.lastName);
        addToast(
          `Success: Customer ${data[0]?.firstName} ${data[0]?.lastName} was found`,
          {
            appearance: "success",
            autoDismiss: true,
          }
        );
        setShowChoice(true);
      }
    }
  };

  return (
    <SimpleModal open={open} closeModal={closeModalComplex}>
      <div className="inline-block align-top my-32 bg-white rounded-lg px-4 pt-4 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:w-fit sm:max-w-4xl sm:p-6">
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
            onClick={closeModalComplex}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        {mode === 0 &&
          (showChoice ? (
            <Choice setMode={setMode} setShowChoice={setShowChoice} />
          ) : (
            <div className="grow max-w-md sm:grid sm:grid-cols-1 gap-4 pl-3">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <InformationCircleIcon
                      className="h-5 w-5 text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700">
                      Please enter the customer's phone number if they are a
                      iORA member.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="mt-1">
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
                <p
                  className="mt-2 text-sm text-gray-500"
                  id="email-description"
                >
                  {customerName === ""
                    ? "Customer is not a member"
                    : `Customer is ${customerName}`}
                </p>
              </div>
              <div className="mt-3 flex flex-row-reverse space-x-4 space-x-reverse justify-center">
                <button
                  type="button"
                  disabled={amount === 0}
                  onClick={getCustomerId}
                  className="w-4/12 mt-3 bg-cyan-700 border border-transparent rounded-md shadow-sm py-2 px-2 text-base font-medium text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyan-50 focus:ring-cyan-600"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="w-4/12 mt-3 bg-gray-600 border border-transparent rounded-md shadow-sm py-2 px-2 text-base font-medium text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
                  onClick={closeModalComplex}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        {mode === 1 && (
          <Cash
            amount={amount}
            handleSubmit={handleSubmit}
            addToast={addToast}
          />
        )}
        {mode >= 2 && mode <= 4 && (
          <Card onDisconnect={() => setMode(0)} addToast={addToast} />
        )}
        {mode !== 0 && (
          <div className="mt-3 flex flex-row-reverse space-x-4 space-x-reverse justify-center">
            <button
              type="button"
              className="w-4/12 mt-3 bg-gray-600 border border-transparent rounded-md shadow-sm py-2 px-2 text-base font-medium text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
              onClick={() => setMode(0)}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </SimpleModal>
  );
};

const Choice = ({ setMode, setShowChoice }) => {
  return (
    <>
      <div className="rounded-lg bg-white overflow-hidden divide-y divide-gray-200 sm:divide-y-0 grid grid-cols-3 sm:gap-0 sm:max-w-md">
        {paymentTypes.map((type, index) => (
          <div
            key={type.id}
            className="m-1 border shadow rounded-lg align-middle sm:rounded-md relative bg-white py-3 px-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-cyan-500"
          >
            <div className="m-0 flex justify-center">
              <button onClick={() => setMode(type.id)}>
                {/* Extend touch target to entire panel */}
                <span className="absolute inset-0" aria-hidden="true" />

                <div className="flex text-lg justify-center align-middle ">
                  <h3>{type.name}</h3>
                  <type.icon
                    className="ml-2 inline-flex h-5 w-5 text-cyan-500 row-span-1"
                    aria-hidden="true"
                  />
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-row-reverse space-x-4 space-x-reverse justify-center">
        <button
          type="button"
          className="w-4/12 mt-3 bg-gray-600 border border-transparent rounded-md shadow-sm py-2 px-2 text-base font-medium text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
          onClick={() => setShowChoice(false)}
        >
          Back
        </button>
      </div>
    </>
  );
};

const Cash = ({ amount, handleSubmit, addToast }) => {
  const [received, setReceived] = useState(amount);
  const [showBtn, setShowBtn] = useState(false);

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

  return (
    <div className="rounded-lg bg-white overflow-hidden divide-y divide-gray-200 sm:divide-y-0 flex justify-center">
      <div className="grow max-w-md sm:grid sm:grid-cols-1 pl-3">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mt-3"
        >
          Payment Amount
        </label>
        <div className="text-lg font-medium text-gray-800 mt-1 relative rounded-md">
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
        <label
          htmlFor="cash"
          className="block text-sm font-medium text-gray-700 mt-3"
        >
          Cash tendered
        </label>
        <div className="text-lg font-medium text-gray-800 mt-1 relative rounded-md">
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
        <label
          htmlFor="change"
          className="block text-sm font-medium text-gray-700 mt-3"
        >
          Change
        </label>
        <div className="text-lg font-medium text-gray-800 mt-1 relative rounded-md">
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
        {showBtn ? (
          <div className="my-3">
            <button
              type="button"
              className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={handleSubmit}
            >
              I have returned the customer a change of $
              {Number.parseFloat(received - amount).toFixed(2)} SGD
            </button>
          </div>
        ) : (
          <div className="rounded-md bg-yellow-50 p-4 border-yellow-400 border-2 rounded-md mb-3">
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
                  <p>Please confirm the cash tendered before proceeding</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Card = ({ onDisconnect, addToast }) => {
  const [terminal, setTerminal] = useState(null);

  useEffect(() => {
    loadStripeTerminal().then((StripeTerminal) => {
      const initTerminal = StripeTerminal.create({
        onFetchConnectionToken: async () => {
          const { data } = await posApi.connectToken();
          return data.secret;
        },
        onUnexpectedReaderDisconnect: () => {
          addToast(`Error: Reader unexpectedly disconnected`, {
            appearance: "error",
            autoDismiss: true,
          });
          onDisconnect();
        },
      });
      setTerminal(initTerminal);
    });
  }, [addToast, onDisconnect]);

  const setSimulated = async () => {
    const config = { simulated: true };
    const discoverResult = await terminal.discoverReaders(config);
    if (discoverResult.error) {
      addToast(`Failed to discover: ${discoverResult.error}`, {
        appearance: "error",
        autoDismiss: true,
      });
    } else if (discoverResult.discoveredReaders.length === 0) {
      addToast(`No available readers.`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    // Just select the first reader here.
    let selectedReader = discoverResult.discoveredReaders[0];
    const connectResult = await terminal.connectReader(selectedReader);
    if (connectResult.error) {
      addToast(`Failed to connect: ${connectResult.error}`, {
        appearance: "error",
        autoDismiss: true,
      });
    } else {
      addToast(`Connected to reader: ${connectResult.reader.label}`, {
        appearance: "success",
        autoDismiss: true,
      });
    }
  };

  return (
    <div className="rounded-lg bg-white overflow-hidden divide-y divide-gray-200 sm:divide-y-0 flex justify-center">
      <div className="grow max-w-md sm:grid sm:grid-cols-1 pl-3">
        <h3>Card payment thing here</h3>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={setSimulated}
        >
          <DeviceTabletIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Connect to Simulated Reader
        </button>
      </div>
    </div>
  );
};

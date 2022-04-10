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
  SearchIcon,
} from "@heroicons/react/solid";
import ProgressBar from "@ramonak/react-progress-bar";
import { loadStripeTerminal } from "@stripe/terminal-js";
import moment from "moment";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { orderApi, posApi } from "../../../../environments/Api";
import { getCustomerByPhone } from "../../../../stores/slices/customerSlice";
import {
  fetchMembershipTiers,
  selectAllMembershipTiers,
} from "../../../../stores/slices/membershipTierSlice";
import { getVoucherByCode } from "../../../../stores/slices/posSlice";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";

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

export const CheckoutForm = ({
  open,
  closeModal,
  amount,
  order,
  clear,
  checkoutItems,
}) => {
  const [mode, setMode] = useState(0);
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customer, setCustomer] = useState({});
  const [voucherCodes, setVoucherCodes] = useState([]);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState({
    id: 0,
    name: "Choose One",
  });
  const [progress, setProgress] = useState({
    current: 0.0,
    next: 200.0,
    tier: "N.A.",
  });
  const [phone, setPhone] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucher, setVoucher] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [showChoice, setShowChoice] = useState(false);
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const membershipTiers = useSelector((state) =>
    selectAllMembershipTiers(state)
  );

  useEffect(() => {
    dispatch(fetchMembershipTiers());
  }, [dispatch]);

  const closeModalComplex = () => {
    closeModal();
    setShowChoice(false);
    setMode(0);
    setPhone("");
    setCustomerId(null);
    setCustomerName("");
    setCustomer({});
    setVoucherCodes([]);
    setVoucherCode("");
    setVoucherDiscount(0);
    setSelectedVoucherCode({
      id: 0,
      name: "Choose One",
    });
  };

  const handleSubmit = async (paymentIntentId) => {
    try {
      const response = await orderApi.createOrder(
        {
          ...order,
          totalAmount: Math.max(amount - voucherDiscount, 0),
          customerId: customerId,
          paid: true,
          voucher,
          payments: [
            {
              amount: Math.max(amount - voucherDiscount, 0),
              paymentType: paymentTypes[mode - 1]?.name.toUpperCase(),
              ccTransactionId: paymentIntentId,
            },
          ],
        },
        paymentIntentId
      );
      closeModalComplex();
      addToast(`Success: Order with ID ${response.data.id} created`, {
        appearance: "success",
        autoDismiss: true,
      });
      clear();
    } catch (err) {
      addToast(`Error: Order was not created`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const getCustomerId = async () => {
    if (customer.contactNumber === phone) return;
    if (phone === "") {
      setCustomerId(null);
      setCustomer({});
      addToast(`Info: You did not key in a phone number`, {
        appearance: "info",
        autoDismiss: true,
      });
      return;
    }
    const data = await dispatch(getCustomerByPhone(phone)).unwrap();
    if (data.length === 0) {
      setCustomerId(null);
      setCustomer({});
      addToast(`Error: No Customer found`, {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
    const res = await posApi.getVoucherCodes(data[0]?.id);
    setVoucherCodes([
      { id: 0, name: "Choose One" },
      ...res.data.map((voucher, index) => {
        return {
          id: index + 1,
          name: `${voucher.campaign}: $${voucher.amount
            } voucher (expiring ${moment(voucher.expiry).format("DD/MM/yyyy")})`,
          ...voucher,
        };
      }),
    ]);
    setCustomerId(data[0]?.id);
    setCustomer(data[0]);
    setCustomerName(data[0]?.firstName + " " + data[0]?.lastName);
    const { data: spend } = await posApi.getCurrentSpending(data[0]?.id);
    const nextTier = membershipTiers.find((tier) => tier.minSpend > spend);
    setProgress({
      current: spend,
      next: nextTier.minSpend,
      tier: nextTier.name,
    });
    addToast(
      `Success: Customer ${data[0]?.firstName} ${data[0]?.lastName} was found`,
      {
        appearance: "success",
        autoDismiss: true,
      }
    );
  };

  const getVoucherDetails = async () => {
    if (voucherCode === "") {
      setVoucherDiscount(0);
      addToast(`Info: You did not key in a voucher code`, {
        appearance: "info",
        autoDismiss: true,
      });
    } else {
      const data = await dispatch(getVoucherByCode(voucherCode)).unwrap();
      if (data.length === 0) {
        setVoucherCode("");
        setVoucherDiscount(0);
        addToast(`Error: No Voucher found`, {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        setVoucher(data);
        setVoucherDiscount(data?.amount);
        addToast(
          `Success: Voucher with code: ${voucherCode} of $${data?.amount} was found`,
          {
            appearance: "success",
            autoDismiss: true,
          }
        );
      }
    }
  };

  useEffect(() => {
    selectedVoucherCode?.voucherCode
      ? setVoucherCode(selectedVoucherCode.voucherCode)
      : setVoucherCode("");
  }, [selectedVoucherCode]);

  const handleConfirm = () => {
    getCustomerId();
    getVoucherDetails();
    setShowChoice(true);
  };

  return (
    <SimpleModal open={open} closeModal={closeModalComplex}>
      <div className="inline-block align-top my-20 bg-white rounded-lg px-4 pt-4 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:w-fit sm:max-w-4xl sm:p-6">
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
                      iORA member to retrieve their details, and apply the
                      voucher code if they are using one.
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
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex items-stretch flex-grow focus-within:z-10">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={phone}
                      placeholder="91234567"
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && getCustomerId()}
                      className="focus:ring-cyan-500 focus:border-cyan-500 block w-full rounded-none rounded-l-md pl-3 text-md border-gray-300"
                      aria-describedby="price-currency"
                    />
                  </div>
                  <button
                    type="button"
                    className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-r-md text-gray-50 bg-cyan-600 hover:bg-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                    onClick={getCustomerId}
                  >
                    <SearchIcon
                      className="h-5 w-5 text-gray-50"
                      aria-hidden="true"
                    />
                    <span>Find</span>
                  </button>
                </div>
                {customerName === "" ? (
                  <h3 className="mt-1 block text-md text-gray-700">
                    Customer is not a member
                  </h3>
                ) : (
                  <div className="bg-white border border-gray-300 sm:rounded-md my-3 p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                    <h3 className="block text-md font-medium text-gray-700 col-span-1 sm:col-span-2">
                      {customerName} (Contact: {customer?.contactNumber})
                    </h3>
                    <p className="flex text-sm text-gray-700 pr-10">
                      <span className="flex grow">Mem. Points:</span>
                      {customer?.membershipPoints}
                    </p>
                    <p className="flex text-sm text-gray-700 pr-10">
                      <span className="flex grow">Mem. Tier:</span>
                      {customer?.membershipTier.name}
                    </p>
                    <p className="flex text-sm text-gray-700 pr-10">
                      <span className="flex grow">No. of Orders:</span>
                      {customer?.customerOrders?.length}
                    </p>
                    {customer?.customerOrders?.length > 0 && (
                      <p className="flex text-sm text-gray-700 pr-10">
                        <span className="flex grow">Avg Spend:</span> $
                        {Number.parseFloat(
                          customer?.customerOrders.reduce(
                            (sum, order) => sum + order.totalAmount,
                            0
                          ) / customer?.customerOrders?.length
                        ).toFixed(2)}
                      </p>
                    )}
                    <div className="block text-md font-medium text-gray-700 col-span-1 sm:col-span-2 mt-2">
                      <ProgressBar
                        bgColor="#0891b2"
                        completed={`${progress.current + 150}`}
                        maxCompleted={progress.next + 150}
                        customLabel={`$${progress.next - progress.current} more to ${progress.tier}`}
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <SimpleSelectMenu
                        label="Customer's Available Vouchers"
                        options={voucherCodes}
                        selected={selectedVoucherCode}
                        setSelected={setSelectedVoucherCode}
                        disabled={voucherCodes.length === 0}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Voucher Code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="voucher"
                    id="voucher"
                    value={voucherCode}
                    placeholder="XXXXXXXXXX"
                    onChange={(e) => setVoucherCode(e.target.value)}
                    onBlur={getVoucherDetails}
                    className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-3 pr-3 sm:text-lg border-gray-300 rounded-md"
                    aria-describedby="price-currency"
                  />
                </div>
                <p
                  className="mt-2 text-sm text-gray-500"
                  id="email-description"
                >
                  {voucherDiscount === 0
                    ? "No voucher used"
                    : `Voucher used has $${voucherDiscount} value`}
                </p>
              </div>
              <div className="mt-3 flex flex-row-reverse space-x-4 space-x-reverse justify-center">
                <button
                  type="button"
                  disabled={amount === 0}
                  onClick={handleConfirm}
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
            amount={Math.max(amount - voucherDiscount, 0)}
            handleSubmit={() => handleSubmit("")}
            addToast={addToast}
          />
        )}
        {mode >= 2 && mode <= 4 && (
          <Card
            addToast={addToast}
            checkoutItems={checkoutItems}
            voucherAmt={voucherDiscount}
            handleSubmit={handleSubmit}
          />
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
                  <p>
                    Please confirm the cash tendered before proceeding with
                    checkout.
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

export const Card = ({
  addToast,
  checkoutItems,
  voucherAmt,
  handleSubmit,
  clientSecret: cs,
}) => {
  const [terminal, setTerminal] = useState(null);
  const [connected, setConnected] = useState(false);
  const posId = localStorage.getItem("pos-posdeviceid").replace(/"/g, "");
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

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
          setConnected(false);
        },
      });
      setTerminal(initTerminal);
    });
  }, [addToast]);

  useEffect(() => {
    cs
      ? setClientSecret(cs)
      : checkoutItems.length > 0 &&
      posApi
        .getPaymentIntent(checkoutItems, voucherAmt)
        .then((response) => setClientSecret(response.data))
        .catch((err) => {
          addToast(`Error: ${err.response.data.message}`, {
            appearance: "error",
            autoDismiss: true,
          });
        });
  }, [checkoutItems, voucherAmt, addToast, cs]);

  useEffect(() => {
    !connected && posId && terminal && setSimulated();
  }, [connected, posId, terminal])

  const setSimulated = async () => {
    const config = { simulated: true };
    setLoading(true);
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
      setConnected(true);
    }
    setLoading(false);
  };

  const simulatedCheckout = async () => {
    try {
      if (!terminal || !clientSecret) {
        throw new Error("Either reader or client secret is not connected.");
      }
      setLoading(true);
      terminal.setSimulatorConfiguration({
        testCardNumber: "4242424242424242",
        paymentMethodType: "card",
      });

      const result = await terminal.collectPaymentMethod(clientSecret);
      if (result.error) {
        throw new Error(result.error.message);
      }

      addToast(`Success: Payment method retrieved`, {
        appearance: "success",
        autoDismiss: true,
      });
      const result2 = await terminal.processPayment(result?.paymentIntent);
      if (result2.error) {
        throw new Error(result2.error.message);
      }

      addToast(`Success: Payment processed`, {
        appearance: "success",
        autoDismiss: true,
      });
      await handleSubmit(result2.paymentIntent.id);
      setLoading(false);
    } catch (err) {
      addToast(`Error: ${err}`, {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white overflow-hidden divide-y divide-gray-200 sm:divide-y-0 flex justify-center">
      <div className="grow max-w-md sm:grid sm:grid-cols-1 pl-3">
        <div className="text-center justify-center border-2 border-gray-300 rounded-lg px-12 pt-6 mx-2">
          <img
            className="mx-auto h-24 w-24 text-gray-400"
            src={process.env.PUBLIC_URL + "/cardreader.svg"}
            alt="card-reader"
          />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {loading ?
              connected
                ? "Checking out"
                : "Connecting to reader..."
              : connected
                ? `Reader ${localStorage
                  .getItem("pos-posdeviceid")
                  .replace(/"/g, "")}`
                : "No readers"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {connected
              ? "You are successfully connected to the reader. The customer can now use the card reader."
              : "Get started by connecting your reader via Bluetooth."}
          </p>
          <div className="my-6">
            {loading ? <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled
            ><TailSpin width="20" height="20"/></button>
              : connected ? (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={simulatedCheckout}
                >
                  <DeviceTabletIcon
                    className="-ml-1 mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  Simulate Checkout
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={setSimulated}
                >
                  <DeviceTabletIcon
                    className="-ml-1 mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  Connect to Simulated Reader
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

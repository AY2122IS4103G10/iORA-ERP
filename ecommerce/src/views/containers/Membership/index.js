import { Dialog, Transition } from "@headlessui/react";
import {
  CakeIcon,
  CheckIcon,
  ExclamationIcon,
  NewspaperIcon,
  UserCircleIcon,
  XIcon,
} from "@heroicons/react/outline";
import { Fragment, useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { useToasts } from "react-toast-notifications";
import {
  fetchMembershipTiers,
  selectAllMembershipTiers,
} from "../../../stores/slices/membershipTierSlice";
import {
  getCurrentSpending,
  redeemPoints,
  selectCurrSpend,
  selectUser,
} from "../../../stores/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import ProgressBar from "@ramonak/react-progress-bar";
import { useMemo } from "react";
import {
  SelectColumnFilter,
  SimpleTable,
} from "../../components/Tables/SimpleTable";
import moment from "moment";
import { api } from "../../../environments/Api";
import { SimpleModal } from "../../components/Modals/SimpleModal";
import { useCallback } from "react";

const tiers = [
  {
    id: 1,
    name: "Silver",
    spending: "$200 - $999",
    points: "3%",
  },
  {
    id: 2,
    name: "Gold",
    spending: "$1000 - $2499",
    points: "5%",
  },
  {
    id: 3,
    name: "Diamond",
    spending: "$200 - $999",
    points: "7%",
  },
];

const VouchersTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "campaign",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Voucher Code",
        accessor: "voucherCode",
      },
      {
        Header: "Value",
        accessor: "amount",
        Cell: (e) => `$${e.value}`,
      },
      {
        Header: "Expiry Date",
        accessor: "expiry",
        Cell: (e) => moment(e.value).format("DD/MM/YYYY"),
      },
      {
        Header: "Redeemed",
        accessor: "redeemed",
        Cell: (e) => (e.value ? "Yes" : "No"),
      },
    ],
    []
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="md:flex md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your Vouchers</h1>
      </div>
      <div className="mt-4">
        {data.length ? (
          <SimpleTable columns={columns} data={data} />
        ) : (
          <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
            <span className="mt-2 block text-sm font-medium text-gray-900">
              No vouchers.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const Membership = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [amount, setAmount] = useState(5);
  const [vouchers, setVouchers] = useState([]);
  const handleChange = (e) => {
    setAmount(e.target.value);
  };
  const { addToast } = useToasts();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openMoreInfo, setOpenMoreInfo] = useState(false);

  const membershipTiers = useSelector((state) =>
    selectAllMembershipTiers(state)
  );
  const currSpend = useSelector((state) => selectCurrSpend(state));

  const getVoucherCodes = useCallback(
    async (customerId) => {
      setLoading(true);
      try {
        const { data } = await api.get("store/member/vouchers", customerId);
        setVouchers(data);
      } catch (err) {
        addToast(`Error: Unable to load vouchers.`, {
          appearance: "error",
          autoDismiss: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast]
  );

  useEffect(() => {
    dispatch(fetchMembershipTiers());
    user.id && dispatch(getCurrentSpending(user.id));
    user.id && getVoucherCodes(user.id);
  }, [dispatch, user.id, addToast, getVoucherCodes]);

  const nextTier = membershipTiers.find(
    (tier) => tier.minSpend > currSpend
  ) || {
    name: "DIAMOND",
    minSpend: currSpend,
  };

  const currTier = membershipTiers
    .filter((tier) => tier.minSpend <= currSpend)
    .slice(-1)[0];

  const onRedeemClicked = async () => {
    setLoading(true);
    try {
      await dispatch(redeemPoints({ email: user?.email, amount })).unwrap();
      addToast("Successfully redeemeed voucher.", {
        appearance: "success",
        autoDismiss: true,
      });
      getVoucherCodes(user?.id);
      setOpen(false);
    } catch (err) {
      addToast(`Error: ${err.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const options = [
    {
      label: "$5",
      value: 5,
    },
    {
      label: "$10",
      value: 10,
    },
    {
      label: "$25",
      value: 25,
    },
    {
      label: "$50",
      value: 50,
    },
  ];

  const openMoreInfoModal = () => setOpenMoreInfo(true);
  const closeMoreInfoModal = () => setOpenMoreInfo(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {Boolean(user) && (
        <div className="px-4 sm:px-6 lg:px-8 pt-4">
          <div className="px-6 md:flex md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Your Membership
            </h1>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={openMoreInfoModal}
            >
              <span>More info</span>
            </button>
          </div>
          <div className="py-6 px-4">
            <div className="bg-white">
              <div className="border border-gray-200 rounded-md px-4 py-5 sm:px-6">
                {currTier && nextTier && (
                  <div>
                    <div className="col-span-2 my-3 pb-5">
                      <p className="block text-md text-gray-700 my-4">
                        Upgrade from a {currTier.name} member to a{" "}
                        {nextTier.name} member simply by spending $
                        {nextTier.minSpend}!
                      </p>
                      <ProgressBar
                        animateOnRender
                        initCompletedOnAnimation={`${currSpend + 75}`}
                        bgColor="#4f46e5"
                        completed={`${currSpend + 150}`}
                        maxCompleted={nextTier.minSpend + 150}
                        customLabel={`$${
                          (nextTier.minSpend - currSpend).toFixed(2)
                        } more to ${nextTier.name}`}
                      />
                    </div>
                  </div>
                )}
                <dl className="grid grid-cols-1 gap-x-5 gap-y-8 pt-5 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-bold text-gray-600">
                      Your Membership Tier
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.membershipTier.name}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-bold text-gray-600">
                      Your Membership Points
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.membershipPoints.toFixed(2)}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-bold text-gray-600">
                      Redeem Points
                    </dt>
                    <div className="flex items-center justify-between space-x-2">
                      <select
                        className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
                        value={amount}
                        onChange={handleChange}
                      >
                        {options.map((option) => (
                          <option value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="py-2 px-4 border text-white border-gray-300 bg-indigo-600 rounded-md shadow-sm text-sm font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => setOpen(true)}
                      >
                        Redeem
                      </button>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <VouchersTable data={vouchers} />
          <SimpleModal open={openMoreInfo} closeModal={closeMoreInfoModal}>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
              <div className="sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={closeMoreInfoModal}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="max-w-7xl mx-auto py-24 px-4 bg-white sm:px-6 lg:px-8">
                <div className="space-y-8">
                  <div className="lg:text-center">
                    <p className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                      Rewards
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                      Get rewarded and earn points for every purchase. Join us
                      today and start enjoying shopping benefits at all our
                      stores.
                    </p>
                  </div>
                  <div className="py-12 bg-white">
                    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                      <h2 className="sr-only">Features</h2>
                      <dl className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
                        <div className="relative">
                          <dt>
                            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                              <UserCircleIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </div>
                            <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                              Member Exclusive Promotions
                            </p>
                          </dt>
                        </div>
                        <div className="relative">
                          <dt>
                            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                              <CakeIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </div>
                            <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                              Special 2x Points on Birthday Month
                            </p>
                          </dt>
                        </div>
                        <div className="relative">
                          <dt>
                            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                              <NewspaperIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </div>
                            <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                              Updates About Exciting Promotions, Events & News
                            </p>
                          </dt>
                        </div>
                      </dl>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl leading-none tracking-tight">
                      Member Tiers
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500">
                      Be rewarded as you spend.
                    </p>
                  </div>
                  <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
                    {tiers.map((tier) => (
                      <div
                        key={tier.id}
                        className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col"
                      >
                        <div className="flex-1 justify-center">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {tier.name}
                          </h3>
                          {/* Feature list */}
                          <ul className="mt-6 space-y-6">
                            <li key={1} className="flex">
                              <CheckIcon
                                className="flex-shrink-0 w-6 h-6 text-indigo-500"
                                aria-hidden="true"
                              />
                              <p className="ml-3 text-gray-500">
                                2 years spending of{" "}
                                <span className="font-bold">
                                  {tier.spending}
                                </span>{" "}
                                and above
                              </p>
                            </li>
                            <li key={2} className="flex">
                              <CheckIcon
                                className="flex-shrink-0 w-6 h-6 text-indigo-500"
                                aria-hidden="true"
                              />
                              <p className="ml-3 text-gray-500">
                                Points accumulation is{" "}
                                <span className="font-bold">{tier.points}</span>{" "}
                                of every purchase
                              </p>
                            </li>
                            <li key={3} className="flex">
                              <CheckIcon
                                className="flex-shrink-0 w-6 h-6 text-indigo-500"
                                aria-hidden="true"
                              />
                              <p className="ml-3 text-gray-500">
                                <span className="font-bold">2x</span> points on
                                birthday month
                              </p>
                            </li>
                            <li key={4} className="flex">
                              <CheckIcon
                                className="flex-shrink-0 w-6 h-6 text-indigo-500"
                                aria-hidden="true"
                              />
                              <p className="ml-3 text-gray-500">
                                Member exclusive promotions
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ))}
                    <p className="lg:col-start-1 lg:col-span-3 italic pt-4 pb-4">
                      * Birthday 2X points for the first successful transaction
                      on your birthday month (capped at $200)
                    </p>
                  </div>
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl leading-none tracking-tight">
                      Redeeming Points
                    </h1>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500">
                      Redeem your membership points for vouchers you can use
                      online or in-store.
                    </p>
                    <ul className="pt-8 list-disc list-inside">
                      <li>
                        Each point is worth $1. E.g. 5 points can be
                        redeemed for a $5 voucher
                      </li>
                      <li>Vouchers are denoted in $5, $10, $25 and $50 only</li>
                      <li>
                        Voucher code will be sent to: <b>{user.email}</b>
                      </li>
                      <li>Only 1 voucher will be accepted per checkout</li>
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-2xl pt-5 font-bold">
                      Terms and Conditions
                    </h2>
                    <ul className="list-inside list-disc pt-5 text-xs">
                      <li>
                        The usage of membership privileges is ONLY applicable in
                        Singapore stores.
                      </li>
                      <li>
                        Membership is applicable for both retail stores and
                        online store.
                      </li>
                      <li>
                        Member's information are kept confidential and used
                        strictly for loyalty program purpose only.
                      </li>
                      <li>
                        Each person can only hold one iORA membership account.
                        In the event that a member has more than 1 account, iORA
                        management has the rights to keep only the most recently
                        used account.
                      </li>
                      <li>
                        Membership is not transferable or exchangeable for cash.
                      </li>
                      <li>
                        Once the transaction of points redemption has been made,
                        it cannot be cancelled nor reversed.
                      </li>
                      <li>
                        Points will only be granted on the final purchase amount
                        after discount and after deducting Cash Voucher or Gift
                        Voucher.
                      </li>
                      <li>All accumulate points will expire after 1 year.</li>
                      <li>
                        Foreign applications with overseas contact will not be
                        able to receive SMS correspondences.
                      </li>
                      <li>
                        The company reserves the right to alter and amend any of
                        the Terms & Conditions of the membership, including any
                        or all of the benefits, or to terminate it at any time
                        without prior notice.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </SimpleModal>
        </div>
      )}

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpen}
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
              {loading ? (
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div className="flex items-center justify-center">
                    <TailSpin color="#00BFFF" height={20} width={20} />
                  </div>
                </Transition.Child>
              ) : (
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div>
                    <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                      <button
                        type="button"
                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationIcon
                          className="h-6 w-6 text-indigo-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 font-medium text-gray-900"
                        >
                          Redeem Voucher
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Your membership points will be redeemed, and a $
                            {amount} voucher will be sent to your email address.
                          </p>
                          <p className="mt-4 text-sm text-gray-500">
                            This action cannot be undone.
                          </p>
                          <p className="text-sm text-gray-500">
                            Are you sure you want to proceed?
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={onRedeemClicked}
                      >
                        Redeem
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              )}
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

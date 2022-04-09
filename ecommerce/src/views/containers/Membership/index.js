import { Dialog, Transition } from '@headlessui/react';
import { ExclamationIcon, XIcon } from '@heroicons/react/outline';
import { Fragment, useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { useToasts } from "react-toast-notifications";
import { api } from '../../../environments/Api';
import {
    fetchMembershipTiers,
    selectAllMembershipTiers,
} from "../../../stores/slices/membershipTierSlice";
import {
    getCurrentSpending,
    selectCurrSpend
} from "../../../stores/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import ProgressBar from "@ramonak/react-progress-bar";

export const Membership = () => {
    const dispatch = useDispatch(); 
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [amount, setAmount] = useState(5);
    const handleChange = (e) => {
        setAmount(e.target.value);
    }
    const { addToast } = useToasts();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const membershipTiers = useSelector((state) => selectAllMembershipTiers(state));
    const currSpend = useSelector((state) => selectCurrSpend(state));

    useEffect(() => {
        dispatch(fetchMembershipTiers());
        dispatch(getCurrentSpending(user.id));
    }, [dispatch]);

    const nextTier =
        membershipTiers.find((tier) => tier.minSpend > currSpend) ||
        {
            name: "DIAMOND",
            minSpend: currSpend,
        };
    const currTier =
        membershipTiers
            .filter((tier) => tier.minSpend <= currSpend)
            .slice(-1)[0];

    const onRedeemClicked = () => {
        const redeemPoints = async () => {
            const { data } = await api.get("online/redeemPoints", `${user.email}/${amount}`);
            return data;
        };
        setLoading(true);
        redeemPoints()
            .then((data) => {
                setUser(data);
            })
            .then(() => {
                addToast("Successfully issued voucher", {
                    appearance: "success",
                    autoDismiss: true,
                });
                setOpen(false);
            })
            .catch((err) => {
                addToast(`Error: Insufficient points`, {
                    appearance: "error",
                    autoDismiss: true,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }

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
        }
    ]

    return (
        <div className="pt-6 pb-16 sm:pb-24 mt-8 max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {Boolean(user) && <>
                <h1 className="text-3xl text-center font-bold text-gray-900">Your Membership</h1>
                <div className="mt-8 mb-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
                    <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                        <div className="bg-white shadow sm:rounded-lg">
                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                {currTier && nextTier && (
                                    <>
                                        <div className="col-span-2 my-3 pb-5">
                                            <p className="block text-md text-gray-700 my-4">
                                                Upgrade from a {currTier.name} member to a {nextTier.name}{" "}
                                                member simply by spending ${nextTier.minSpend}!
                                            </p>
                                            <ProgressBar
                                                animateOnRender
                                                initCompletedOnAnimation={`${currSpend + 75}`}
                                                bgColor="#4f46e5"
                                                completed={`${currSpend + 150}`}
                                                maxCompleted={nextTier.minSpend + 150}
                                                customLabel={`$${nextTier.minSpend - currSpend
                                                    } more to ${nextTier.name}`}
                                            />
                                        </div>
                                    </>
                                )}
                                <dl className="grid grid-cols-1 gap-x-5 gap-y-8 pt-5 sm:grid-cols-5">
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-bold text-gray-600">
                                            Your Membership Tier
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">{user.membershipTier.name}</dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-bold text-gray-600">
                                            Your Membership Points
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">{user.membershipPoints}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-bold text-gray-600">
                                            Redeem Points
                                        </dt>
                                        <select
                                            className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none rounded-t-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
                                            value={amount}
                                            onChange={handleChange}>
                                            {options.map((option) => (
                                                <option value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="mt-2 bg-white py-2 px-4 border text-white border-gray-300 bg-indigo-600 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={() => setOpen(true)}>
                                            Redeem
                                        </button>

                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl text-center font-bold text-gray-900">Redeeming Membership Points</h1>
                <h4 className="pt-2">Redeem your membership points for a voucher.</h4>
                <ul className="pt-2 list-disc list-inside">
                    <li>Each point is worth a dollar. E.g. 5 points can be redeemed for a $5 voucher</li>
                    <li>Vouchers are denoted in $5, $10, $25 and $50 only</li>
                    <li>Voucher code will be sent to: <b>{user.email}</b></li>
                    <li>Only 1 voucher will be accepted per checkout</li>
                </ul>
            </>}

            <h1 className="text-3xl text-center pt-8 font-bold text-gray-900">Rewards</h1>
            <h2 className="text-2xl pt-5 text-gray-900">Get Rewarded and Earn Points for Every Purchase / Redesigned Prices and Rewards</h2>
            <h4 className="pt-2">Join us today and start enjoying shopping benefits at all our stores:</h4>
            <ol className="pt-4 list-decimal list-inside">
                <li>Member Exclusive Promotions</li>
                <li>Special 2x Points on Birthday Month</li>
                <li>Update About Exciting Promotions, Events & News</li>
            </ol>

            <ul role="list" className="mt-8 pt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                <li className="col-span-1 flex flex-col bg-gray-100 rounded-lg shadow divide-y divide-gray-200" >
                    <div className="flex-1 flex flex-col p-8">
                        <h5 className="text-2xl">SILVER</h5>
                        <ul className="list-inside list-disc">
                            <li>2 years spending of $200 - $999</li>
                            <li>Points accumulation is 3% of every purchase</li>
                            <li>2x points on birthday month</li>
                            <li>Member exclusive promotions</li>
                        </ul>
                    </div>
                </li>
                <li className="col-span-1 flex flex-col bg-gray-200 rounded-lg shadow divide-y divide-gray-200" >
                    <div className="flex-1 flex flex-col p-8">
                        <h5 className="text-2xl">GOLD</h5>
                        <ul className="list-inside list-disc">
                            <li>2 years spending of $1000 - $2499</li>
                            <li>Points accumulation is 5% of every purchase</li>
                            <li>2x points on birthday month</li>
                            <li>Member exclusive promotions</li>
                        </ul>
                    </div>
                </li>
                <li className="col-span-1 flex flex-col bg-gray-300 rounded-lg shadow divide-y divide-gray-200" >
                    <div className="flex-1 flex flex-col p-8">
                        <h5 className="text-2xl">DIAMOND</h5>
                        <ul className="list-inside list-disc">
                            <li>2 years spending of $2500 and above</li>
                            <li>Points accumulation is 7% of every purchase</li>
                            <li>2x points on birthday month</li>
                            <li>Member exclusive promotions</li>
                        </ul>
                    </div>
                </li>
            </ul>
            <p className="italic mt-4 pb-4">* Birthday 2X points for the first successful transaction on your birthday month (capped at RM500)</p>

            <h2 className="text-2xl pt-5 font-bold">Terms and Conditions</h2>
            <ul className="list-inside list-disc pt-5">
                <li>The usage of membership privileges is ONLY applicable in Singapore stores.</li>
                <li>Membership is applicable for both retail stores and online store.</li>
                <li>Member's information are kept confidential and used strictly for loyalty program purpose only.</li>
                <li>Each person can only hold one iORA membership account. In the event that a member has more than 1 account, iORA management has the rights to keep only the most recently used account.</li>
                <li>Membership is not transferable or exchangeable for cash.</li>
                <li>Once the transaction of points redemption has been made, it cannot be cancelled nor reversed.</li>
                <li>Points will only be granted on the final purchase amount after discount and after deducting Cash Voucher or Gift Voucher.</li>
                <li>All accumulate points will expire after 1 year.</li>
                <li>Foreign applications with overseas contact will not be able to receive SMS correspondences.</li>
                <li>The company reserves the right to alter and amend any of the Terms & Conditions of the membership, including any or all of the benefits, or to terminate it at any time without prior notice.</li>
            </ul>

            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
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
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
                            {loading ?
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
                                :
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <div >
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
                                                <ExclamationIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                            </div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                    Redeem Voucher
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        Your membership points will be redeemed, and a ${amount} voucher will be sent to your email address.</p>
                                                    <p className="mt-4 text-sm text-gray-500">This action cannot be undone.</p>
                                                    <p className="text-sm text-gray-500">Are you sure you want to proceed?</p>
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
                            }
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>);
}
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from '@headlessui/react'
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getCustomerByPhone } from "../../../../stores/slices/customerSlice";
import { XCircleIcon } from '@heroicons/react/solid'

const MemberModal = ({
    cancelButtonRef,
    openMemberModal,
    setOpenMemberModal,
    phone,
    onPhoneChanged,
    memberClicked,
    error,
    setError
}) => (
    <Transition.Root show={openMemberModal} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={() => setOpenMemberModal(false)}>
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
                <span className="hidden sm:align-middle sm:h-screen" aria-hidden="true">
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
                    <form>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        Please enter your Phone Number
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <div>
                                            <div className="mt-1">
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    id="phone"
                                                    autoComplete="phone"
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    placeholder="91234567"
                                                    value={phone}
                                                    onChange={onPhoneChanged}
                                                    required
                                                    aria-describedby="rfid"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {error &&
                                <div className="mt-3 bg-red-50 border-l-4 border-red-400 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-800">
                                                There is no account linked with this phone number.
                                                Please try again.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                                    onClick={memberClicked}
                                >
                                    Confirm
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                    onClick={() => {
                                        setOpenMemberModal(false);
                                        setError(false);
                                    }}
                                    ref={cancelButtonRef}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </Transition.Child>
            </div>
        </Dialog>
    </Transition.Root>
)

const Page = ({
    setOpenMemberModal
}) => (
    <div className="grid gap-5 mt-20">
        <div className="max-w-3xl mx-auto">
            <img
                className="mx-auto h-20 w-50 mb-5"
                src="android-chrome-512x512.png"
                alt="iORA"
            />
            <button
                type="button"
                className=
                "inline-flex items-center px-10 py-10 box-content h-32 w-55 border border-black text-2xl font-bold rounded-lg shadow-lg text-black bg-gray-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setOpenMemberModal(true)}
            >
                I am a member
            </button>
        </div>
        <div className="max-w-3xl mx-auto">
            <Link to="/ss/order">
                <button
                    type="button"
                    className=
                    "inline-flex items-center px-5 py-10 box-content h-32 w-55 border border-black text-2xl font-bold rounded-lg shadow-lg text-black bg-gray-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    I am not a member
                </button>
            </Link>
        </div>
    </div>
)

export function FrontPage() {
    const [openMemberModal, setOpenMemberModal] = useState(false);
    const [phone, setPhone] = useState("");
    const [error, setError] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cancelButtonRef = useRef(null);

    const onPhoneChanged = (e) => setPhone(e.target.value);

    const memberClicked = (evt) => {
        evt.preventDefault();
        dispatch(getCustomerByPhone(phone))
            .unwrap()
            .then((data) => {
                window.localStorage.setItem("customer", JSON.stringify(data[0]));
            })
            .then(wait())
            .catch(error => setError(true))

        function wait() {
            if (localStorage.getItem("customer") !== null) {
                navigate("order")
            } else {
                setTimeout(wait, 0);
            }
        }
    }

    return (
        <>
            <Page
                setOpenMemberModal={setOpenMemberModal}
            />
            <MemberModal
                cancelButtonRef={cancelButtonRef}
                openMemberModal={openMemberModal}
                setOpenMemberModal={setOpenMemberModal}
                phone={phone}
                onPhoneChanged={onPhoneChanged}
                memberClicked={memberClicked}
                error={error} 
                setError={setError}/>
        </>
    )
}
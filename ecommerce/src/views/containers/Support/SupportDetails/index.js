import { Dialog, Transition } from '@headlessui/react';
import { ExclamationIcon, PaperClipIcon, XIcon } from '@heroicons/react/outline';
import { ChevronLeftIcon } from "@heroicons/react/solid";
import moment from "moment";
import { Fragment, useEffect, useRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { IMGBB_SECRET } from '../../../../config';
import { fetchSupportTickets, replySupportTicket, resolveSupportTicket, selectTicketById } from "../../../../stores/slices/supportTicketSlice";

const Header = ({
    status,
    customerId,
    setOpen
}) => {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <nav
                className="flex items-start px-2 py-3 sm:px-4 lg:px-6"
                aria-label="Breadcrumb"
            >
                <Link
                    to={-1}
                    className="inline-flex items-center space-x-3 text-sm font-medium text-gray-900"
                >
                    <ChevronLeftIcon
                        className="-ml-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                    <span>Back</span>
                </Link>
            </nav>
            <div className="flex items-center space-x-3">
                <div>
                    <p className="mx-auto max-w-fit italic">
                        {status === "PENDING" && "We are looking into this matter and will get back to you shortly."}
                    </p>
                </div>
            </div>
            <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
                {status !== "RESOLVED" && customerId === JSON.parse(localStorage.getItem("user")).id &&
                    <button
                        type="button"
                        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500`}
                        onClick={() => setOpen(true)}
                    >
                        <span>Close Ticket</span>
                    </button>
                }
            </div>
        </div>
    );
};

const SupportTicketBody = ({ subject, messages }) => {
    return (
        <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
            <div className="space-y-3 lg:col-start-1 lg:col-span-2">
                <div className="bg-white shadow overflow-hidden rounded-md" >
                    <div className="px-4 py-5 sm:px-6">
                        <h2
                            id="warehouse-information-title"
                            className="text-lg leading-3 font-bold text-gray-900"
                        >
                            {subject}
                        </h2>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-1 sm:px-6">
                        <ul className="divide-y divide-gray-200">
                            {messages.map((msg, index) => (
                                <li key={index} className="px-6 py-4">
                                    <p className="font-bold text-lg align-top mb-5">{msg.name}</p>
                                    {Boolean(msg.imageUrl) && <img alt="attachment" src={msg.imageUrl} width="500" />}
                                    <p className="text-m align-bottom mb-5">{msg.message}</p>
                                    <p className="text-xs italic align-bottom mb-5">{moment.unix(msg.timeStamp / 1000).format("H:mm:ss, DD/MM/YYYY")}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

const InputArea = ({ input, onInputChanged, onReplyClicked, file, setFile, loading }) => {
    const fileRef = useRef();

    const handleChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="border-gray-200 mx-auto lg:max-w-7xl px-4 py-1 mt-5 sm:px-6">
            <form className="relative px-4">
                <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500">
                    <label htmlFor="input" className="sr-only">
                        Input
                    </label>
                    <textarea
                        rows={2}
                        name="input"
                        id="input"
                        className="block w-full border-0 py-0 resize-none placeholder-gray-500 mt-1 focus:ring-0 sm:text-sm"
                        placeholder="Write a message..."
                        value={input}
                        onChange={onInputChanged}
                    />
                </div>
                <div className="border-t border-gray-200 px-2 py-2 flex justify-between items-center space-x-3 sm:px-3">
                    <div className="flex">
                        <input ref={fileRef}
                            onChange={handleChange}
                            multiple={false}
                            type="file"
                            accept="image/*"
                            hidden />
                        <button
                            type="button"
                            className="-ml-2 -my-2 rounded-full px-3 py-2 inline-flex items-center text-left text-gray-400 group"
                            onClick={() => fileRef.current.click()}
                        >
                            <PaperClipIcon className="-ml-1 h-5 w-5 mr-2 group-hover:text-gray-500" aria-hidden="true" />
                            <span className="text-sm text-gray-500 group-hover:text-gray-600 italic">
                                {Boolean(file.name) ? file.name : "Attach a file"}
                            </span>
                        </button>
                        {Boolean(file.name) &&
                            <button
                                type="button"
                                className="-ml-2 -my-2 rounded-full px-3 py-2 inline-flex items-center text-left text-gray-400 group"
                                onClick={() => setFile([])}
                            >
                                <XIcon className="-ml-1 h-5 w-5 mr-2 group-hover:text-gray-500" aria-hidden="true" />
                            </button>}
                    </div>
                    <div className="flex-shrink-0">
                        {loading ? <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            disabled
                        >
                            <TailSpin color="#00BFFF" height={20} width={20} />
                        </button> :
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                onClick={onReplyClicked}
                            >
                                Reply
                            </button>}
                    </div>
                </div>
            </form>
        </div>
    )
}

const ResolveModal = ({ open, setOpen, ticketId, onResolveClicked }) => {
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => setOpen(false)}>
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
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ExclamationIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        Close Support Ticket
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to close this ticket?
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            You will not longer be able to reply to this ticket.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={onResolveClicked}
                                >
                                    Resolve
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export const SupportDetails = () => {
    const { addToast } = useToasts();
    const { ticketId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const ticket = useSelector((state) => selectTicketById(state, parseInt(ticketId)));
    const ticketStatus = useSelector((state) => state.supportTickets.status);

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [file, setFile] = useState({});

    useEffect(() => {
        ticketStatus === "succeeded" && dispatch(fetchSupportTickets());
    }, [ticketStatus, dispatch]);

    const onResolveClicked = () => {
        setOpen(false);
        dispatch(resolveSupportTicket(ticketId))
            .then(() => {
                addToast("Ticket has been marked as Resolved.", {
                    appearance: "success",
                    autoDismiss: true,
                });
                navigate(`/support/${ticketId}`);
            })
            .catch((err) =>
                addToast(`Error: ${err.message}`, {
                    appearance: "error",
                    autoDismiss: true,
                })
            );
    }

    const onInputChanged = (e) => setInput(e.target.value);

    const onReplyClicked = (evt) => {
        evt.preventDefault();
        setLoading(true);
        if (Boolean(input)) {
            const image = new FormData();
            image.append('image', file)

            const name = JSON.parse(localStorage.getItem("user")).firstName + " " + JSON.parse(localStorage.getItem("user")).lastName
            var url;

            Boolean(file.name) ? fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_SECRET}`,
                {
                    method: 'POST',
                    body: image,
                }
            ).then((response) => response.json())
                .then((data) => {
                    url = data.data.url;
                    dispatch(replySupportTicket(
                        {
                            ticketId,
                            name,
                            body: { input, url }
                        }
                    ))
                        .unwrap()
                        .then(() => {
                            setFile([]);
                            setInput("");
                        })
                        .then(() => {
                            addToast("Successfully replied to ticket", {
                                appearance: "success",
                                autoDismiss: true,
                            });
                        })
                        .catch((err) => {
                            addToast(`Error: ${err.message}`, {
                                appearance: "error",
                                autoDismiss: true,
                            });
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                }) : dispatch(replySupportTicket(
                    {
                        ticketId,
                        name,
                        body: { input, url }
                    }
                ))
                    .unwrap()
                    .then(() => {
                        setInput("");
                    })
                    .then(() => {
                        addToast("Successfully replied to ticket", {
                            appearance: "success",
                            autoDismiss: true,
                        });

                    })
                    .catch((err) => {
                        addToast(`Error: ${err.message}`, {
                            appearance: "error",
                            autoDismiss: true,
                        });
                    })
                    .finally(() => {
                        setLoading(false);
                    });
        }
    }

    return (
        Boolean(ticket) &&
        <div className="py-8 xl:py-10">
            <Header
                status={ticket.status}
                customerId={ticket.customer.id}
                setOpen={setOpen} />
            <SupportTicketBody
                subject={ticket.subject}
                messages={ticket.messages} />
            {ticket.status === "PENDING_CUSTOMER" &&
                <InputArea
                    input={input}
                    onInputChanged={onInputChanged}
                    onReplyClicked={onReplyClicked}
                    file={file}
                    setFile={setFile}
                    loading={loading} />}
            <ResolveModal
                open={open}
                setOpen={setOpen}
                ticketId={ticketId}
                onResolveClicked={onResolveClicked} />
        </div>
    );
}
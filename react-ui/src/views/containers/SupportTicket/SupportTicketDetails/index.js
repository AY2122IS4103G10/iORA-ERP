import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationIcon,
  PaperClipIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";
import moment from "moment";
import { Fragment, useEffect, useRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { IMGBB_SECRET } from "../../../../config";
import {
  deleteSupportTicket,
  fetchSupportTickets,
  replySupportTicket,
  resolveSupportTicket,
  selectTicketById,
} from "../../../../stores/slices/supportTicketSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete";

const Header = ({ ticketId, status, setOpen, setOpenDelete }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <NavigatePrev page="Support Tickets" path="/sm/support" />
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Support Ticket #{ticketId} ({status})
          </h1>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        {status !== "RESOLVED" ? (
          <button
            type="button"
            className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500`}
            onClick={() => setOpen(true)}
          >
            <span>Resolve Ticket</span>
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
            onClick={() => setOpenDelete(true)}
          >
            <TrashIcon
              className="-ml-1 mr-2 h-5 w-5 text-white"
              aria-hidden="true"
            />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

const SupportTicketBody = ({ subject, messages, customer, order }) => {
  return (
    <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
      <div className="space-y-3 lg:col-start-1 lg:col-span-2">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2
              id="warehouse-information-title"
              className="text-lg leading-3 font-medium text-gray-900"
            >
              Customer Information
            </h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Customer Id
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.id}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  First Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.firstName}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.lastName}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Contact Number
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.contactNumber}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <Link to={`/sm/customers/${customer.id}`}>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md shadow-sm text-black hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-500"
                  >
                    Visit Customer page
                  </button>
                </Link>
              </div>
            </dl>
          </div>
        </div>

        {Boolean(order) && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2
                id="warehouse-information-title"
                className="text-lg leading-3 font-medium text-gray-900"
              >
                Order Information
              </h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Order Id
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.id}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {moment
                      .unix(order.dateTime / 1000)
                      .format("H:mm:ss, DD/MM/YYYY")}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Order amount
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    ${order.totalAmount}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Total order quantity
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {order.lineItems.reduce((sum, li) => sum + li.qty, 0)}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Voucher Code
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {Boolean(order.voucher)
                      ? order.voucher.voucherCode
                      : "None"}
                  </dd>
                </div>
                <Link to={`/sm/orders/${order.id}`}>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md shadow-sm text-black hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-500"
                  >
                    Visit Order page
                  </button>
                </Link>
              </dl>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h2
              id="warehouse-information-title"
              className="text-lg leading-3 font-bold text-gray-900"
            >
              Subject: {subject}
            </h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-1 sm:px-6">
            <ul className="divide-y divide-gray-200">
              {messages.map((msg, index) => (
                <li key={index} className="px-6 py-4">
                  <p className="font-bold text-lg align-top mb-5">{msg.name}</p>
                  {Boolean(msg.imageUrl) && (
                    <img alt="attachment" src={msg.imageUrl} width="500" />
                  )}
                  <p className="text-m align-bottom mb-5">{msg.message}</p>
                  <p className="text-xs italic align-bottom mb-5">
                    {moment
                      .unix(msg.timeStamp / 1000)
                      .format("H:mm:ss, DD/MM/YYYY")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputArea = ({
  input,
  onInputChanged,
  onReplyClicked,
  file,
  setFile,
  loading,
}) => {
  const fileRef = useRef();

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="max-w-3xl lg:max-w-7xl mx-auto py-1 mt-5 sm:px-2">
      <form className="relative px-4">
        <div className="shadow-sm">
          <label htmlFor="input" className="sr-only">
            Input
          </label>
          <textarea
            rows={3}
            name="input"
            id="input"
            className="focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Write a message..."
            value={input}
            onChange={onInputChanged}
          />
        </div>
        <div className="px-2 py-4 flex justify-between items-center space-x-3 sm:px-3">
          <div className="flex">
            <input
              ref={fileRef}
              onChange={handleChange}
              multiple={false}
              type="file"
              accept="image/*"
              hidden
            />
            <button
              type="button"
              className="-ml-2 -my-2 rounded-full px-3 py-2 inline-flex items-center text-left text-gray-400 group"
              onClick={() => fileRef.current.click()}
            >
              <PaperClipIcon
                className="-ml-1 h-5 w-5 mr-2 group-hover:text-gray-500"
                aria-hidden="true"
              />
              <span className="text-sm text-gray-500 group-hover:text-gray-600 italic">
                {Boolean(file.name) ? file.name : "Attach a file"}
              </span>
            </button>
            {Boolean(file.name) && (
              <button
                type="button"
                className="-ml-2 -my-2 rounded-full px-3 py-2 inline-flex items-center text-left text-gray-400 group"
                onClick={() => setFile([])}
              >
                <XIcon
                  className="-ml-1 h-5 w-5 mr-2 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
          <div className="flex-shrink-0">
            {loading ? (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                disabled
              >
                <TailSpin color="#00BFFF" height={20} width={20} />
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                onClick={onReplyClicked}
              >
                Reply
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

const ResolveModal = ({
  open,
  setOpen,
  ticketId,
  onResolveClicked,
  loading,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => setOpen(false)}
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
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        Resolve Support Ticket #{ticketId}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to resolve this ticket? Customer
                          will not longer be able to reply and will have to
                          create a new ticket if the problem persists.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
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
            )}
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export const SupportTicketDetails = () => {
  const { addToast } = useToasts();
  const { ticketId } = useParams();
  const ticket = useSelector((state) =>
    selectTicketById(state, parseInt(ticketId))
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ticketStatus = useSelector((state) => state.supportTickets.status);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [input, setInput] = useState("");
  const [file, setFile] = useState({});

  useEffect(() => {
    ticketStatus === "idle" && dispatch(fetchSupportTickets());
  }, [ticketStatus, dispatch]);

  const onResolveClicked = async () => {
    setLoading(true);
    try {
      await dispatch(resolveSupportTicket(ticketId)).unwrap();
      addToast("Ticket has been marked as Resolved.", {
        appearance: "success",
        autoDismiss: true,
      });
      navigate(`/sm/support/${ticketId}`);
    } catch (err) {
      addToast(`Error: ${err.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const onInputChanged = (e) => setInput(e.target.value);
  const onReplyClicked = (evt) => {
    evt.preventDefault();
    setLoading(true);
    if (Boolean(input)) {
      const image = new FormData();
      image.append("image", file);

      const name = JSON.parse(localStorage.getItem("user")).name;
      var url;

      Boolean(file.name)
        ? fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_SECRET}`, {
            method: "POST",
            body: image,
          })
            .then((response) => response.json())
            .then((data) => {
              url = data.data.url;
              dispatch(
                replySupportTicket({
                  ticketId,
                  name,
                  body: { input, url },
                })
              )
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
            })
        : dispatch(
            replySupportTicket({
              ticketId,
              name,
              body: { input, url },
            })
          )
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
  };

  const onDeleteClicked = () => {
    dispatch(deleteSupportTicket(ticketId))
      .unwrap()
      .then(() => {
        addToast("Successfully deleted support ticket", {
          appearance: "success",
          autoDismiss: true,
        });
        setOpenDelete(false);
        navigate("/sm/support");
      })
      .catch((err) =>
        addToast(`Error: Job Title cannot be deleted as it is being used.`, {
          appearance: "error",
          autoDismiss: true,
        })
      );
  };

  return (
    Boolean(ticket) && (
      <div className="py-8 xl:py-10">
        <Header
          ticketId={ticketId}
          status={ticket.status}
          setOpen={setOpen}
          setOpenDelete={setOpenDelete}
        />
        <SupportTicketBody
          subject={ticket.subject}
          messages={ticket.messages}
          customer={ticket.customer}
          order={ticket.customerOrder}
        />
        {ticket.status === "PENDING" && (
          <InputArea
            input={input}
            onInputChanged={onInputChanged}
            onReplyClicked={onReplyClicked}
            file={file}
            setFile={setFile}
            loading={loading}
          />
        )}
        <ResolveModal
          open={open}
          setOpen={setOpen}
          ticketId={ticketId}
          onResolveClicked={onResolveClicked}
          loading={loading}
        />
        <ConfirmDelete
          item={ticket.subject}
          open={openDelete}
          closeModal={() => setOpenDelete(false)}
          onConfirm={onDeleteClicked}
        />
      </div>
    )
  );
};

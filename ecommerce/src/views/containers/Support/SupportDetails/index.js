import { Dialog, Transition } from "@headlessui/react";
import {
  ChatAltIcon,
  ExclamationIcon,
  PaperClipIcon,
  XIcon,
} from "@heroicons/react/outline";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import moment from "moment";
import { Fragment, useEffect, useRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { IMGBB_SECRET } from "../../../../config";
import {
  fetchSupportTickets,
  replySupportTicket,
  resolveSupportTicket,
  selectTicketById,
} from "../../../../stores/slices/supportTicketSlice";
import { selectUser } from "../../../../stores/slices/userSlice";

const Header = ({ status, customerId, setOpen, subject, userId, category }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:space-x-5 lg:px-8">
      <nav className="flex items-start py-3" aria-label="Breadcrumb">
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
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {subject}
          </h3>
          <p className="mt-2 max-w-4xl text-sm text-gray-500">{category}</p>
        </div>
        {status !== "RESOLVED" &&
        userId !== undefined &&
        customerId === userId ? (
          <div className="mt-3 flex sm:mt-0 sm:ml-4">
            <button
              type="button"
              className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-100 focus:ring-red-500`}
              onClick={() => setOpen(true)}
            >
              <span>Close Ticket</span>
            </button>
          </div>
        ) : (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Resolved
          </span>
        )}
      </div>
    </div>
  );
};

const SupportTicketBody = ({ messages }) => {
  return (
    <div className="mt-8 max-w-3xl mx-auto sm:px-6">
      <div className="flow-root">
        <ul className="-mb-8">
          {messages.map((message, index) => (
            <li key={index}>
              <div className="relative pb-8">
                {index !== messages.length - 1 ? (
                  <span
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <span className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                      <ChatAltIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {message.name}
                        </p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Sent {moment(message.timeStamp).fromNow()}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <p>{message.message}</p>
                    </div>
                    {Boolean(message.imageUrl) && (
                      <img
                        alt="attachment"
                        src={message.imageUrl}
                        className="mt-2"
                        width="500"
                      />
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
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
    <div className="max-w-3xl mx-auto md:space-x-5">
      <div className="mx-auto lg:max-w-7xl px-4 py-1 mt-5 sm:px-6">
        <form className="relative px-4" onSubmit={onReplyClicked}>
          <div>
            <label htmlFor="input" className="sr-only">
              Input
            </label>
            <textarea
              rows={2}
              name="input"
              id="input"
              className="focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled
                >
                  <TailSpin color="#FFFFFF" height={20} width={20} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Reply
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResolveModal = ({ open, setOpen, onResolveClicked, loading }) => {
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
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onResolveClicked}
                >
                  <span>Resolve</span>
                  {loading && (
                    <div className="ml-3 flex items-center justify-center">
                      <TailSpin color="#FFFFFF" height={20} width={20} />
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
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
  );
};

export const SupportDetails = () => {
  const { addToast } = useToasts();
  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const ticket = useSelector((state) =>
    selectTicketById(state, parseInt(ticketId))
  );

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [file, setFile] = useState({});

  useEffect(() => {
    dispatch(fetchSupportTickets());
  }, [dispatch, navigate]);

  const onResolveClicked = async () => {
    setLoading(true);
    try {
      await dispatch(resolveSupportTicket(ticketId)).unwrap();
      addToast("Ticket has been marked as Resolved.", {
        appearance: "success",
        autoDismiss: true,
      });
      navigate(`/support/${ticketId}`);
    } catch (err) {
      addToast(`Error: ${err.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onInputChanged = (e) => setInput(e.target.value);

  const onReplyClicked = (evt) => {
    evt.preventDefault();
    setLoading(true);
    if (Boolean(input)) {
      const image = new FormData();
      image.append("image", file);

      const name = `${user.firstName} ${user.lastName}`;
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
  
  return (
    Boolean(ticket) && (
      <div className="max-h-screen overflow-auto py-8 xl:py-10">
        <Header
          status={ticket.status}
          customerId={ticket.customer.id}
          setOpen={setOpen}
          subject={ticket.subject}
          userId={user?.id}
          category={ticket.category}
        />
        <SupportTicketBody messages={ticket.messages} />
        {(ticket.status === "PENDING_CUSTOMER" || ticket.status === "PENDING") && (
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
          onResolveClicked={onResolveClicked}
          loading={loading}
        />
      </div>
    )
  );
};

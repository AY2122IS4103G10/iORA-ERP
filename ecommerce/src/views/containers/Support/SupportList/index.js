import { Dialog, Transition } from "@headlessui/react";
import { PaperClipIcon, XIcon } from "@heroicons/react/outline";
import axios from "axios";
import moment from "moment";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { IMGBB_SECRET } from "../../../../config";
import {
  fetchPublicSupportTickets,
  selectPublicSupportTickets,
} from "../../../../stores/slices/supportTicketSlice";
import {
  createSupportTicket,
  selectUser,
  selectUserOrders,
  selectUserTickets,
} from "../../../../stores/slices/userSlice";
import {
  SelectColumnFilter,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";

const SupportTicketModal = ({
  open,
  setOpen,
  subject,
  onSubjectChanged,
  category,
  onCategoryChanged,
  order,
  onOrderChanged,
  message,
  onMessageChanged,
  file,
  setFile,
  onSubmitClicked,
  loading,
  orders,
}) => {
  const categories = [
    {
      id: 1,
      value: "ACCOUNT",
    },
    {
      id: 2,
      value: "ORDER",
    },
    {
      id: 3,
      value: "GENERAL",
    },
  ];

  const options = () => {
    const list = [{ label: "Select an order...", value: 0 }];
    orders?.forEach((order) => {
      list.push({
        label: `Order #${order.id}, Amount Spent: $${order.totalAmount}`,
        value: order.id,
      });
    });
    return list;
  };

  const fileRef = useRef();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => setOpen(false)}
      >
        <div
          className="flex min-h-screen text-center md:block md:px-2 lg:px-4"
          style={{ fontSize: 0 }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="hidden fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden md:inline-block md:align-middle md:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enterTo="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 md:scale-100"
            leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
          >
            <div className="flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-4xl">
              <div className="w-full relative flex items-center bg-white px-4 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                <button
                  type="button"
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                <div className="w-full grid grid-cols-1 gap-y-8 gap-x-6 items-start sm:grid-cols-12 lg:items-center lg:gap-x-8">
                  <div className="sm:col-span-12 lg:col-span-12">
                    <h2 className="text-xl font-medium text-gray-900 sm:pr-12">
                      New Support Ticket
                    </h2>

                    <section
                      aria-labelledby="information-heading"
                      className="mt-1"
                    >
                      <form onSubmit={onSubmitClicked}>
                        <div className="sm:overflow-hidden">
                          <div className="bg-white py-6 space-y-6 px-1">
                            <div className="grid grid-cols-3 gap-6">
                              <div className="col-span-3 sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Subject
                                </label>
                                <div className="mt-1 rounded-md shadow-sm flex">
                                  <input
                                    type="text"
                                    name="subject"
                                    id="subject"
                                    placeholder="Enter subject."
                                    value={subject}
                                    onChange={onSubjectChanged}
                                    className="focus:ring-gray-500 focus:border-gray-500 flex-grow block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
                                    required
                                    autoFocus
                                  />
                                </div>
                              </div>

                              <div className="col-span-3 sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Category
                                </label>
                                <div className="mt-1 rounded-md shadow-sm flex">
                                  <select
                                    className="focus:ring-gray-500 focus:border-gray-500 relative block w-full rounded-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
                                    required
                                    value={category}
                                    onChange={onCategoryChanged}
                                  >
                                    {categories.map((option) => (
                                      <option
                                        key={option.id}
                                        value={option.value}
                                      >
                                        {option.value}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {category === "ORDER" && (
                                <div className="col-span-3 sm:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Order Number
                                  </label>
                                  <div className="mt-1 rounded-md shadow-sm flex">
                                    <select
                                      className="focus:ring-gray-500 focus:border-gray-500 relative block w-full rounded-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
                                      value={order}
                                      onChange={onOrderChanged}
                                    >
                                      {options().map((option, index) => (
                                        <option
                                          key={index}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              )}

                              <div className="col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                  Description
                                </label>
                                <div className="mt-1">
                                  <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={3}
                                    value={message}
                                    onChange={onMessageChanged}
                                    className="shadow-sm focus:ring-gray-500 focus:border-gray-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                  />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                  Brief description of issue.
                                </p>
                              </div>

                              <div className="flex">
                                <input
                                  ref={fileRef}
                                  onChange={(e) => {
                                    setFile(e.target.files[0]);
                                  }}
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
                                    {Boolean(file.name)
                                      ? file.name
                                      : "Attach a file"}
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
                            </div>
                          </div>
                          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            {loading ? (
                              <button
                                type="button"
                                disabled
                                className="bg-gray-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                              >
                                <TailSpin
                                  color="#FFFFFF"
                                  height={20}
                                  width={20}
                                />
                              </button>
                            ) : (
                              <button
                                type="submit"
                                className="bg-gray-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                              >
                                Save
                              </button>
                            )}
                          </div>
                        </div>
                      </form>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
const SupportTicketTable = ({ data, handleOnClick, user }) => {
  const publicColumns = useMemo(
    () => [
      {
        Header: "Category",
        accessor: "category",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Subject",
        accessor: "subject",
      },
      {
        Header: "Last Response",
        accessor: (row) => `${row.messages[row.messages.length - 1]}`,
        Cell: (e) => moment(e.timeStamp).format("DD/MM/YY, h:mm a"),
      },
    ],
    []
  );

  const userColumns = useMemo(
    () => [
      {
        Header: "Category",
        accessor: "category",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Subject",
        accessor: "subject",
      },
      {
        Header: "Last Response",
        accessor: (row) => `${row.messages[row.messages.length - 1]}`,
        Cell: (e) => moment(e.timeStamp).format("DD/MM/YY, h:mm a"),
      },
      {
        Header: "Status",
        accessor: "status",
        Filter: SelectColumnFilter,
        filter: "includes",
        Cell: (e) =>
          e.value === "PENDING" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
              Pending Admin
            </span>
          ) : e.value === "PENDING_CUSTOMER" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Admin Replied
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Resolved
            </span>
          ),
      },
    ],
    []
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable
          columns={user ? userColumns : publicColumns}
          data={data}
          handleOnClick={handleOnClick}
        />
      </div>
    </div>
  );
};

export const SupportList = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const publicTickets = useSelector((state) =>
    selectPublicSupportTickets(state)
  );
  const user = useSelector(selectUser);
  const userOrders = useSelector(selectUserOrders);
  const userTickets = useSelector(selectUserTickets);
  const [openNewTicket, setOpenNewTicket] = useState(false);
  const [subject, setSubject] = useState("");
  const onSubjectChanged = (e) => setSubject(e.target.value);
  const [message, setMessage] = useState("");
  const onMessageChanged = (e) => setMessage(e.target.value);
  const [category, setCategory] = useState("ACCOUNT");
  const onCategoryChanged = (e) => setCategory(e.target.value);
  const [order, setOrder] = useState(0);
  const onOrderChanged = (e) => setOrder(e.target.value);
  const [file, setFile] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchPublicSupportTickets());
  }, [dispatch, navigate]);

  const handleOnClick = (row) => navigate(`${row.original.id}`);

  const onSubmitClicked = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    const ticket = {
      subject,
      category,
      messages: [
        {
          message,
          name: `${user?.firstName} ${user.lastName}`,
        },
      ],
      customer: {
        id: user?.id,
      },
    };
    if (order) ticket["customerOrder"] = {id : order};

    const image = new FormData();
    image.append("image", file);
    try {
      if (Boolean(file.name)) {
        const { data } = await axios.post(
          `https://api.imgbb.com/1/upload?key=${IMGBB_SECRET}`,
          image
        );
        ticket["imageUrl"] = data.data.url;
      }
      console.log(ticket);
      await dispatch(createSupportTicket(ticket)).unwrap();
      setSubject("");
      setMessage("");
      setCategory("");
      setOrder("");
      setFile([]);
      setOpenNewTicket(false);
      navigate("/support");
      addToast("Successfully created ticket. ", {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (err) {
      addToast(`Error: ${err.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="pt-6 pb-16 sm:pb-24 mt-8 max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div>
          <h1 className="text-3xl text-center font-bold text-gray-900">
            Support Centre
          </h1>
          <h2 className="text-center pt-5 pb-5">
            Need help? Search for your issue among existing support discussions.
            If your issue has not been resolved before, please create a new
            ticket.
          </h2>
          {publicTickets.length ? (
            <SupportTicketTable
              data={publicTickets}
              handleOnClick={handleOnClick}
              user={false}
            />
          ) : (
            <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                There is currently no resolved support ticket to display.
              </span>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl text-center font-bold text-gray-900 pt-5 pb-5">
            Your Support Tickets
          </h1>
          <div className="px-4 md:flex md:items-center md:justify-end lg:px-8 xl:px-12 pt-5">
            <div className="mt-6 flex space-x-3 md:mt-0">
              <button
                type="button"
                className="ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                onClick={() => setOpenNewTicket(true)}
              >
                <span>Create a New Ticket</span>
              </button>
            </div>
          </div>
          {userTickets.length ? (
            <SupportTicketTable
              data={userTickets}
              handleOnClick={handleOnClick}
              user={true}
            />
          ) : (
            <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                No support tickets.
              </span>
            </div>
          )}
        </div>
      </div>
      <SupportTicketModal
        open={openNewTicket}
        setOpen={setOpenNewTicket}
        subject={subject}
        onSubjectChanged={onSubjectChanged}
        category={category}
        onCategoryChanged={onCategoryChanged}
        order={order}
        onOrderChanged={onOrderChanged}
        message={message}
        onMessageChanged={onMessageChanged}
        file={file}
        setFile={setFile}
        onSubmitClicked={onSubmitClicked}
        loading={loading}
        orders={userOrders}
      />
    </>
  );
};

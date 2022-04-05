import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchSupportTickets,
  selectAllSupportTickets,
} from "../../../../stores/slices/supportTicketSlice";
import {
  SelectColumnFilter,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import moment from "moment";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { PaperClipIcon, XIcon } from "@heroicons/react/outline";
import { useState } from "react";

const SupportTicketModal = ({ open, setOpen, closeNewTicketModal }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
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
                  onClick={closeNewTicketModal}
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
                      <form action="#" method="POST">
                        <div className="sm:overflow-hidden">
                          <div className="bg-white py-6 space-y-6 px-1">
                            <div className="grid grid-cols-3 gap-6">
                              <div className="col-span-3 sm:col-span-2">
                                <label
                                  htmlFor="company-website"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Title
                                </label>
                                <div className="mt-1 rounded-md shadow-sm flex">
                                  <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    autoComplete="username"
                                    className="focus:ring-gray-500 focus:border-gray-500 flex-grow block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
                                  />
                                </div>
                              </div>

                              <div className="col-span-3">
                                <label
                                  htmlFor="about"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Description
                                </label>
                                <div className="mt-1">
                                  <textarea
                                    id="about"
                                    name="about"
                                    rows={3}
                                    className="shadow-sm focus:ring-gray-500 focus:border-gray-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                  />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                  Brief description of issue.
                                </p>
                              </div>

                              <div className="col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                  Attachments
                                </label>
                                <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                  {/* <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {e.value.map((file, index) => {
                      const idx = index;
                      return (
                        <li
                          key={index}
                          className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                        >
                          <div className="w-0 flex-1 flex items-center">
                            <PaperClipIcon
                              className="flex-shrink-0 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="ml-2 flex-1 w-0 truncate">
                              {file.name ? file.name : file}
                            </span>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex space-x-4">
                            <button
                              type="button"
                              className="bg-white rounded-md font-medium text-cyan-600 hover:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                              onClick={() => {
                                setData((old) =>
                                  old.map((row, index) => {
                                    if (index === e.row.index) {
                                      return {
                                        ...old[e.row.index],
                                        files: e.value.filter(
                                          (_, index) => index !== idx
                                        ),
                                      };
                                    }
                                    return row;
                                  })
                                );
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul> */}
                                </div>
                                <div className="mt-1 border-2 border-gray-300 border-dashed rounded-md px-6 pt-5 pb-6 flex justify-center">
                                  <div className="space-y-1 text-center">
                                    <svg
                                      className="mx-auto h-12 w-12 text-gray-400"
                                      stroke="currentColor"
                                      fill="none"
                                      viewBox="0 0 48 48"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                      <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-gray-600 hover:text-gray-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-500"
                                      >
                                        <span>Upload a file</span>
                                        <input
                                          id="file-upload"
                                          name="file-upload"
                                          type="file"
                                          className="sr-only"
                                        />
                                      </label>
                                      <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      PNG, JPG, GIF up to 10MB
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            <button
                              type="submit"
                              className="bg-gray-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                              Save
                            </button>
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
const SupportTicketTable = ({ data, handleOnClick }) => {
  const columns = useMemo(
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
        Cell: (e) => moment(e.timeStamp).format("DD/MM/YY, hh:mm"),
      },
    ],
    []
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable
          columns={columns}
          data={data}
          handleOnClick={handleOnClick}
        />
      </div>
    </div>
  );
};

export const SupportList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectAllSupportTickets);
  const supportTicketStatus = useSelector(
    (state) => state.supportTickets.status
  );
  const [openNewTicket, setOpenNewTicket] = useState(false);
  useEffect(() => {
    supportTicketStatus === "idle" && dispatch(fetchSupportTickets());
  }, [supportTicketStatus, dispatch]);
  const handleOnClick = (row) => navigate(`${row.original.id}`);

  const openNewTicketModal = () => setOpenNewTicket(true);
  const closeNewTicketModal = () => setOpenNewTicket(false);

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
          <SupportTicketTable
            data={data.filter((value) => value.status === "RESOLVED")}
            handleOnClick={handleOnClick}
          />
        </div>
        <div>
          <h1 className="text-3xl text-center font-bold text-gray-900 pt-5 pb-5">
            Your Support Tickets
          </h1>
          <div className="px-4 md:flex md:items-center md:justify-between lg:px-8 xl:px-12">
            <div className="mt-6 flex space-x-3 md:mt-0">
              <button
                type="button"
                className="ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                onClick={openNewTicketModal}
              >
                <span>New Ticket</span>
              </button>
            </div>
          </div>
          <SupportTicketTable
            data={data.filter(
              (value) =>
                value.customer.id ===
                JSON.parse(localStorage.getItem("user")).id
            )}
            handleOnClick={handleOnClick}
          />
        </div>
      </div>
      <SupportTicketModal open={openNewTicket} setOpen={setOpenNewTicket} />
    </>
  );
};

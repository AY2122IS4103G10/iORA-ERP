import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { api, updateAccessToken } from "../../../environments/Api";
import { refreshTokenJwt } from "../../../stores/slices/userSlice";

export function Notifications({ open, setOpen, setNewNoti }) {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const refreshToken =
    useSelector((state) => state.user.refreshToken) ||
    localStorage.getItem("refreshToken");

  const getNotifications = async () => {
    try {
      const { data } = await api.get(
        "admin/noti",
        localStorage.getItem("siteId")
      );

      if (notifications.length !== data.length) {
        addToast("New Notifications!", {
          appearance: "info",
          autoDismiss: true,
        });
        setNewNoti(true);
        setNotifications(data);
      }
    } catch (err) {
      if (refreshToken) {
        const { accessToken } = await dispatch(
          refreshTokenJwt(refreshToken)
        ).unwrap();
        updateAccessToken(accessToken);
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(getNotifications, 10000);
    return () => clearInterval(timer);
  });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={() => setOpen(false)}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full mt-12 pl-10 sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white border-2 shadow-xl">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-bold text-gray-900">
                        {" "}
                        Notifications{" "}
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-cyan-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <ul className="flex-1 divide-y divide-gray-200 overflow-y-auto">
                    {notifications
                      .slice(0)
                      .reverse()
                      .map((noti, index) => (
                        <li key={index}>
                          <Link
                            to={`${
                              noti.title.split(" ")[0] === "Stock"
                                ? "stocktransfer/" +
                                  noti.title.split(" ")[
                                    noti.title.split(" ").length - 1
                                  ]
                                : noti.title.split(" ")[0] === "Procurement"
                                ? "procurements/" +
                                  noti.title.split(" ")[
                                    noti.title.split(" ").length - 1
                                  ]
                                : noti.title.split(" ")[0] === "Online"
                                ? "orders/" +
                                  noti.title.split(" ")[
                                    noti.title.split(" ").length - 1
                                  ]
                                : "stocktransfer/create"
                            }`}
                          >
                            <div className="group relative flex items-center py-6 px-5">
                              <div
                                className="absolute inset-0 group-hover:bg-gray-50"
                                aria-hidden="true"
                              />
                              <div className="relative flex min-w-0 flex-1 items-center">
                                <div className="ml-4 truncate">
                                  <p className="truncate text-sm font-semibold text-gray-900 whitespace-pre-line">
                                    {noti.title}
                                  </p>
                                  <p className="truncate text-sm text-gray-500 whitespace-pre-line">
                                    {noti.message}
                                  </p>
                                  <br />
                                  <p className="truncate text-sm text-gray-500">
                                    {moment
                                      .unix(noti.timeStamp / 1000)
                                      .format(" H:mm:ss, DD/MM/YYYY")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

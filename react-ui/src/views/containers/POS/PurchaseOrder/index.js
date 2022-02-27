import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import {SimpleModal} from "../../../components/Modals/SimpleModal";
import {SimpleInputGroup} from "../../../components/InputGroups/SimpleInputGroup";
import {SimpleInputBox} from "../../../components/Input/SimpleInputBox";
import {SectionHeading} from "../../../components/HeadingWithTabs";

const header = () => {
  return (
    <div className="px-4 sm:px-6 lg:max-w-5/6 lg:mx-auto lg:px-8 flex">
      <div className="w-1/6 pt-4 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200"></div>
      <div className="w-1/6 pt-4 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
        <div class="py-4 md:flex flex items-left justify-between border-b border-indigo-500 lg:border-none">
          <h1 className="ml-3 md:flex text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
            POS System
          </h1>
        </div>
      </div>
      <div className="w-3/6 py-8 pb-5 border-b border-gray-200 sm:pb-0 ">
        <ul class="flex flex-wrap -mb-px">
          <li class="mr-2">
            <a
              href="/pos/order"
              class="inline-block py-4 px-4 text-sm font-medium text-center text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500">
              Purchase
            </a>
          </li>
          <li class="mr-2">
            <a
              href="/pos/main"
              class="inline-block py-4 px-4 text-sm font-medium text-center text-gray-500 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              aria-current="page">
              Purchase History
            </a>
          </li>
          <li class="mr-2">
            <a
              href="#"
              class="inline-block py-4 px-4 text-sm font-medium text-center text-gray-500 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300">
              Store Pick-up
            </a>
          </li>
          <li class="mr-2">
            <a
              href="#"
              class="inline-block py-4 px-4 text-sm font-medium text-center text-gray-500 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300">
              Administrative
            </a>
          </li>
        </ul>
      </div>
      <div class="ml-12 py-6">
        <Link to={`#`}>
          <button
            type="button"
            class="ml-10 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Logout
          </button>
        </Link>
      </div>
    </div>
  );
};

const ModalAddItem = ({open, close}) => {
  return (
    <SimpleModal open={open} closeModal={close}>
      <div
        className="fixed z-10 inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"></div>
        <form>
          <div className="p-4 space-y-8 divide-y divide-gray-200">
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5"></div>
          </div>
        </form>
      </div>
    </SimpleModal>
  );
};

const tabs = [
  {name: "Order", href: "", current: true},
  {name: "History", href: "orderHistory", current: false},
];

export const PosPurchaseOrder = () => {
  const [modalState, setModalState] = useState(false);
  const openModal = () => setModalState(true);
  const closeModal = () => setModalState(false);

  return (
    <>
      <SectionHeading header="Order History" tabs={tabs} />
    </>
  );
};

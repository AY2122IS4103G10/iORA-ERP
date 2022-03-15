import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Fragment, useState } from "react";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { XIcon } from "@heroicons/react/outline";

import {
  selectUserSite,
  updateCurrSite,
} from "../../../../stores/slices/userSlice";
import {
  selectSiteProductStock,
  editStock,
  getASiteStock,
} from "../../../../stores/slices/stocklevelSlice";
import {
  fetchModel,
  selectModel,
} from "../../../../stores/slices/productSlice";
import { useToasts } from "react-toast-notifications";
import { classNames } from "../../../../utilities/Util";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";

export const getProductItem = (data, sku) => {
  return data.products.filter(
    (item) => item.product.sku?.trim() === sku.trim()
  );
};

const columns = [
  {
    Header: "RFID Tag",
    accessor: "rfid",
  },
  {
    id: "available",
    Header: "Available",
    accessor: (row) => row.available.toString().toUpperCase(),
  },
];

const actions = [
  {
    id: 1,
    name: "Add",
  },
  {
    id: 2,
    name: "Remove",
  },
  {
    id: 3,
    name: "Set"
  }
];

export const Slideover = ({
  open,
  closeModal,
  handleEditStock,
  rfid,
  setRfid,
  selected,
  setSelected,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-scroll"
        onClose={closeModal}
      >
        <div className="absolute inset-0 overflow-scroll">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="pointer-events-auto w-screen  max-w-lg">
                <form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="bg-gray-50 px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between space-x-3">
                        <div className="space-y-1">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            {" "}
                            Edit Stock Level{" "}
                          </Dialog.Title>
                          <p className="text-sm text-gray-500">
                            Add or Remove Product Items
                          </p>
                        </div>
                        <div className="flex h-7 items-center">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                            onClick={closeModal}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Content container */}
                    <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                      <div className="space-y-1 px-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="project-name"
                            className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                          >
                            {" "}
                            Action{" "}
                          </label>
                        </div>
                        <div className="sm:col-span-2">
                          <Listbox value={selected} onChange={setSelected}>
                            {({ open }) => (
                              <>
                                <div className="mt-1 relative">
                                  <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm">
                                    <span className="block truncate">
                                      {selected.name}
                                    </span>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                      <SelectorIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </Listbox.Button>

                                  <Transition
                                    show={open}
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                  >
                                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                      {actions.map((action) => (
                                        <Listbox.Option
                                          key={action.id}
                                          className={({ active }) =>
                                            classNames(
                                              active
                                                ? "text-white bg-cyan-600"
                                                : "text-gray-900",
                                              "cursor-default select-none relative py-2 pl-8 pr-4"
                                            )
                                          }
                                          value={action}
                                        >
                                          {({ selected, active }) => (
                                            <>
                                              <span
                                                className={classNames(
                                                  selected
                                                    ? "font-semibold"
                                                    : "font-normal",
                                                  "block truncate"
                                                )}
                                              >
                                                {action.name}
                                              </span>

                                              {selected ? (
                                                <span
                                                  className={classNames(
                                                    active
                                                      ? "text-white"
                                                      : "text-cyan-600",
                                                    "absolute inset-y-0 left-0 flex items-center pl-1.5"
                                                  )}
                                                >
                                                  <CheckIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                  />
                                                </span>
                                              ) : null}
                                            </>
                                          )}
                                        </Listbox.Option>
                                      ))}
                                    </Listbox.Options>
                                  </Transition>
                                </div>
                              </>
                            )}
                          </Listbox>
                        </div>
                      </div>

                      <div className="space-y-1 px-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="rfid"
                            className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                          >
                            {" "}
                            RFID Tags{" "}
                          </label>
                        </div>
                        <div className="sm:col-span-2">
                          <textarea
                            id="rfid"
                            name="rfid"
                            rows={5}
                            className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                            value={rfid}
                            onChange={(e) => setRfid(e.target.value)}
                            placeholder="Scan or Enter RFID tags with a space in between"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Action buttons */}
                  <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        onClick={(e) => handleEditStock(e)}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export const QuantityTable = ({ qty, reserveQty }) => {
  return (
    <div className="mt-4 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 text-center text-sm font-semibold text-gray-900">
                    Quantity
                  </th>
                  <th scope="col" className="py-3.5 text-center text-sm font-semibold text-gray-900">
                    Reserved Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="text-center divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="whitespace-nowrap px-3 py-4 text-base text-black">{qty ?? 0}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{reserveQty ?? 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export const EditQtyModal = ({ open, closeModal, selected, setSelected, inputQty, setInputQty, handleEditQty }) => {
  return (
    <SimpleModal open={open} closeModal={closeModal}>
      <div className="inline-block align-bottom bg-white h-70 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
        <div>
          <div className="m-4 mt-2">
            <Dialog.Title
              as="h3"
              className="text-center text-lg leading-6 font-medium text-gray-900"
            >
              Edit Stock Quantity
            </Dialog.Title>
          </div>
          <div className="pt-2 pb-3">
            <SimpleSelectMenu
              options={actions}
              selected={selected}
              setSelected={setSelected}
            />
          </div>
          <input
            type="number"
            name="qty"
            id="qty"
            autoFocus
            className="flex-grow shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Quantity"
            value={inputQty}
            onChange={(e) => {
              if (e.target.value >= 0) {
                setInputQty(e.target.value);
              }
            }}
            onKeyPress={(e) => e.key === "Enter" && handleEditQty()}
          />
        </div>
        <div className="pt-4">
          <div className="flex-shrink-0 pt-5">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                onClick={handleEditQty}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </SimpleModal>
  );
}

export const StockLevelForm = (subsys) => {
  const dispatch = useDispatch();

  const { id } = useParams(); //sku code
  const siteId = useSelector(selectUserSite); //get current store/site user is in
  const productStock = useSelector((state) => selectSiteProductStock(state, id));
  //get product information
  const modelCode = id.substring(0, id.indexOf("-"));
  const model = useSelector(selectModel);

  const [open, setOpen] = useState(false);
  // const [rfid, setRfid] = useState("");
  const [inputQty, setInputQty] = useState(0);
  const [selected, setSelected] = useState(actions[0]);
  const [reload, setReload] = useState(0);
  const { addToast } = useToasts();

  useEffect(() => {
    dispatch(updateCurrSite());
    dispatch(getASiteStock(siteId));
    dispatch(fetchModel(modelCode));
  }, [dispatch, reload, modelCode, siteId]);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const handleEditQty = (e) => {
    let qty = productStock?.qty ?? 0;
    if (selected.id === 1) {
      qty = qty + parseInt(inputQty);
    } else if (selected.id === 2) {
      qty = qty - parseInt(inputQty);
    } else if (selected.id === 3) {
      qty = inputQty;
    }
    if (qty < 0) {
      addToast(`Quantity cannot be negative`, {
        appearance: "error",
        autoDismiss: true,
      });
    } else {
      dispatch(editStock({ sku: id, qty: qty, siteId: siteId }))
        .unwrap()
        .then((response) => {
          addToast("Successfully updated stock levels", {
            appearance: "success",
            autoDismiss: true,
          });
          setInputQty(0);
          setSelected(actions[0]);
          closeModal();
          setReload(reload + 1);
        })
        .catch((err) => {
          addToast(`Edit Stock Failed - Could be Invalid RFID tag`, {
            appearance: "error",
            autoDismiss: true,
          });
        });
    }
  }

  // const handleEditStock = (e) => {
  //   e.preventDefault();
  //   let toUpdate = {};
  //   const rfidArr = rfid.trim().split(" ");

  //   // add
  //   if (selected.id === 1) {
  //     Object.entries(rfidArr).forEach(([key, value]) => {
  //       toUpdate[value] = siteId;
  //     });

  //     // remove
  //   } else if (selected.id === 2) {
  //     Object.entries(rfidArr).forEach(([key, value]) => {
  //       toUpdate[value] = 0;
  //     });
  //   }

  //   dispatch(editStock({ toUpdate: toUpdate, siteId: siteId }))
  //     .unwrap()
  //     .then((response) => {
  //       addToast("Successfully updated stock levels", {
  //         appearance: "success",
  //         autoDismiss: true,
  //       });
  //       setReload(reload + 1);
  //     })
  //     .catch((err) => {
  //       addToast(`Edit Stock Failed - Could be Invalid RFID tag`, {
  //         appearance: "error",
  //         autoDismiss: true,
  //       });
  //     });
  // };

  return (
    Boolean(model) && (
      <div className="min-h-full">
        <main className="py-10">
          {/* Page header */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="relative">
                  <span
                    className="absolute inset-0 shadow-inner rounded-full"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SKU: {id}</h1>
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
            <div className="space-y-6 lg:col-start-1 lg:col-span-2">
              {/* Product information*/}
              <section aria-labelledby="applicant-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2
                      id="applicant-information-title"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Product Information
                    </h2>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {model === null ? "loading" : model.name}
                        </dd>
                      </div>

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Price
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {model === null ? "" : model.listPrice}
                        </dd>
                      </div>
                      {model != null && model.products != null
                        ? model?.products
                          ?.filter((prod) => prod.sku === id.trim())[0]
                          ?.productFields.map((field) => {
                            return (
                              <div key={field.id} className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                  {field.fieldName}
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                  {field.fieldValue}
                                </dd>
                              </div>
                            );
                          })
                        : ""}

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Online Exclusive
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {model === null
                            ? ""
                            : model.onlineOnly.toString().toUpperCase()}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Available
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {model === null
                            ? ""
                            : model.available.toString().toUpperCase()}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Description
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {model === null ? "" : model.description}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </section>

              <section aria-labelledby="stocks-level">
                <div className="grid grid-cols-2">
                  <div className="col-span-1">
                    <h2 className="ml-2 mt-2 text-lg leading-6 font-bold text-gray-900">
                      Stock Level
                    </h2>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center mr-3 px-3 py-3 border border-transparent text-sm leading-4 
                                font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                      onClick={() => openModal()}
                    >
                      Edit Stock
                    </button>
                  </div>
                </div>
                <QuantityTable
                  qty={productStock?.qty}
                  reserveQty={productStock?.reserveQty}

                />
              </section>
            </div>
          </div>

          <EditQtyModal
            open={open}
            closeModal={closeModal}
            selected={selected}
            setSelected={setSelected}
            inputQty={inputQty}
            setInputQty={setInputQty}
            handleEditQty={handleEditQty}
          />
          {/* Edit Stock Slideover */}
          {/* <Slideover
            open={open}
            closeModal={closeModal}
            handleEditStock={handleEditStock}
            rfid={rfid}
            setRfid={setRfid}
            selected={selected}
            setSelected={setSelected}
          /> */}
        </main>
      </div>
    )
  );
};

import { useToasts } from "react-toast-notifications";
import { useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";

import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Listbox, Transition } from '@headlessui/react'
import { editStock } from "../../../../stores/slices/stocklevelSlice";
import { selectUserSite } from "../../../../stores/slices/userSlice";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const actions = [
    {
        id: 1,
        name: "Add"
    },
    {
        id: 2,
        name: 'Remove'
    }
]

const ActionList = ({ actions, selected, setSelected }) => {

    return (
        <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
                <>
                    <div className="mt-1 relative">
                        <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm">
                            <span className="block truncate">{selected.name}</span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
                                                active ? 'text-white bg-cyan-600' : 'text-gray-900',
                                                'cursor-default select-none relative py-2 pl-8 pr-4'
                                            )
                                        }
                                        value={action}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                    {action.name}
                                                </span>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-cyan-600',
                                                            'absolute inset-y-0 left-0 flex items-center pl-1.5'
                                                        )}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
    )
}


const EditStockForm = ({ open, selected, setSelected, rfid, setRfid, handleEditStock }) => {

    return (
        <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="sr-only">Edit Stock Level</h1>
            <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                {/* Form */}
                <section aria-labelledby="profile-overview-title">
                    <div className="rounded-lg bg-white overflow-hidden shadow">
                        <form>
                            <div className="p-8 space-y-8 divide-y divide-gray-200">
                                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                                    <div>
                                        <div>
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Edit Stock Level
                                            </h3>
                                        </div>
                                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                                            <ActionList actions={actions} selected={selected} setSelected={setSelected} />
                                          
                                            <textarea
                                                id="rfid"
                                                name="rfid"
                                                rows={10}
                                                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                                                value={rfid}
                                                onChange={(e) => setRfid(e.target.value)}
                                                placeholder="Scan or Enter RFID tags with a space in between"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-5">
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                            onClick={handleEditStock}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    )
}



export const EditStockLevel = () => {
    const dispatch = useDispatch();
    const siteId = useSelector(selectUserSite);
    const [open, setOpen] = useState(false);
    const [rfid, setRfid] = useState("");
    const [selected, setSelected] = useState(actions[0]);
    const { addToast } = useToasts();

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    const handleEditStock = (e) => {
        e.preventDefault();
        let toUpdate = {};
        const rfidArr = rfid.trim().split(" ");
        // console.log(rfidArr);
        // add 
        if (selected.id === 1) {
            Object.entries(rfidArr).forEach(([key, value]) => {
                toUpdate[value] = siteId;
            });

            // remove
        } else if (selected.id === 2) {
            Object.entries(rfidArr).forEach(([key, value]) => {
                toUpdate[value] = 0;
            });
        }
        // console.log(toUpdate);

        dispatch(editStock({ toUpdate: toUpdate, siteId: siteId }))
            .unwrap()
            .then((response) => {
                addToast(`Sucessfully Edited Stock`, {
                    appearance: "success",
                    autoDismiss: true,
                });
                closeModal();
            })
            .catch((err) => {
                addToast(`Edit Stock Failed - Invalid RFID Tag`, {
                    appearance: "error",
                    autoDismiss: true,
                });
            })
    }

    return (
        <EditStockForm 
            open={open} 
            selected={selected} 
            setSelected={setSelected} 
            rfid={rfid} 
            setRfid={setRfid} 
            handleEditStock={handleEditStock}
        />
    )


}
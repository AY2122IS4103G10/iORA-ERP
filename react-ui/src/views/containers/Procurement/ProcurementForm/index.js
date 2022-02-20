import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";

import "react-datepicker/dist/react-datepicker.css";
import { api } from "../../../../environments/Api";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import { SimpleModal } from "../../../components/Modals/SimpleModal";

const siteTypes = [
  { id: 1, name: "Headquarters", value: "Headquarters" },
  { id: 2, name: "Manufacturing", value: "Manufacturing" },
  { id: 3, name: "Online Store", value: "Online Store" },
  { id: 4, name: "Store", value: "Store" },
  { id: 5, name: "Warehouse", value: "Warehouse" },
];

const AddProductItemModal = ({ open, setOpen }) => {
  return (
    <SimpleModal open={open} setOpen={setOpen}>
      <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            {/* <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" /> */}
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              Payment successful
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequatur amet labore.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={() => setOpen(false)}
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    </SimpleModal>
  );
};

const ProcurementFormBody = ({
  isEditing,
  manufacturing,
  onManufacturingChanged,
  warehouse,
  onWarehouseChanged,
  onAddSiteClicked,
  onCancelClicked,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">{!isEditing ? "Add" : "Edit"} New Site</h1>
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
                      {!isEditing ? "Create New" : "Edit"} Procurement Order
                    </h3>
                  </div>
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <SimpleInputGroup
                      label="Manufacturing"
                      inputField="manufacturing"
                      className="relative rounded-md sm:mt-0 sm:col-span-2"
                    >
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <SimpleInputBox
                          type="text"
                          name="manufacturing"
                          id="manufacturing"
                          autoComplete="manufacturing"
                          className="sm:col-span-3"
                          value={manufacturing}
                          onChange={onManufacturingChanged}
                          required
                        />
                        <SimpleInputBox
                          type="text"
                          name="warehouse"
                          id="warehouse"
                          autoComplete="warehouse"
                          className="sm:col-span-3"
                          value={warehouse}
                          onChange={onWarehouseChanged}
                          required
                        />
                      </div>
                    </SimpleInputGroup>
                    {/* <SimpleInputGroup
                      label="Site Type"
                      inputField="siteCode"
                      className="relative rounded-md sm:mt-0 sm:col-span-2"
                    >
                      <SimpleSelectMenu
                        options={siteTypes}
                        selected={siteTypeSelected}
                        setSelected={setSiteTypeSelected}
                      />
                    </SimpleInputGroup> */}
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    onClick={onCancelClicked}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    onClick={onAddSiteClicked}
                  >
                    {!isEditing ? "Add" : "Save"} site
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
);

export const ProcurementForm = () => {
  const { orderId } = useParams();
  const [manufacturing, setManufacturing] = useState(null);
  const [warehouse, setWarehouse] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onWManufacturingChanged = (e) => setManufacturing(e.target.value);
  const onWarehouseChanged = (e) => setWarehouse(e.target.value);

  const [requestStatus, setRequestStatus] = useState("idle");
  const canAdd =
    [manufacturing, warehouse].every(Boolean) && requestStatus === "idle";
  const onAddSiteClicked = (evt) => {
    evt.preventDefault();
    // if (canAdd)
    //   try {
    //     setRequestStatus("pending");
    //     dispatch(addNewVouchers({ name, expiry: siteCode })).unwrap();
    //     alert("Successfully added site");
    //     setName("");
    //     setManufacturing("");
    //     navigate(!isEditing ? "/ad/sites" : `/ad/sites/${orderId}`);
    //   } catch (err) {
    //     console.error("Failed to add site: ", err);
    //   } finally {
    //     setRequestStatus("idle");
    //   }
  };

  const onCancelClicked = () =>
    navigate(!isEditing ? "/ad/sites" : `/ad/sites/${orderId}`);

  useEffect(() => {
    Boolean(orderId) &&
      api.get("admin/viewSite", orderId).then((response) => {
        const {
          name,
          address,
          siteCode,
          active,
          stockLevel,
          company,
          procurementOrders,
        } = response.data;
        setIsEditing(true);
      });
  }, [orderId]);

  return (
    <>
      <ProcurementFormBody
        isEditing={isEditing}
        manufacturing={manufacturing}
        siteTypes={siteTypes}
      />
      <AddProductItemModal open={openProducts} setOpen={setOpenProducts} />
    </>
  );
};

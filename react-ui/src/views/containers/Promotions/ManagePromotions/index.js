import { useState } from "react";
import { Link } from "react-router-dom";
import { PromotionsList } from "../PromotionsList";
import { classNames } from "../../../../utilities/Util";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";

const tabs = [
  { name: "All Products", href: "/sm/products", current: false },
  { name: "Promotions", href: "/sm/products/promotions", current: true },
];

const modelListColumns = [
  [
    {
      Header: "Product Code",
      accessor: "modelCode",
      Cell: (e) => (
        <Link
          to={`/sm/products/${e.value}`}
          className="hover:text-gray-700 hover:underline"
        >
          {e.value}
        </Link>
      ),
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Color",
      accessor: (row) =>
        row.productFields
          .filter((field) => field.fieldName === "COLOUR")
          .map((field) => field.fieldValue)
          .join(", ")
    },
    {
      Header: "Size",
      accessor: (row) =>
        row.productFields
          .filter((field) => field.fieldName === "SIZE")
          .map((field) => field.fieldValue)
          .join(", ")
    },
    {
      Header: "List Price",
      accessor: "price",
      Cell: (e) => `$${e.value}`,
    },
    {
      Header: "Available",
      accessor: "available",
      Cell: (e) => (e.value ? "Yes" : "No"),
    },
  ],
];

const PromoModal = ({
  open,
  closeModal,
  isEditing,
  name,
  onNameChanged,
  discPrice,
  onDiscPriceChanged,
  onSaveClicked,
}) => {
  return (
    <SimpleModal open={open} closeModal={closeModal}>
      <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
        <form>
          <div className="p-4 space-y-8 divide-y divide-gray-200">
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {!isEditing ? "Add New" : "Edit"} Promotion
                </h3>
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <SimpleInputGroup
                    label="Name"
                    inputField="name"
                    className="sm:mt-0 sm:col-span-2"
                  >
                    <SimpleInputBox
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={onNameChanged}
                      required
                    />
                  </SimpleInputGroup>
                  <SimpleInputGroup
                    label="Discounted Price"
                    inputField="discPrice"
                    className="sm:mt-0 sm:col-span-2"
                  >
                    <SimpleInputBox
                      type="text"
                      name="discPrice"
                      id="discPrice"
                      value={discPrice}
                      onChange={onDiscPriceChanged}
                      required
                      disabled={isEditing}
                      className={isEditing && "bg-gray-50 text-gray-400"}
                    />
                  </SimpleInputGroup>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  onClick={onSaveClicked}
                >
                  {!isEditing ? "Add" : "Save"} promotion
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </SimpleModal>
  );
};

const Header = ({ openModal }) => {
  const [currTab, setCurrTab] = useState(0);
  const changeTab = (tabnumber) => setCurrTab(tabnumber);
  return (
    <div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <div className="flex items-center">
                <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                  Promotions
                </h1>
              </div>
            </div>
          </div>
          <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={openModal}
            >
              Add promotion
            </button>
          </div>
        </div>
        <div className="ml-3">
          <div className="sm:block">
            <nav className="-mb-px flex space-x-8">
              <Link
                key={tabs[0].name}
                to={tabs[0].href}
                className={classNames(
                  tabs[0].current
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                )}
                aria-current={tabs[0].current ? "page" : undefined}
                onClick={() => changeTab(0)}
              >
                {tabs[0].name}
              </Link>

              <Link
                key={tabs[1].name}
                to={tabs[1].href}
                className={classNames(
                  tabs[1].current
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                )}
                aria-current={tabs[1].current ? "page" : undefined}
                onClick={() => changeTab(1)}
              >
                {tabs[1].name}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ManagePromotions = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [discPrice, setDiscPrice] = useState("");
  const [openPromo, setOpenPromo] = useState(false);

  const onNameChanged = (e) => setName(e.target.value);
  const onDiscPriceChanged = (e) => setDiscPrice(e.target.value);
  const openModal = () => setOpenPromo(true);
  const closeModal = () => setOpenPromo(false);
  return (
    <>
      <Header openModal={openModal} />
      <PromotionsList />
      <PromoModal
        open={openPromo}
        closeModal={closeModal}
        isEditing={isEditing}
        name={name}
        onNameChanged={onNameChanged}
        discPrice={discPrice}
        onDiscPriceChanged={onDiscPriceChanged}
      />
    </>
  );
};

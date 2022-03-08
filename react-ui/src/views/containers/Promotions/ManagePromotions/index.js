import { useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { PromotionsList } from "../PromotionsList";
import { classNames } from "../../../../utilities/Util";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { useDispatch } from "react-redux";
import {
  addNewPromotion,
  updateExistingPromotion,
} from "../../../../stores/slices/promotionsSlice";

const tabs = [
  { name: "All Products", href: "/sm/products", current: false },
  { name: "Promotions", href: "/sm/products/promotions", current: true },
];

const PromoModal = ({
  open,
  closeModal,
  modalState,
  name,
  onNameChanged,
  quota,
  onQuotaChanged,
  coefficients,
  onCoefficientsChanged,
  constants,
  onConstantsChanged,
  onSaveClicked,
  setModalState,
  global,
  onGlobalChanged,
  stackable,
  onStackableChanged,
}) => {
  return (
    <SimpleModal open={open} closeModal={closeModal}>
      <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
        <form>
          <div className="p-4 space-y-8 divide-y divide-gray-200">
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {modalState === "add"
                    ? "Add New"
                    : modalState === "edit"
                    ? "Edit"
                    : "View"}{" "}
                  Promotion
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
                      disabled={modalState === "view"}
                    />
                  </SimpleInputGroup>
                  <SimpleInputGroup
                    label="Quota"
                    inputField="quota"
                    className="relative rounded-md sm:mt-0 sm:col-span-2"
                  >
                    <SimpleInputBox
                      type="number"
                      name="quota"
                      id="quota"
                      value={quota}
                      onChange={onQuotaChanged}
                      required
                      disabled={modalState === "view"}
                    />
                  </SimpleInputGroup>
                  <SimpleInputGroup
                    label="Coefficients"
                    inputField="coefficients"
                    className="relative rounded-md sm:mt-0 sm:col-span-2"
                  >
                    <SimpleInputBox
                      type="text"
                      name="coefficients"
                      id="coefficients"
                      value={coefficients}
                      onChange={onCoefficientsChanged}
                      helper={
                        modalState !== "view" &&
                        `Enter coefficients separated with a comma ",".`
                      }
                      required
                      disabled={modalState === "view"}
                    />
                  </SimpleInputGroup>
                  <SimpleInputGroup
                    label="Constants"
                    inputField="constants"
                    className="relative rounded-md sm:mt-0 sm:col-span-2"
                  >
                    <SimpleInputBox
                      type="text"
                      name="constants"
                      id="constants"
                      value={constants}
                      onChange={onConstantsChanged}
                      helper={
                        modalState !== "view" &&
                        `Enter constants separated with a comma ",".`
                      }
                      required
                      disabled={modalState === "view"}
                    />
                  </SimpleInputGroup>
                  <SimpleInputGroup
                    label="Options"
                    inputField="global-stackable"
                    className="relative rounded-md sm:mt-0"
                  >
                    <div className="py-2 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              name="global"
                              id="global"
                              className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded"
                              checked={global}
                              onChange={onGlobalChanged}
                              aria-describedby="global"
                              disabled={modalState === "view"}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="global"
                              className="font-medium text-gray-700"
                            >
                              Global
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sm:col-span-1">
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              name="stackable"
                              id="stackable"
                              className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded"
                              checked={stackable}
                              onChange={onStackableChanged}
                              aria-describedby="stackable"
                              disabled={modalState === "view"}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="stackable"
                              className="font-medium text-gray-700"
                            >
                              Stackable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SimpleInputGroup>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                {modalState === "view" ? (
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    onClick={() => setModalState("edit")}
                  >
                    Edit
                  </button>
                ) : (
                  <>
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
                      {modalState === "add" ? "Add" : "Save"} promotion
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </SimpleModal>
  );
};

const Header = ({ openModal, setModalState }) => {
  return (
    <div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                Promotions
              </h1>
            </div>
          </div>
          <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={() => {
                setModalState("add");
                openModal();
              }}
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
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [modalState, setModalState] = useState("view");
  const [promoId, setPromoId] = useState(null);
  const [name, setName] = useState("");
  const [quota, setQuota] = useState("");
  const [coefficients, setCoefficients] = useState("");
  const [constants, setConstants] = useState("");
  const [global, setGlobal] = useState(false);
  const [stackable, setStackable] = useState(false);
  const [openPromo, setOpenPromo] = useState(false);

  const onNameChanged = (e) => setName(e.target.value);
  const onQuotaChanged = (e) => setQuota(e.target.value);
  const onCoefficientsChanged = (e) => setCoefficients(e.target.value);
  const onConstantsChanged = (e) => setConstants(e.target.value);
  const onGlobalChanged = () => setGlobal(!global);
  const onStackableChanged = () => setStackable(!stackable);
  const openModal = () => setOpenPromo(true);
  const closeModal = () => {
    setPromoId(null);
    setName("");
    setQuota("");
    setCoefficients("");
    setConstants("");
    setGlobal(false);
    setStackable(false);
    setOpenPromo(false);
  };
  const canSave = [name, quota, coefficients, constants].every(Boolean);
  const onSaveClicked = (evt) => {
    evt.preventDefault();
    if (canSave) {
      if (modalState === "add")
        dispatch(
          addNewPromotion({
            fieldName: "category",
            fieldValue: name,
            quota: quota,
            coefficients: constants
              .split(",")
              .map((coeff) => parseFloat(coeff.trim())),
            constants: constants
              .split(",")
              .map((constant) => parseFloat(constant.trim())),
            global,
            stackable,
          })
        )
          .unwrap()
          .then(() => {
            addToast("Successfully added promotion", {
              appearance: "success",
              autoDismiss: true,
            });
            closeModal();
          })
          .catch((err) =>
            addToast(`Error: ${err.message}`, {
              appearance: "error",
              autoDismiss: true,
            })
          );
      else if (modalState === "edit")
        dispatch(
          updateExistingPromotion({
            id: promoId,
            fieldName: "category",
            fieldValue: name,
            quota: quota,
            coefficients: coefficients
              .split(",")
              .map((coeff) => parseFloat(coeff.trim())),
            constants: constants
              .split(",")
              .map((constant) => parseFloat(constant.trim())),
            global,
            stackable,
          })
        )
          .unwrap()
          .then(() => {
            addToast("Successfully updated promotion", {
              appearance: "success",
              autoDismiss: true,
            });
            closeModal();
          })
          .catch((err) =>
            addToast(`Error: ${err.message}`, {
              appearance: "error",
              autoDismiss: true,
            })
          );
    }
  };
  return (
    <>
      <Header openModal={openModal} setModalState={setModalState} />
      <PromotionsList
        dispatch={dispatch}
        openModal={openModal}
        setName={setName}
        setQuota={setQuota}
        setCoefficients={setCoefficients}
        setConstants={setConstants}
        setPromoId={setPromoId}
        setModalState={setModalState}
        setGlobal={setGlobal}
        setStackable={setStackable}
      />
      <PromoModal
        open={openPromo}
        closeModal={closeModal}
        modalState={modalState}
        name={name}
        onNameChanged={onNameChanged}
        quota={quota}
        onQuotaChanged={onQuotaChanged}
        coefficients={coefficients}
        onCoefficientsChanged={onCoefficientsChanged}
        constants={constants}
        onConstantsChanged={onConstantsChanged}
        global={global}
        onGlobalChanged={onGlobalChanged}
        stackable={stackable}
        onStackableChanged={onStackableChanged}
        onSaveClicked={onSaveClicked}
        setModalState={setModalState}
      />
    </>
  );
};

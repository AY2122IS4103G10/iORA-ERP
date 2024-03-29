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
  percent,
  setPercent,
  fixed,
  setFixed,
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
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <form onSubmit={onSaveClicked}>
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
                      <p
                        id="candidates-description"
                        className="text-gray-500 text-sm pt-1"
                      >
                        Minimum quantity to achieve promotion
                      </p>
                    </SimpleInputGroup>

                    <SimpleInputGroup
                      label="Discount Type"
                      inputField="global-stackable"
                      className="rounded-md sm:mt-0 sm:col-span-2"
                    >
                      <fieldset className="space-y-2">
                        <legend className="sr-only">Discount Type</legend>
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              name="percent"
                              id="percent"
                              className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded"
                              checked={percent}
                              onChange={() => setPercent(!percent)}
                              aria-describedby="percent"
                              disabled={modalState === "view"}
                              required={!percent && !fixed}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="percent"
                              className="font-medium text-gray-700"
                            >
                              Percentage
                            </label>
                            <p
                              id="candidates-description"
                              className="text-gray-500"
                            >
                              Discounts as a percentage of original price. (Eg.
                              10% off)
                            </p>
                          </div>
                        </div>
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              name="fixed"
                              id="fixed"
                              className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded"
                              checked={fixed}
                              onChange={() => setFixed(!fixed)}
                              aria-describedby="fixed"
                              disabled={modalState === "view"}
                              required={!percent && !fixed}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="fixed"
                              className="font-medium text-gray-700"
                            >
                              Fixed
                            </label>
                            <p
                              id="candidates-description"
                              className="text-gray-500"
                            >
                              Fixed price discount. (Eg. $25 off)
                            </p>
                          </div>
                        </div>
                      </fieldset>
                    </SimpleInputGroup>
                    {percent && (
                      <SimpleInputGroup
                        label="% Discount(s)"
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
                            modalState !== "view" && percent && fixed
                              ? "Final price calculated using formula (100 - %disc) x price + fixedPrice."
                              : `Enter percentage discount(s) separated with a comma ",".
                          Eg. 10% off items: "10".
                          Eg. 50% off second item: "100,50".
                          Eg. 1 for 1: "100,0" (takes 100% of higher price)`
                          }
                          required
                          disabled={modalState === "view"}
                        />
                      </SimpleInputGroup>
                    )}
                    {fixed && (
                      <SimpleInputGroup
                        label="Discounted Price(s)"
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
                            modalState !== "view" && percent && fixed
                              ? "Final price calculated using formula (100 - %disc) x price + fixedPrice."
                              : `Enter fixed prices(s) separated with a comma ",".
                          Eg. 2 for $49: "24.5, 24.5".`
                          }
                          required
                          disabled={modalState === "view"}
                        />
                      </SimpleInputGroup>
                    )}
                    <SimpleInputGroup
                      label="Options"
                      inputField="global-stackable"
                      className="rounded-md sm:mt-0 sm:col-span-2"
                    >
                      <fieldset className="space-y-2">
                        <legend className="sr-only">Discount Type</legend>
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
                            <p
                              id="candidates-description"
                              className="text-gray-500"
                            >
                              Promotion applies to ALL products. (Eg. sitewide
                              discount)
                            </p>
                          </div>
                        </div>
                        {/* <div className="relative flex items-start">
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
                            <p
                              id="candidates-description"
                              className="text-gray-500"
                            >
                              Promotion can be used with other promotions.
                            </p>
                          </div>
                        </div> */}
                      </fieldset>
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
  const [percent, setPercent] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [coefficients, setCoefficients] = useState("");
  const [constants, setConstants] = useState("");
  const [global, setGlobal] = useState(false);
  const [stackable, setStackable] = useState(false);
  const [openPromo, setOpenPromo] = useState(false);

  const onNameChanged = (e) => setName(e.target.value);
  const onQuotaChanged = (e) => setQuota(Math.max(e.target.value, 1));
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
    setPercent(false);
    setFixed(false);
  };
  const canSave =
    [name, quota].every(Boolean) &&
    ((percent && coefficients) || (fixed && constants));
  const onSaveClicked = (evt) => {
    evt.preventDefault();
    if (canSave) {
      if (modalState === "add")
        dispatch(
          addNewPromotion({
            fieldName: "category",
            fieldValue: name,
            quota: quota,
            coefficients: percent
              ? coefficients
                .split(",")
                .map((coeff) => 1 - parseFloat(coeff.trim()) / 100)
              : new Array(quota).fill(0.0),
            constants: fixed
              ? constants
                .split(",")
                .map((constant) => parseFloat(constant.trim()))
              : new Array(quota).fill(0.0),
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
            coefficients: percent
              ? coefficients
                .split(",")
                .map((coeff) => 1 - parseFloat(coeff.trim()) / 100)
              : new Array(quota).fill(0.0),
            constants: fixed
              ? constants
                .split(",")
                .map((constant) => parseFloat(constant.trim()))
              : new Array(quota).fill(0.0),
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
        setPercent={setPercent}
        setFixed={setFixed}
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
        percent={percent}
        setPercent={setPercent}
        fixed={fixed}
        setFixed={setFixed}
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

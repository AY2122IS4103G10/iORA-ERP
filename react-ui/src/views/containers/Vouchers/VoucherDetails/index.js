import { CodeIcon, TrashIcon } from "@heroicons/react/outline";
import {
  CalendarIcon as CalendarIconSolid,
  CheckCircleIcon,
} from "@heroicons/react/solid";
import moment from "moment";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { api } from "../../../../environments/Api";
import {
  deleteExistingVoucher,
  fetchVouchers,
  issueVoucher,
  redeemVoucher,
  selectVoucherByCode,
} from "../../../../stores/slices/voucherSlice";
import { classNames } from "../../../../utilities/Util";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete";
import { SimpleModal } from "../../../components/Modals/SimpleModal";

const VoucherDetailsBody = ({
  voucherCode,
  value,
  issued,
  expiry,
  redeemed,
  openModal,
  openIssueModal,
}) => (
  <div className="py-8 xl:py-10">
    <div className="max-w-3xl mx-auto xl:max-w-5xl">
      <NavigatePrev page="Vouchers" path="/sm/rewards-loyalty/vouchers" />
      <div className="px-4 sm:px-6 lg:px-8">
        <div>
          <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{`$${value} Voucher`}</h1>
              <p className="mt-2 text-sm text-gray-500">
                {!redeemed && "Not"} Redeemed
              </p>
            </div>
            <div className="mt-4 flex space-x-3 md:mt-0">
              <button
                type="button"
                className={classNames(
                  !issued ? "bg-white hover:bg-gray-50" : "bg-gray-200",
                  "inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                )}
                onClick={openIssueModal}
                disabled={issued}
              >
                <span>Issue</span>
              </button>
              {!issued && (
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={openModal}
                >
                  <TrashIcon
                    className="-ml-1 mr-2 h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
          <aside className="mt-8">
            <h2 className="sr-only">Details</h2>
            <div className="space-y-5">
              <div className="flex items-center space-x-2">
                <CodeIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span className="text-gray-900 text-sm font-medium">
                  {`Voucher Code: ${voucherCode}`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span className="text-gray-900 text-sm font-medium">
                  Issued: {issued ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIconSolid
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span className="text-gray-900 text-sm font-medium">
                  {`Expiry Date: ${moment(expiry).format("DD/MM/YYYY")}`}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
);

const IssueVoucherModal = ({
  open,
  closeModal,
  input,
  onInputChanged,
  onIssueClicked,
  inputTypeSelected,
  onInputTypeSelectedChanged,
  loading,
}) => {
  return (
    <SimpleModal open={open} closeModal={closeModal}>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
        {loading ? (
          <div className="flex items-center justify-center">
            <TailSpin color="#00BFFF" height={20} width={20} />
          </div>
        ) : (
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Issue Voucher
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Enter customer email address or contact number to issue voucher.
              </p>
            </div>
            <form
              className="mt-5 sm:flex sm:items-center"
              onSubmit={onIssueClicked}
            >
              <div className="w-full sm:max-w-xs">
                <label htmlFor="order-no" className="sr-only">
                  Customer Contact / Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type={inputTypeSelected === "email" ? "email" : "number"}
                    name="search"
                    id="search"
                    className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder={`Enter ${
                      inputTypeSelected === "email"
                        ? "email address"
                        : "contact number"
                    }.`}
                    value={input}
                    onChange={onInputChanged}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="type" className="sr-only">
                      Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      className="focus:ring-cyan-500 focus:border-cyan-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                      value={inputTypeSelected}
                      onChange={onInputTypeSelectedChanged}
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Issue
              </button>
            </form>
          </div>
        )}
      </div>
    </SimpleModal>
  );
};

export const VoucherDetails = () => {
  const { addToast } = useToasts();
  const { voucherCode } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const voucher = useSelector((state) =>
    selectVoucherByCode(state, voucherCode)
  );
  const [input, setInput] = useState("");
  const [inputTypeSelected, setInputTypeSelected] = useState("email");
  const [openDelete, setOpenDelete] = useState(false);
  const [openIssue, setOpenIssue] = useState(false);
  const [loading, setLoading] = useState(false);
  const voucherStatus = useSelector((state) => state.vouchers.status);
  useEffect(() => {
    voucherStatus === "idle" && dispatch(fetchVouchers());
  }, [voucherStatus, dispatch]);
  const onInputChanged = (e) => setInput(e.target.value);
  const onInputTypeSelectedChanged = (e) =>
    setInputTypeSelected(e.target.value);
  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);
  const openIssueModal = () => setOpenIssue(true);
  const closeIssueModal = () => setOpenIssue(false);

  const onIssueClicked = (evt) => {
    evt.preventDefault();
    if (!voucher.issued) {
      const fetchCustomer = async () => {
        const { data } = await api.get(
          `sam/customer/${inputTypeSelected}`,
          input
        );
        return data;
      };
      fetchCustomer()
        .then((data) => {
          setLoading(true);
          dispatch(issueVoucher({ code: voucherCode, id: data.id }))
            .unwrap()
            .then(() => {
              addToast("Successfully issued voucher", {
                appearance: "success",
                autoDismiss: true,
              });
              closeIssueModal();
            })
            .catch((err) => {
              addToast(`Error: ${err.message}`, {
                appearance: "error",
                autoDismiss: true,
              });
            })
            .finally(() => {
              setLoading(false);
            });
        })
        .catch(() =>
          addToast(`Error: Customer not found. Please try again`, {
            appearance: "error",
            autoDismiss: true,
          })
        );
    }
  };
  const onRedeemClicked = () => {
    if (!voucher.redeemed)
      dispatch(redeemVoucher(voucherCode))
        .unwrap()
        .then(() =>
          addToast("Successfully redeemed voucher", {
            appearance: "success",
            autoDismiss: true,
          })
        )
        .catch((err) =>
          addToast(`Error: ${err.message}`, {
            appearance: "error",
            autoDismiss: true,
          })
        );
  };

  const onDeleteVoucherClicked = () => {
    dispatch(deleteExistingVoucher(voucherCode))
      .unwrap()
      .then(() => {
        addToast("Successfully deleted voucher", {
          appearance: "success",
          autoDismiss: true,
        });
        navigate("/sm/vouchers");
      })
      .catch((err) =>
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        })
      );
  };

  return (
    Boolean(voucher) && (
      <>
        <VoucherDetailsBody
          voucherCode={voucher.voucherCode}
          value={voucher.amount}
          issued={voucher.issued}
          expiry={voucher.expiry}
          redeemed={voucher.redeemed}
          openModal={openModal}
          onIssueClicked={onIssueClicked}
          onRedeemClicked={onRedeemClicked}
          openIssueModal={openIssueModal}
        />
        <ConfirmDelete
          item={`$${voucher.amount} voucher?`}
          open={openDelete}
          closeModal={closeModal}
          onConfirm={onDeleteVoucherClicked}
        />
        <IssueVoucherModal
          input={input}
          onInputChanged={onInputChanged}
          inputTypeSelected={inputTypeSelected}
          onInputTypeSelectedChanged={onInputTypeSelectedChanged}
          onIssueClicked={onIssueClicked}
          open={openIssue}
          closeModal={closeIssueModal}
          loading={loading}
        />
      </>
    )
  );
};

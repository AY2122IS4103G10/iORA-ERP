import { CodeIcon, TrashIcon } from "@heroicons/react/outline";
import {
  CalendarIcon as CalendarIconSolid,
  CheckCircleIcon,
} from "@heroicons/react/solid";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
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

const VoucherDetailsBody = ({
  voucherCode,
  value,
  issued,
  expiry,
  redeemed,
  openModal,
  onIssueClicked,
  onRedeemClicked,
}) => (
  <div className="py-8 xl:py-10">
    <div className="max-w-3xl mx-auto xl:max-w-5xl">
      <NavigatePrev page="Vouchers" path="/sm/vouchers" />
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
                onClick={onIssueClicked}
                disabled={issued}
              >
                <span>Issue</span>
              </button>
              <button
                type="button"
                className={classNames(
                  !redeemed && issued ? "bg-white hover:bg-gray-50" : "bg-gray-200",
                  "inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                )}
                onClick={onRedeemClicked}
                disabled={redeemed || !issued}
              >
                <span>Redeem</span>
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

export const VoucherDetails = () => {
  const { addToast } = useToasts();
  const { voucherCode } = useParams();
  const voucher = useSelector((state) =>
    selectVoucherByCode(state, voucherCode)
  );
  const [openDelete, setOpenDelete] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const voucherStatus = useSelector((state) => state.vouchers.status);
  useEffect(() => {
    voucherStatus === "idle" && dispatch(fetchVouchers());
  }, [voucherStatus, dispatch]);

  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);

  const onIssueClicked = () => {
    if (!voucher.issued)
      dispatch(issueVoucher(voucherCode))
        .unwrap()
        .then(() =>
          addToast("Successfully issued voucher", {
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
        />
        <ConfirmDelete
          item={`$${voucher.amount} voucher?`}
          open={openDelete}
          closeModal={closeModal}
          onConfirm={onDeleteVoucherClicked}
        />
      </>
    )
  );
};

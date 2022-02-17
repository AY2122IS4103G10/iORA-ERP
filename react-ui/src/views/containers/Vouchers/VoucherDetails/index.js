import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CalendarIcon as CalendarIconSolid,
  CheckCircleIcon,
  PencilIcon,
} from "@heroicons/react/solid";
import moment from "moment";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  issueVoucher,
  selectVoucherByCode,
  voucherDeleted,
} from "../../../../stores/slices/voucherSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { useState } from "react";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete.js";
import { classNames } from "../../../../utilities/Util";
import axios from "axios";

const VoucherDetailsBody = ({
  voucherCode,
  value,
  issued,
  expiry,
  redeemed,
  openModal,
  onIssuedChanged,
  onRedeemedChanged,
}) => (
  <div className="py-8 xl:py-10">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3">
      <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
        <div>
          <div>
            <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{`$${value} Voucher`}</h1>
                <p className="mt-2 text-sm text-gray-500">{`${
                  !redeemed && "Not"
                } Redeemed`}</p>
              </div>
              <div className="mt-4 flex space-x-3 md:mt-0">
                <button
                  type="button"
                  className={classNames(
                    !issued && "hover:bg-gray-50",
                    "inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-700"
                  )}
                  onClick={onIssuedChanged}
                  disabled={issued}
                >
                  <PencilIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Issue</span>
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-700"
                  onClick={onRedeemedChanged}
                  disabled={redeemed}
                >
                  <PencilIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Redeem</span>
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={openModal}
                >
                  <TrashIcon
                    className="-ml-1 mr-2 h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                  <span>Delete</span>
                </button>
              </div>
            </div>
            <aside className="mt-8 xl:hidden">
              <h2 className="sr-only">Details</h2>
              <div className="space-y-5">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon
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
                    {`Expiry Date: ${moment(expiry).format(
                      "DD/MM/YYYY, h:mm a"
                    )}`}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <aside className="hidden xl:block xl:pl-8">
        <h2 className="sr-only">Details</h2>
      </aside>
    </div>
  </div>
);

export const VoucherDetails = () => {
  const { voucherCode } = useParams();
  const voucher = useSelector((state) =>
    selectVoucherByCode(state, voucherCode)
  );
  const [redeemed, setRedeemed] = useState(voucher.redeemed);
  const [openDelete, setOpenDelete] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);

  const onIssuedChanged = () => {
    if (!voucher.issued && requestStatus === "idle")
      // try {
      //   setRequestStatus("pending");
      //   dispatch(issueVoucher(voucher.voucherCode));
      //   alert("Successfully updated voucher");
      // } catch (err) {
      //   console.error("Failed to update voucher: ", err);
      // } finally {
      //   setRequestStatus("idle");
      // }
      axios
        .put(`http://localhost:8080/sam/voucher/${voucherCode}`, voucher)
        .then((response) => console.log(response.data));
  };
  const onRedeemedChanged = () => setRedeemed(!redeemed);

  const onDeleteVoucherClicked = () => {
    dispatch(voucherDeleted(voucher));
    navigate("/sm/vouchers");
  };

  const [requestStatus, setRequestStatus] = useState("idle");

  // const handleUpdateVoucher = (voucher) => {
  //   if (requestStatus === "idle")
  //     try {
  //       setRequestStatus("pending");
  //       dispatch(updateExistingVoucher(voucher)).unwrap();
  //       alert("Successfully updated voucher");
  //     } catch (err) {
  //       console.error("Failed to update voucher: ", err);
  //     } finally {
  //       setRequestStatus("idle");
  //     }
  // };

  return (
    <>
      <NavigatePrev page="Vouchers" path="/sm/vouchers" />
      <VoucherDetailsBody
        voucherCode={voucher.voucherCode}
        value={voucher.amount}
        issued={voucher.issued}
        expiry={voucher.expiry}
        redeemed={redeemed}
        openModal={openModal}
        onIssuedChanged={onIssuedChanged}
        onRedeemedChanged={onRedeemedChanged}
      />
      <ConfirmDelete
        item={`${voucher.amount} voucher?`}
        open={openDelete}
        closeModal={closeModal}
        onConfirm={onDeleteVoucherClicked}
      />
    </>
  );
};

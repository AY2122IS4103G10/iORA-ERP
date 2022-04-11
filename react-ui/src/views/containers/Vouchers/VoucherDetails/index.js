import { Dialog } from "@headlessui/react";
import { CodeIcon, TrashIcon } from "@heroicons/react/outline";
import {
  CalendarIcon as CalendarIconSolid, CashIcon, CheckCircleIcon, UserIcon
} from "@heroicons/react/solid";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import {
  selectAllCustomers
} from "../../../../stores/slices/customerSlice";
import {
  deleteExistingVoucher,
  fetchVouchers,
  issueVoucher,
  redeemVoucher,
  selectVoucherByCode
} from "../../../../stores/slices/voucherSlice";
import { classNames } from "../../../../utilities/Util";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import {
  SelectColumnFilter
} from "../../../components/Tables/ClickableRowTable";
import { SimpleTable } from "../../../components/Tables/SimpleTable";

const VoucherDetailsBody = ({
  voucherCode,
  value,
  issued,
  expiry,
  redeemed,
  campaign,
  customerId,
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
              <div className="flex items-center space-x-2">
                <CashIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span className="text-gray-900 text-sm font-medium">
                  {`Campaign: ${campaign}`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <UserIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span className="text-gray-900 text-sm font-medium">
                  {Boolean(customerId) ?
                    `Belonging to customer Id: ${customerId}` : `Voucher is not tied to a customer.`
                  }
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
);

const IssueCustomersModal = ({
  open,
  setOpen,
  data,
  selectedRows,
  setSelectedRows,
  onIssueClicked,
  loading,
}) => {
  const itemCols = useMemo(() => {
    return [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: (row) => `${row.firstName} ${row.lastName}`,
      },
      {
        Header: "DOB",
        accessor: "dob",
        Cell: (e) => moment(e.value).format("DD/MM/YY"),
      },
      {
        Header: "Contact",
        accessor: "contactNumber",
      },
      {
        Header: "Member Points",
        accessor: "membershipPoints",
      },
      {
        Header: "Member Tier",
        accessor: "membershipTier.name",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Status",
        accessor: "availStatus",
        Cell: (e) => (e.value ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Blocked
          </span>
        ))
      },
      {
        Header: "Email",
        accessor: "email",
      },
    ];
  }, []);

  return (
    <SimpleModal open={open} closeModal={() => setOpen(false)}>
      <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-max">
        {loading ? (
          <div className="flex items-center justify-center">
            <TailSpin color="#00BFFF" height={20} width={20} />
          </div>
        ) : (
          <>
            <div>
              <div className="flex justify-between border-b border-gray-200">
                <Dialog.Title
                  as="h3"
                  className="m-3 text-center text-lg leading-6 font-medium text-gray-900"
                >
                  Select Customers
                </Dialog.Title>
              </div>
              <div className="border-b border-gray-200 m-5">
                <SimpleTable
                  columns={itemCols}
                  data={data}
                  rowSelect={true}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  />

                  <p className="italic">Note: If more than 1 customer is selected, other vouchers of the same type will be issued.</p>
              </div>
            </div>
            <div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  onClick={onIssueClicked}
                >
                  Issue
                </button>
              </div>
            </div>
          </>)}
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
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openIssue, setOpenIssue] = useState(false);
  const [loading, setLoading] = useState(false);
  const data = useSelector(selectAllCustomers)
  const voucherStatus = useSelector((state) => state.vouchers.status);
  useEffect(() => {
    voucherStatus === "idle" && dispatch(fetchVouchers());
  }, [voucherStatus, dispatch]);

  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);
  const openIssueModal = () => setOpenIssue(true);

  const onIssueClicked = (evt) => {
    evt.preventDefault();
    setLoading(true);
    const selectedRowKeys = Object.keys(selectedRows).map((key) =>
      parseInt(key) + 1
    );

    if (!voucher.issued) {
      dispatch(issueVoucher({ voucherCode, customerIds : selectedRowKeys}))
        .unwrap()
        .then(() => {
          addToast("Successfully issued voucher", {
            appearance: "success",
            autoDismiss: true,
          });
          setOpenIssue(false);
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
          campaign={voucher.campaign}
          customerId={voucher.customerId}
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
        <IssueCustomersModal
          open={openIssue}
          setOpen={setOpenIssue}
          data={data}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onIssueClicked={onIssueClicked}
          loading={loading}
        />
      </>
    )
  );
};

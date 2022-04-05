import { Dialog } from "@headlessui/react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import {
  fetchCustomers,
  selectAllCustomers
} from "../../../../stores/slices/customerSlice";
import { addNewVouchers } from "../../../../stores/slices/voucherSlice";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import {
  SelectColumnFilter
} from "../../../components/Tables/ClickableRowTable";
import { SimpleTable } from "../../../components/Tables/SimpleTable";


const VoucherFormBody = ({
  campaign,
  onCampaignChanged,
  quantity,
  onQuanitity,
  value,
  onValueChanged,
  expDate,
  onExpDateChanged,
  onAddVoucherClicked,
  onCancelClicked,
  setOpen,
  loading
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">Add New Voucher</h1>
    {/* Left column */}
    <div className="grid grid-cols-1 gap-4 lg:col-span-2">
      {/* Form */}
      <section aria-labelledby="profile-overview-title">
        <div className="rounded-lg bg-white overflow-hidden shadow">
          <form onSubmit={onAddVoucherClicked}>
            <div className="p-8 space-y-8 divide-y divide-gray-200">
              <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New Vouchers
                    </h3>
                  </div>
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <SimpleInputGroup
                      label="Campaign (if any)"
                      inputField="campaign"
                      className="relative rounded-md sm:mt-0 sm:col-span-2"
                    >
                      <SimpleInputBox
                        type="text"
                        name="campaign"
                        id="campaign"
                        autoComplete="name"
                        value={campaign}
                        onChange={onCampaignChanged}
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Value"
                      inputField="value"
                      className="relative rounded-md sm:mt-0 sm:col-span-2"
                    >
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="value"
                        id="value"
                        autoComplete="value"
                        className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0"
                        value={value}
                        onChange={onValueChanged}
                        required
                        aria-describedby="value-currency"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span
                          className="text-gray-500 sm:text-sm"
                          id="value-currency"
                        >
                          SGD
                        </span>
                      </div>
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Expiry Date"
                      inputField="expDate"
                      className="sm:mt-0 sm:col-span-2"
                    >
                      <DatePicker
                        className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        selected={expDate}
                        onChange={onExpDateChanged}
                        dateFormat="dd/MM/yyyy"
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Quanitity"
                      inputField="quantity"
                      className="sm:mt-0 sm:col-span-2"
                    >
                      <SimpleInputBox
                        type="number"
                        name="code"
                        id="code"
                        autoComplete="code"
                        value={quantity}
                        onChange={onQuanitity}
                        required
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Customer Inclusion List"
                      inputField="customers"
                      className="sm:mt-0 sm:col-span-2"
                    >
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-black shadow-sm text-sm font-medium rounded-md text-black hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                        onClick={() => setOpen(true)}
                      >
                        Add Customers
                      </button>
                      <p className="pt-2 italic text-sm text-gray-600">* if quantity is more than the number of customers, the extra vouchers will remain unissued</p>
                    </SimpleInputGroup>
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
                  {loading ? (<button
                    type="button"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    disabled
                  >
                    <TailSpin color="#00BCD4" height={20} width={20} />
                  </button>
                  ) : (
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                      Add vouchers
                    </button>)}

                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
);

const AddCustomersModal = ({
  open,
  setOpen,
  data,
  selectedRows,
  setSelectedRows,
  onAddClicked,
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
              onClick={onAddClicked}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </SimpleModal>
  );
};

export const VoucherForm = () => {
  const { addToast } = useToasts();
  const [campaign, setCampaign] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [value, setValue] = useState("");
  const [expDate, setExpDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const data = useSelector(selectAllCustomers);
  const customerStatus = useSelector((state) => state.customers.status);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onCampaignChanged = (e) => setCampaign(e.target.value);
  const onQuanitity = (e) => setQuantity(e.target.value);
  const onValueChanged = (e) => setValue(e.target.value);
  const onExpDateChanged = (date) => setExpDate(date);

  const [requestStatus, setRequestStatus] = useState("idle");
  const canAdd =
    [quantity, value, expDate].every(Boolean) && requestStatus === "idle";

  useEffect(() => {
    customerStatus === "idle" && dispatch(fetchCustomers());
  }, [customerStatus, dispatch]);

  const onAddVoucherClicked = (evt) => {
    evt.preventDefault();
    setLoading(true);
    if (canAdd) setRequestStatus("pending");
    dispatch(
      addNewVouchers({
        initialVoucher: {
          campaign,
          amount: value,
          expiry: expDate,
          customerIds: selectedCustomer.map((value) => value.id)
        }, quantity
      })
    )
      .unwrap()
      .then(() => {
        addToast("Successfully added vouchers", {
          appearance: "success",
          autoDismiss: true,
        });
        navigate("/sm/rewards-loyalty/vouchers");
      })
      .catch((err) =>
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        })
      )
      .finally(() => setLoading(false));
  };

  const onCancelClicked = () => navigate(-1);

  const onAddClicked = (e) => {
    e.preventDefault();
    const selectedRowKeys = Object.keys(selectedRows).map((key) =>
      parseInt(key)
    );
    const customers = [];
    selectedRowKeys.map((key) => customers.push(data[key]));
    setSelectedCustomer([...customers]);
    console.log(selectedCustomer)
    setOpen(false);
  };

  return (
    <>
      <VoucherFormBody
        campaign={campaign}
        onCampaignChanged={onCampaignChanged}
        quantity={quantity}
        onQuanitity={onQuanitity}
        value={value}
        onValueChanged={onValueChanged}
        expDate={expDate}
        onExpDateChanged={onExpDateChanged}
        onAddVoucherClicked={onAddVoucherClicked}
        onCancelClicked={onCancelClicked}
        setOpen={setOpen}
        loading={loading}
      />
      <AddCustomersModal
        open={open}
        setOpen={setOpen}
        data={data}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        onAddClicked={onAddClicked}
      />
    </>
  );
};

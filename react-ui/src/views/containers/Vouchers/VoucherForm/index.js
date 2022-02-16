import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import {
  addNewVouchers,
  selectVoucherById,
  voucherAdded,
} from "../../../../stores/slices/voucherSlice";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";

import "react-datepicker/dist/react-datepicker.css";

const VoucherFormBody = ({
  isEditing,
  quanitity,
  onQuanitity,
  value,
  onValueChanged,
  expDate,
  onExpDateChanged,
  onAddVoucherClicked,
  onCancelClicked,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">{!isEditing ? "Add" : "Edit"} New Voucher</h1>
    {/* Main 3 column grid */}
    <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
      {/* Left column */}
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
                        {!isEditing ? "Add New" : "Edit"} Vouchers
                      </h3>
                    </div>
                    <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
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
                        />
                      </SimpleInputGroup>
                      <SimpleInputGroup
                        label="Quanitity"
                        inputField="quanitity"
                        className="sm:mt-0 sm:col-span-2"
                      >
                        <SimpleInputBox
                          type="number"
                          name="code"
                          id="code"
                          autoComplete="code"
                          value={quanitity}
                          onChange={onQuanitity}
                          required
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
                      onClick={onCancelClicked}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                      onClick={onAddVoucherClicked}
                    >
                      {!isEditing ? "Add" : "Save"} vouchers
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export const VoucherForm = () => {
  const { voucherId } = useParams();
  const voucher = useSelector((state) =>
    selectVoucherById(state, parseInt(voucherId))
  );
  const isEditing = Boolean(voucher);
  const [quanitity, setQuantity] = useState(!isEditing ? 1 : voucher.code);
  const [value, setValue] = useState(!isEditing ? "" : voucher.value);
  const [expDate, setExpDate] = useState(
    !isEditing ? new Date() : new Date(voucher.expDate)
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onQuanitity = (e) => setQuantity(e.target.value);
  const onValueChanged = (e) => setValue(e.target.value);
  const onExpDateChanged = (date) => setExpDate(date);

  const [requestStatus, setRequestStatus] = useState("idle");
  const canAdd =
    [quanitity, value, expDate].every(Boolean) && requestStatus === "idle";
  const onAddVoucherClicked = (evt) => {
    evt.preventDefault();
    if (canAdd)
      try {
        setRequestStatus("pending");
        dispatch(addNewVouchers({ quanitity, value, expDate })).unwrap();
        setQuantity("");
        setValue("");
        navigate(!isEditing ? "/sm/vouchers" : `/sm/vouchers/${voucherId}`);
      } catch (err) {
        console.error("Failed to add product: ", err);
      } finally {
        setRequestStatus("idle");
      }
  };

  const onCancelClicked = () =>
    navigate(!isEditing ? "/sm/vouchers" : `/sm/vouchers/${voucherId}`);

  return (
    <VoucherFormBody
      isEditing={isEditing}
      quanitity={quanitity}
      onQuanitity={onQuanitity}
      value={value}
      onValueChanged={onValueChanged}
      expDate={expDate}
      onExpDateChanged={onExpDateChanged}
      onAddVoucherClicked={onAddVoucherClicked}
      onCancelClicked={onCancelClicked}
    />
  );
};

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  selectVoucherById,
  voucherAdded,
} from "../../../../stores/slices/voucherSlice";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";

const VoucherFormBody = ({
  isEditing,
  voucherCode,
  onVoucherCodeChanged,
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
                        {!isEditing ? "Add New" : "Edit"} Voucher
                      </h3>
                    </div>
                    <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                      <SimpleInputGroup
                        label="Voucher Code"
                        inputField="voucherCode"
                        className="sm:mt-0 sm:col-span-2"
                      >
                        <SimpleInputBox
                          type="text"
                          name="code"
                          id="code"
                          autoComplete="code"
                          value={voucherCode}
                          onChange={onVoucherCodeChanged}
                          required
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
                        <div className="relative">
                          {/* {new Datepicker(datepickerEl, {})} */}
                          {/* <DatePicker
                            selected={expDate}
                            onChange={onExpDateChanged}
                          /> */}
                          <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Select date"
                            value={expDate}
                            onChange={onExpDateChanged}
                            required
                          />
                        </div>
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
                      {!isEditing ? "Add" : "Save"} voucher
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
  const [voucherCode, setVoucherCode] = useState(!isEditing ? "" : voucher.code);
  const [value, setValue] = useState(!isEditing ? "" : voucher.value);
  const [expDate, setExpDate] = useState(
    !isEditing ? new Date() : new Date(voucher.expDate)
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onVoucherCodeChanged = (e) => setVoucherCode(e.target.value);
  const onValueChanged = (e) => setValue(e.target.value);
  const onExpDateChanged = (date) => setExpDate(date);

  const onAddVoucherClicked = (evt) => {
    evt.preventDefault();
    canAdd && dispatch(voucherAdded(voucherCode, value, expDate));
    setVoucherCode("");
    setValue("");
    navigate(!isEditing ? "/vouchers" : `/vouchers/${voucherId}`);
  };

  const canAdd = voucherCode && value && expDate;

  const onCancelClicked = () =>
    navigate(!isEditing ? "/vouchers" : `/vouchers/${voucherId}`);

  return (
    <VoucherFormBody
      isEditing={isEditing}
      voucherCode={voucherCode}
      onVoucherCodeChanged={onVoucherCodeChanged}
      value={value}
      onValueChanged={onValueChanged}
      expDate={expDate}
      onExpDateChanged={onExpDateChanged}
      onAddVoucherClicked={onAddVoucherClicked}
      onCancelClicked={onCancelClicked}
    />
  );
};

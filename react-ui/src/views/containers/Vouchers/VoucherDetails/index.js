import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CalendarIcon as CalendarIconSolid,
  PencilIcon,
} from "@heroicons/react/solid";
import moment from "moment";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  selectVoucherById,
  voucherDeleted,
} from "../../../../stores/slices/voucherSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";

const VoucherDetailsBody = ({
  voucherId,
  voucherCode,
  value,
  issuedDate,
  expDate,
  isRedeemed,
  onDeleteVoucherClicked,
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
                  !isRedeemed && "Not"
                } Redeemed`}</p>
              </div>
              <div className="mt-4 flex space-x-3 md:mt-0">
                <Link to={`/sm/vouchers/edit/${voucherId}`}>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-700"
                  >
                    <PencilIcon
                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span>Edit</span>
                  </button>
                </Link>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-700"
                  onClick={onDeleteVoucherClicked}
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
                  <CalendarIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="text-gray-900 text-sm font-medium">
                    {`Issued Date: ${moment(issuedDate).format(
                      "DD/MM/YYYY, h:mm a"
                    )}`}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIconSolid
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="text-gray-900 text-sm font-medium">
                    {`Expiry Date: ${moment(expDate).format(
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
  const { voucherId } = useParams();
  const voucher = useSelector((state) =>
    selectVoucherById(state, parseInt(voucherId))
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onDeleteVoucherClicked = () => {
    dispatch(voucherDeleted(voucher));
    navigate("/sm/vouchers");
  };

  return (
    <>
      <NavigatePrev page="Vouchers" path="/sm/vouchers" />
      <VoucherDetailsBody
        voucherId={voucherId}
        voucherCode={voucher.code}
        value={voucher.value}
        issuedDate={voucher.issuedDate}
        expDate={voucher.expDate}
        isRedeemed={voucher.isRedeemed}
        onDeleteVoucherClicked={onDeleteVoucherClicked}
      />
    </>
  );
};

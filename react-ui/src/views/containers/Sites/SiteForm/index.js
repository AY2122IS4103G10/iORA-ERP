import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addNewVouchers } from "../../../../stores/slices/voucherSlice";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";

import "react-datepicker/dist/react-datepicker.css";
import { api } from "../../../../environments/Api";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";

const siteTypes = [
  { id: 1, name: "Headquarters", value: "Headquarters" },
  { id: 2, name: "Manufacturing", value: "Manufacturing" },
  { id: 3, name: "Online Store", value: "Online Store" },
  { id: 4, name: "Store", value: "Store" },
  { id: 5, name: "Warehouse", value: "Warehouse" },
];

const SiteFormBody = ({
  isEditing,
  name,
  onNameChanged,
  address,
  onAddressChanged,
  siteCode,
  onSiteCodeChanged,
  onAddSiteClicked,
  onCancelClicked,
  siteTypeSelected,
  setSiteTypeSelected,
  siteTypes,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">{!isEditing ? "Add" : "Edit"} New Site</h1>
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
                        {!isEditing ? "Add New" : "Edit"} Site
                      </h3>
                    </div>
                    <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                      <SimpleInputGroup
                        label="Name"
                        inputField="name"
                        className="relative rounded-md sm:mt-0 sm:col-span-2"
                      >
                        <SimpleInputBox
                          type="text"
                          name="name"
                          id="name"
                          autoComplete="name"
                          value={name}
                          onChange={onNameChanged}
                          required
                        />
                      </SimpleInputGroup>
                      <SimpleInputGroup
                        label="Site Code"
                        inputField="siteCode"
                        className="relative rounded-md sm:mt-0 sm:col-span-2"
                      >
                        <SimpleInputBox
                          type="text"
                          name="siteCode"
                          id="siteCode"
                          autoComplete="siteCode"
                          value={siteCode}
                          onChange={onSiteCodeChanged}
                          required
                        />
                      </SimpleInputGroup>
                      <SimpleInputGroup
                        label="Site Type"
                        inputField="siteCode"
                        className="relative rounded-md sm:mt-0 sm:col-span-2"
                      >
                        <SimpleSelectMenu
                          options={siteTypes}
                          selected={siteTypeSelected}
                          setSelected={setSiteTypeSelected}
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
                      onClick={onAddSiteClicked}
                    >
                      {!isEditing ? "Add" : "Save"} site
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

export const SiteForm = () => {
  const { siteId } = useParams();
  const [name, setName] = useState("");
  const [address, setAddress] = useState(null);
  const [siteCode, setSideCode] = useState("");
  const [active, setActive] = useState(false);
  const [stockLevel, setStockLevel] = useState(null);
  const [company, setCompany] = useState(null);
  const [procurementOrders, setProcurementOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [siteTypeSelected, setSiteTypeSelected] = useState(siteTypes[1]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onNameChanged = (e) => setName(e.target.address);
  const onAddressChanged = (e) => setAddress(e.target.address);
  const onSiteCodeChanged = (date) => setSideCode(date);

  const [requestStatus, setRequestStatus] = useState("idle");
  const canAdd =
    [name, address, siteCode].every(Boolean) && requestStatus === "idle";
  const onAddSiteClicked = (evt) => {
    evt.preventDefault();
    if (canAdd)
      try {
        setRequestStatus("pending");
        dispatch(
          addNewVouchers({ name, amount: address, expiry: siteCode })
        ).unwrap();
        alert("Successfully added site");
        setName("");
        setAddress("");
        navigate(!isEditing ? "/ad/sites" : `/ad/sites/${siteId}`);
      } catch (err) {
        console.error("Failed to add site: ", err);
      } finally {
        setRequestStatus("idle");
      }
  };

  const onCancelClicked = () =>
    navigate(!isEditing ? "/ad/sites" : `/ad/sites/${siteId}`);

  useEffect(() => {
    Boolean(siteId) &&
      api.get("admin/viewSite", siteId).then((response) => {
        const {
          name,
          address,
          siteCode,
          active,
          stockLevel,
          company,
          procurementOrders,
        } = response.data;
        setIsEditing(true);
        setName(name);
        setAddress(address);
        setSideCode(siteCode);
        setActive(active);
        setStockLevel(stockLevel);
        setCompany(company);
        setProcurementOrders(procurementOrders);
      });
  }, [siteId]);

  return (
    <SiteFormBody
      isEditing={isEditing}
      name={name}
      onNameChanged={onNameChanged}
      address={address}
      onAddressChanged={onAddressChanged}
      siteCode={siteCode}
      onSiteCodeChanged={onSiteCodeChanged}
      onAddSiteClicked={onAddSiteClicked}
      onCancelClicked={onCancelClicked}
      siteTypeSelected={siteTypeSelected}
      setSiteTypeSelected={setSiteTypeSelected}
      siteTypes={siteTypes}
    />
  );
};

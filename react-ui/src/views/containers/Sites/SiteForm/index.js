import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";

import { api } from "../../../../environments/Api";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import { addNewSites } from "../../../../stores/slices/siteSlice";

const siteTypes = [
  { id: 1, name: "Headquarters" },
  { id: 2, name: "Manufacturing" },
  { id: 3, name: "Online Store" },
  { id: 4, name: "Store" },
  { id: 5, name: "Warehouse" },
];

const companies = [{ id: 1, name: "iORA Fashion Pte. Ltd." }];

const AddressField = ({
  address1,
  onAddress1Changed,
  building,
  onBuildingChanged,
  unit,
  onUnitChanged,
  country,
  onCountryChanged,
  city,
  onCityChanged,
  state,
  onStateChanged,
  postalCode,
  onPostalCodeChanged,
  latitude,
  onLatitudeChanged,
  longitude,
  onLongitudeChanged,
}) => {
  return (
    <SimpleInputGroup
      label="Address"
      inputField="address"
      className="relative rounded-md sm:mt-0 sm:col-span-2"
    >
      <div className="py-2">
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="address"
            id="address"
            className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
            autoComplete="address"
            value={address1}
            onChange={onAddress1Changed}
            required
          />
        </div>
      </div>
      <div className="py-2 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Building
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="address"
              id="address"
              className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
              autoComplete="address"
              value={building}
              onChange={onBuildingChanged}
              required
            />
          </div>
        </div>
        <div className="sm:col-span-3">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Unit
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="address"
              id="address"
              className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
              autoComplete="address"
              value={unit}
              onChange={onUnitChanged}
              required
            />
          </div>
        </div>
      </div>
      <div className="py-2 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="address"
              id="address"
              className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
              autoComplete="address"
              value={country}
              onChange={onCountryChanged}
              required
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="address"
              id="address"
              className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
              autoComplete="address"
              value={city}
              onChange={onCityChanged}
              required
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            State / Province
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="address"
              id="address"
              className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
              autoComplete="address"
              value={state}
              onChange={onStateChanged}
              required
            />
          </div>
        </div>
      </div>
      <div className="py-2">
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          ZIP / Postal code
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="address"
            id="address"
            className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
            autoComplete="address"
            value={postalCode}
            onChange={onPostalCodeChanged}
            required
          />
        </div>
      </div>
      <div className="py-2 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Latitude
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="address"
              id="address"
              className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
              autoComplete="address"
              value={latitude}
              onChange={onLatitudeChanged}
              required
            />
          </div>
        </div>
        <div className="sm:col-span-3">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Longitude
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="address"
              id="address"
              className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
              autoComplete="address"
              value={longitude}
              onChange={onLongitudeChanged}
              required
            />
          </div>
        </div>
      </div>
    </SimpleInputGroup>
  );
};

const SiteFormBody = ({
  isEditing,
  name,
  onNameChanged,
  siteCode,
  onSiteCodeChanged,
  phone,
  onPhoneChanged,
  address1,
  onAddress1Changed,
  onBuildingChanged,
  building,
  unit,
  onUnitChanged,
  country,
  onCountryChanged,
  city,
  onCityChanged,
  state,
  onStateChanged,
  postalCode,
  onPostalCodeChanged,
  latitude,
  onLatitudeChanged,
  longitude,
  onLongitudeChanged,
  onAddSiteClicked,
  onCancelClicked,
  siteTypeSelected,
  setSiteTypeSelected,
  siteTypes,
  companySelected,
  setCompanySelected,
  companies,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">{!isEditing ? "Add" : "Edit"} New Site</h1>
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
                        value={siteCode}
                        onChange={onSiteCodeChanged}
                        required
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Phone"
                      inputField="phone"
                      className="relative rounded-md sm:mt-0 sm:col-span-2"
                    >
                      <SimpleInputBox
                        type="text"
                        name="phone"
                        id="phone"
                        placeholder="+65-"
                        value={phone}
                        onChange={onPhoneChanged}
                        required
                      />
                    </SimpleInputGroup>
                    <AddressField
                      address1={address1}
                      onAddress1Changed={onAddress1Changed}
                      building={building}
                      onBuildingChanged={onBuildingChanged}
                      unit={unit}
                      onUnitChanged={onUnitChanged}
                      country={country}
                      onCountryChanged={onCountryChanged}
                      city={city}
                      onCityChanged={onCityChanged}
                      state={state}
                      onStateChanged={onStateChanged}
                      postalCode={postalCode}
                      onPostalCodeChanged={onPostalCodeChanged}
                      latitude={latitude}
                      onLatitudeChanged={onLatitudeChanged}
                      longitude={longitude}
                      onLongitudeChanged={onLongitudeChanged}
                    />
                    <SimpleInputGroup
                      label="Company"
                      inputField="company"
                      className="relative rounded-md sm:mt-0 sm:col-span-2"
                    >
                      <SimpleSelectMenu
                        options={companies}
                        selected={companySelected}
                        setSelected={setCompanySelected}
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
);

export const SiteForm = () => {
  const { siteId } = useParams();
  const [name, setName] = useState("");
  const [address1, setAddress1] = useState("");
  const [building, setBuilding] = useState("");
  const [unit, setUnit] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [siteCode, setSideCode] = useState("");
  const [phone, setPhone] = useState("");
  const [active, setActive] = useState(false);
  const [company, setCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [siteTypeSelected, setSiteTypeSelected] = useState(siteTypes[0]);
  const [companySelected, setCompanySelected] = useState(companies[0]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onNameChanged = (e) => setName(e.target.value);
  const onSiteCodeChanged = (e) => setSideCode(e.target.value);
  const onPhoneChanged = (e) => setPhone(e.target.value);
  const onAddress1Changed = (e) => setAddress1(e.target.value);
  const onBuildingChanged = (e) => setBuilding(e.target.value);
  const onUnitChanged = (e) => setUnit(e.target.value);
  const onCountryChanged = (e) => setCountry(e.target.address);
  const onCityChanged = (e) => setCity(e.target.value);
  const onStateChanged = (e) => setState(e.target.value);
  const onPostalCodeChanged = (e) => setPostalCode(e.target.value);
  const onLatitudeChanged = (e) => setLatitude(e.target.value);
  const onLongitudeChanged = (e) => setLongitude(e.target.value);

  const [requestStatus, setRequestStatus] = useState("idle");
  const canAdd =
    [
      name,
      country,
      city,
      building,
      state,
      unit,
      address1,
      postalCode,
      latitude,
      longitude,
      siteCode,
      phone,
    ].every(Boolean) && requestStatus === "idle";
  const onAddSiteClicked = (evt) => {
    evt.preventDefault();
    if (canAdd)
      try {
        setRequestStatus("pending");
        dispatch(
          addNewSites(siteTypeSelected.name, {
            name,
            address: {
              country,
              city,
              building,
              state,
              unit,
              road: address1,
              postalCode,
              billing: false,
              latitude,
              longitude,
              coordinates: `(${latitude}, ${longitude})`,
            },
            siteCode,
            phoneNumber: phone,
            active: true,
            company: {
              id: companySelected.id,
              name: companySelected.name,
            },
          })
        ).unwrap();
        alert("Successfully added site");
        setName("");
        setAddress1("");
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
        const { name, address, siteCode, active, phone, company } =
          response.data;
        setIsEditing(true);
        setName(name);
        setSideCode(siteCode);
        setActive(active);
        setPhone(phone);
        setCompany(company);
      });
  }, [siteId]);

  return (
    <SiteFormBody
      isEditing={isEditing}
      name={name}
      onNameChanged={onNameChanged}
      siteCode={siteCode}
      onSiteCodeChanged={onSiteCodeChanged}
      phone={phone}
      onPhoneChanged={onPhoneChanged}
      address1={address1}
      onAddress1Changed={onAddress1Changed}
      building={building}
      onBuildingChanged={onBuildingChanged}
      unit={unit}
      onUnitChanged={onUnitChanged}
      country={country}
      onCountryChanged={onCountryChanged}
      city={city}
      onCityChanged={onCityChanged}
      state={state}
      onStateChanged={onStateChanged}
      postalCode={postalCode}
      onPostalCodeChanged={onPostalCodeChanged}
      latitude={latitude}
      onLatitudeChanged={onLatitudeChanged}
      longitude={longitude}
      onLongitudeChanged={onLongitudeChanged}
      onAddSiteClicked={onAddSiteClicked}
      onCancelClicked={onCancelClicked}
      siteTypeSelected={siteTypeSelected}
      setSiteTypeSelected={setSiteTypeSelected}
      siteTypes={siteTypes}
      companySelected={companySelected}
      setCompanySelected={setCompanySelected}
      companies={companies}
    />
  );
};

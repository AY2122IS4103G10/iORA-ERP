import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";

import { api } from "../../../../environments/Api";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import { addNewSite } from "../../../../stores/slices/siteSlice";
import { AddressField } from "../../Sites/SiteForm";

const siteTypes = [
  { id: 1, name: "Headquarters" },
  { id: 2, name: "Manufacturing" },
  { id: 3, name: "Online Store" },
  { id: 4, name: "Store" },
  { id: 5, name: "Warehouse" },
];

const companies = [{ id: 1, name: "iORA Fashion Pte. Ltd." }];

const CompanyFormBody = ({
  isEditing,
  name,
  onNameChanged,
  registerNo,
  onRegisterNoChanged,
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
    <h1 className="sr-only">{!isEditing ? "Add" : "Edit"} New Company</h1>
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
                      {!isEditing ? "Add New" : "Edit"} Company
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
                      label="Register No."
                      inputField="registerNo"
                      className="relative rounded-md sm:mt-0 sm:col-span-2"
                    >
                      <SimpleInputBox
                        type="text"
                        name="registerNo"
                        id="registerNo"
                        value={registerNo}
                        onChange={onRegisterNoChanged}
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
                    {!isEditing ? "Add" : "Save"} company
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

export const CompanyForm = () => {
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
  const [registerNo, setRegisterNo] = useState("");
  const [phone, setPhone] = useState("");
  const [active, setActive] = useState(false);
  const [company, setCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [siteTypeSelected, setSiteTypeSelected] = useState(siteTypes[0]);
  const [companySelected, setCompanySelected] = useState(companies[0]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onNameChanged = (e) => setName(e.target.value);
  const onRegisterNoChanged = (e) => setRegisterNo(e.target.value);
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
      registerNo,
      phone,
    ].every(Boolean) && requestStatus === "idle";
  const onAddSiteClicked = (evt) => {
    evt.preventDefault();
    if (canAdd)
      try {
        setRequestStatus("pending");
        dispatch(
          addNewSite(siteTypeSelected.name, {
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
            },
            registerNo,
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
        const { name, address, registerNo, active, phone, company } =
          response.data;
        setIsEditing(true);
        setName(name);
        setRegisterNo(registerNo);
        setActive(active);
        setPhone(phone);
        setCompany(company);
      });
  }, [siteId]);

  return (
    <CompanyFormBody
      isEditing={isEditing}
      name={name}
      onNameChanged={onNameChanged}
      registerNo={registerNo}
      onRegisterNoChanged={onRegisterNoChanged}
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

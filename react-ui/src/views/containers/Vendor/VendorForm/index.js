import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";

import { api } from "../../../../environments/Api";
import {
  addNewVendor,
  updateExistingVendor,
} from "../../../../stores/slices/vendorSlice";
import { AddressField, fetchCountries } from "../../Sites/SiteForm";

const VendorFormBody = ({
  isEditing,
  companyName,
  onCompanyNameChanged,
  description,
  onDescriptionChanged,
  telephone,
  onTelephoneChanged,
  email,
  onEmailChanged,
  address1,
  onAddress1Changed,
  onBuildingChanged,
  building,
  unit,
  onUnitChanged,
  country,
  onCountryChanged,
  countries,
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
  billing,
  onBillingChanged,
  onAddVendorClicked,
  onCancelClicked,
}) => {
  return (
    <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="sr-only">{!isEditing ? "Add New" : "Edit"} Vendor</h1>
      <div className="grid grid-cols-1 gap-4 lg:col-span-2">
        {/* Form */}
        <section aria-labelledby="profile-overview-title">
          <div className="rounded-lg bg-white overflow-hidden shadow">
            <form onSubmit={onAddVendorClicked}>
              <div className="p-8 space-y-8 divide-y divide-gray-200">
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                  <div>
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {!isEditing ? "Add New" : "Edit"} Vendor
                      </h3>
                    </div>
                    <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                      <SimpleInputGroup
                        label="Company Name"
                        inputField="companyName"
                        className="relative rounded-md sm:mt-0 sm:col-span-2"
                      >
                        <SimpleInputBox
                          type="text"
                          name="companyName"
                          id="companyName"
                          autoComplete="name"
                          value={companyName}
                          onChange={onCompanyNameChanged}
                          required
                        />
                      </SimpleInputGroup>
                      <SimpleInputGroup
                        label="Description"
                        inputField="description"
                        className="relative rounded-md sm:mt-0 sm:col-span-2"
                      >
                        <SimpleInputBox
                          type="text"
                          name="description"
                          id="description"
                          value={description}
                          onChange={onDescriptionChanged}
                          required
                        />
                      </SimpleInputGroup>
                      <SimpleInputGroup
                        label="Email"
                        inputField="email"
                        className="relative rounded-md sm:mt-0 sm:col-span-2"
                      >
                        <SimpleInputBox
                          type="email"
                          name="email"
                          id="email"
                          value={email}
                          onChange={onEmailChanged}
                          required
                        />
                      </SimpleInputGroup>
                      <SimpleInputGroup
                        label="Telephone"
                        inputField="telephone"
                        className="relative rounded-md sm:mt-0 sm:col-span-2"
                      >
                        <SimpleInputBox
                          type="text"
                          name="telephone"
                          id="telephone"
                          placeholder="+65-"
                          value={telephone}
                          onChange={onTelephoneChanged}
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
                        countries={countries}
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
                        billing={billing}
                        onBillingChanged={onBillingChanged}
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
                    >
                      {!isEditing ? "Add" : "Save"} vendor
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
};

export const VendorForm = () => {
  const { vendorId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address1, setAddress1] = useState("");
  const [building, setBuilding] = useState("");
  const [unit, setUnit] = useState("");
  const [country, setCountry] = useState("Singapore");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [billing, setBilling] = useState(true);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchCountries().then((data) => setCountries(data));
  }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();

  const onCompanyNameChanged = (e) => setCompanyName(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);
  const onTelephoneChanged = (e) => setTelephone(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onAddress1Changed = (e) => setAddress1(e.target.value);
  const onBuildingChanged = (e) => setBuilding(e.target.value);
  const onUnitChanged = (e) => setUnit(e.target.value);
  const onCountryChanged = (e) => setCountry(e.target.value);
  const onCityChanged = (e) => setCity(e.target.value);
  const onStateChanged = (e) => setState(e.target.value);
  const onPostalCodeChanged = (e) => setPostalCode(e.target.value);
  const onLatitudeChanged = (e) => setLatitude(e.target.value);
  const onLongitudeChanged = (e) => setLongitude(e.target.value);
  const onBillingChanged = (e) => setBilling(e.target.value);

  const [requestStatus, setRequestStatus] = useState("idle");
  const canAdd =
    [
      companyName,
      country,
      city,
      building,
      state,
      unit,
      address1,
      postalCode,
      latitude,
      longitude,
      description,
      telephone,
    ].every(Boolean) && requestStatus === "idle";
  const onAddVendorClicked = (evt) => {
    evt.preventDefault();
    if (canAdd)
      try {
        setRequestStatus("pending");
        if (!isEditing)
          dispatch(
            addNewVendor({
              companyName,
              description,
              telephone,
              email,
              address: [
                {
                  country:
                    country.charAt(0).toUpperCase() +
                    country.slice(1).toLowerCase(),
                  city,
                  building,
                  state,
                  unit,
                  road: address1,
                  postalCode: `${country} ${postalCode}`,
                  latitude,
                  longitude,
                  billing,
                },
              ],
            })
          )
            .unwrap()
            .then(() => {
              addToast("Successfully added vendor", {
                appearance: "success",
                autoDismiss: true,
              });
              navigate("/ad/vendors");
            })
            .catch((err) => {
              addToast(`Error: ${err.message}`, {
                appearance: "error",
                autoDismiss: true,
              });
            });
        else
          dispatch(
            updateExistingVendor({
              id: vendorId,
              companyName,
              description,
              telephone,
              email,
              address: [
                {
                  country,
                  city,
                  building,
                  state,
                  unit,
                  road: address1,
                  postalCode,
                  latitude,
                  longitude,
                  billing,
                },
              ],
            })
          )
            .unwrap()
            .then(() => {
              addToast("Successfully updated vendor", {
                appearance: "success",
                autoDismiss: true,
              });
              navigate(`/ad/vendors/${vendorId}`);
            })
            .catch((err) => {
              addToast(`Error: ${err.message}`, {
                appearance: "error",
                autoDismiss: true,
              });
            });
      } catch (err) {
        console.error("Failed to add/edit vendor: ", err);
      } finally {
        setRequestStatus("idle");
      }
  };

  const onCancelClicked = () =>
    navigate(!isEditing ? "/ad/vendors" : `/ad/vendors/${vendorId}`);

  useEffect(() => {
    Boolean(vendorId) &&
      api.getAll(`admin/viewVendor?id=${vendorId}`).then((response) => {
        const { companyName, description, telephone, email, address } =
          response.data;
        setIsEditing(true);
        setCompanyName(companyName);
        setDescription(description);
        setTelephone(telephone);
        setEmail(email);
        setAddress1(address[0].road);
        setBuilding(address[0].building);
        setUnit(address[0].unit);
        setCountry(address[0].country);
        setCity(address[0].city);
        setState(address[0].state);
        setPostalCode(address[0].postalCode);
        setLatitude(address[0].latitude);
        setLongitude(address[0].longitude);
        setBilling(address[0].billing);
      });
  }, [vendorId]);
  return (
    <VendorFormBody
      isEditing={isEditing}
      companyName={companyName}
      onCompanyNameChanged={onCompanyNameChanged}
      description={description}
      onDescriptionChanged={onDescriptionChanged}
      telephone={telephone}
      onTelephoneChanged={onTelephoneChanged}
      email={email}
      onEmailChanged={onEmailChanged}
      address1={address1}
      onAddress1Changed={onAddress1Changed}
      building={building}
      onBuildingChanged={onBuildingChanged}
      unit={unit}
      onUnitChanged={onUnitChanged}
      country={country}
      onCountryChanged={onCountryChanged}
      countries={countries}
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
      billing={billing}
      onBillingChanged={onBillingChanged}
      onAddVendorClicked={onAddVendorClicked}
      onCancelClicked={onCancelClicked}
    />
  );
};

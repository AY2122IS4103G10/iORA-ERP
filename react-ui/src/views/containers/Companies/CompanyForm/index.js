import { useToasts } from "react-toast-notifications";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { api, companyApi } from "../../../../environments/Api";
import { AddressField } from "../../Sites/SiteForm";
import {
  addNewCompany,
  updateExistingCompany,
} from "../../../../stores/slices/companySlice";
import { FormCheckboxes } from "../../Products/ProductForm";

export const RightColSection = ({
  fieldName,
  children,
  path = "/",
  disableButton = false,
}) => {
  return (
    <section aria-labelledby={`${fieldName.toLowerCase()}-title`}>
      <div className="rounded-lg bg-white  shadow">
        <div className="p-6">
          <h2
            className="text-base font-medium text-gray-900"
            id="announcements-title"
          >
            {fieldName}
          </h2>
          <div className="flow-root max-h-60 overflow-y-auto mt-6">
            {children}
          </div>
          {!disableButton && (
            <Link to={path}>
              <div className="mt-6">
                <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Add {fieldName.toLowerCase()}
                </button>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

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
  billing,
  onBillingChanged,
  depts,
  onDepartmentsChanged,
  deptCheckedState,
  vends,
  onVendorsChanged,
  vendorCheckedState,
  onAddCompanyClicked,
  onCancelClicked,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">{!isEditing ? "Add New" : "Edit"} Company</h1>
    <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
      {/* Form */}
      <div className="grid grid-cols-1 gap-4 lg:col-span-2">
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
                      onClick={onAddCompanyClicked}
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
      {/* Right column */}
      <div className="grid grid-cols-1 gap-4">
        {/* Departments */}
        <RightColSection fieldName="Department" path="/ad/departments/create">
          {depts.length ? (
            <FormCheckboxes
              legend="Department"
              options={depts}
              inputField="Department"
              onFieldsChanged={onDepartmentsChanged}
              fieldValues={deptCheckedState}
            />
          ) : (
            "No departments found"
          )}
        </RightColSection>
        {/* Vendors */}
        <RightColSection fieldName="Vendor" path="/ad/vendors/create">
          {vends.length ? (
            <FormCheckboxes
              legend="Vendor"
              options={vends}
              inputField="Vendor"
              onFieldsChanged={onVendorsChanged}
              fieldValues={vendorCheckedState}
            />
          ) : (
            "No vendors found"
          )}
        </RightColSection>
      </div>
    </div>
  </div>
);

export const CompanyForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
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
  const [billing, setBilling] = useState(false);
  const [registerNo, setRegisterNo] = useState("");
  const [phone, setPhone] = useState("");
  const [depts, setDepartments] = useState([]);
  const [deptCheckedState, setDeptCheckedState] = useState([]);
  const [vends, setVendors] = useState([]);
  const [vendorCheckedState, setVendorCheckedState] = useState([]);
  const [addressId, setAddressId] = useState(null)
  const { addToast } = useToasts();

  useEffect(() => {
    api.getAll("admin/viewDepartments?search=").then((response) => {
      setDepartments(
        response.data.map((dept) => ({ ...dept, fieldValue: dept.deptName }))
      );
      setDeptCheckedState(new Array(response.data.length).fill(false));
    });
  }, []);

  useEffect(() => {
    api.getAll("admin/viewVendors?search=").then((response) => {
      setVendors(
        response.data.map((vendor) => ({
          ...vendor,
          fieldValue: vendor.companyName,
        }))
      );
      setVendorCheckedState(new Array(response.data.length).fill(false));
    });
  }, []);

  const onNameChanged = (e) => setName(e.target.value);
  const onRegisterNoChanged = (e) => setRegisterNo(e.target.value);
  const onPhoneChanged = (e) => setPhone(e.target.value);
  const onAddress1Changed = (e) => setAddress1(e.target.value);
  const onBuildingChanged = (e) => setBuilding(e.target.value);
  const onUnitChanged = (e) => setUnit(e.target.value);
  const onCountryChanged = (e) => setCountry(e.target.value);
  const onCityChanged = (e) => setCity(e.target.value);
  const onStateChanged = (e) => setState(e.target.value);
  const onPostalCodeChanged = (e) => setPostalCode(e.target.value);
  const onLatitudeChanged = (e) => setLatitude(e.target.value);
  const onLongitudeChanged = (e) => setLongitude(e.target.value);
  const onBillingChanged = () => setBilling(!billing);

  const onDepartmentsChanged = (pos) => {
    const updateCheckedState = deptCheckedState.map((item, index) =>
      index === pos ? !item : item
    );
    setDeptCheckedState(updateCheckedState);
  };
  const onVendorsChanged = (pos) => {
    const updateCheckedState = vendorCheckedState.map((item, index) =>
      index === pos ? !item : item
    );
    setVendorCheckedState(updateCheckedState);
  };
  const canAdd = [
    name,
    // country,
    // city,
    // building,
    // state,
    // unit,
    // address1,
    // postalCode,
    // latitude,
    // longitude,
    registerNo,
    phone,
  ].every(Boolean);
  const onAddCompanyClicked = (evt) => {
    evt.preventDefault();
    const d = [],
      v = [];
    depts.forEach((dept, index) => deptCheckedState[index] && d.push(dept));
    vends.forEach(
      (vendor, index) => vendorCheckedState[index] && v.push(vendor)
    );
    if (canAdd)
      if (!isEditing)
        dispatch(
          addNewCompany({
            name,
            address: {
              country:
                country.charAt(0).toUpperCase() +
                country.slice(1).toLowerCase(),
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
            registerNumber: registerNo,
            telephone: phone,
            active: true,
            departments: d.map((dept) => ({ id: dept.id })),
            vendors: v.map((vendor) => ({ id: vendor.id })),
          })
        )
          .unwrap()
          .then(() => {
            addToast("Successfully created company", {
              appearance: "success",
              autoDismiss: true,
            });
            navigate("/ad/companies");
          })
          .catch((err) =>
            addToast(`Error: ${err.message}`, {
              appearance: "error",
              autoDismiss: true,
            })
          );
      else
        dispatch(
          updateExistingCompany({
            id: companyId,
            name,
            address: {
              id: addressId,
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
            registerNumber: registerNo,
            telephone: phone,
            active: true,
            departments: d.map((dept) => ({ id: dept.id })),
            vendors: v.map((vendor) => ({ id: vendor.id })),
          })
        )
          .unwrap()
          .then(() => {
            addToast("Successfully updated company", {
              appearance: "success",
              autoDismiss: true,
            });
            navigate(`/ad/companies/${companyId}`);
          })
          .catch((err) =>
            addToast(`Error: ${err.message}`, {
              appearance: "error",
              autoDismiss: true,
            })
          );
  };

  const onCancelClicked = () =>
    navigate(!isEditing ? "/ad/companies" : `/ad/companies/${companyId}`);

  useEffect(() => {
    Boolean(companyId) &&
      companyApi.getCompany(companyId).then((response) => {
        const {
          name,
          address,
          registerNumber,
          telephone,
          departments,
          vendors,
        } = response.data;
        setIsEditing(true);
        setName(name);
        setRegisterNo(registerNumber);
        setAddressId(address.id)
        setAddress1(address.road);
        setBuilding(address.building);
        setUnit(address.unit);
        setCountry(address.country);
        setCity(address.city);
        setState(address.state);
        setPostalCode(address.postalCode);
        setLatitude(address.latitude);
        setLongitude(address.longitude);
        setPhone(telephone);
        setDeptCheckedState(
          depts.map((dept) => departments.map((d) => d.id).includes(dept.id))
        );
        setVendorCheckedState(
          vends.map((vendor) => vendors.map((v) => v.id).includes(vendor.id))
        );
      });
  }, [companyId, depts, vends]);

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
      billing={billing}
      onBillingChanged={onBillingChanged}
      depts={depts}
      onDepartmentsChanged={onDepartmentsChanged}
      deptCheckedState={deptCheckedState}
      vends={vends}
      onVendorsChanged={onVendorsChanged}
      vendorCheckedState={vendorCheckedState}
      onAddCompanyClicked={onAddCompanyClicked}
      onCancelClicked={onCancelClicked}
    />
  );
};

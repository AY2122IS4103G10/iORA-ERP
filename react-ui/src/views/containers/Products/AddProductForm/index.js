import { nanoid } from "@reduxjs/toolkit";
import { list } from "postcss";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { productAdded } from "../../../../stores/slices/productSlice";
import MainWrapper from "../../../components/MainWrapper";

const header = (
  <div className="bg-white shadow">
    <div className="md:flex md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Add Product
        </h2>
      </div>
    </div>
  </div>
);

const formInput = ({
  label,
  inputField,
  value,
  onChange,
  inputType = "text",
  placeholder = "",
  fieldType = "box",
}) => (
  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
    <label
      htmlFor={inputField}
      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
    >
      {label}
    </label>
    <div className="mt-1 sm:mt-0 sm:col-span-2">
      <div className="max-w-lg flex rounded-md shadow-sm">
        {fieldType === "box" ? (
          <input
            type={inputType}
            name={inputField}
            id={inputField}
            autoComplete={inputField}
            placeholder={placeholder}
            className="flex-1 block w-full focus:ring-cyan-500 focus:border-cyan-500 min-w-0 rounded-md sm:text-sm border-gray-300"
            value={value}
            onChange={onChange}
          />
        ) : (
          <>
            <textarea
              id={inputField}
              name="about"
              rows={3}
              className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
              defaultValue={""}
            />
          </>
        )}
      </div>
    </div>
  </div>
);

const checkboxes = ({ legend, options }) => (
  <fieldset className="space-y-5">
    <legend className="sr-only">{legend}</legend>
    {options.map((option) => (
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            id="comments"
            aria-describedby="comments-description"
            name="comments"
            type="checkbox"
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="comments" className="font-medium text-gray-700">
            {option.name}
          </label>
        </div>
      </div>
    ))}
  </fieldset>
);
const AddProductFormBody = ({
  prodCode,
  onProdChanged,
  name,
  onNameChanged,
  description,
  onDescChanged,
  listPrice,
  onListPriceChanged,
  discPrice,
  onDiscPriceChanged,
  onAddPostClicked,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">Add Product</h1>
    {/* Main 3 column grid */}
    <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
      {/* Left column */}
      <div className="grid grid-cols-1 gap-4 lg:col-span-2">
        {/* Form */}
        <section aria-labelledby="profile-overview-title">
          <div className="rounded-lg bg-white overflow-hidden shadow">
            <form className="p-8 space-y-8 divide-y divide-gray-200">
              <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New Product
                    </h3>
                  </div>
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    {formInput({
                      label: "Product Code",
                      inputField: "prodCode",
                      value: prodCode,
                      onChange: onProdChanged,
                      inputType: "number",
                    })}
                    {formInput({
                      label: "Name",
                      inputField: "name",
                      value: name,
                      onChange: onNameChanged,
                      inputType: "number",
                    })}
                    {formInput({
                      label: "Description",
                      inputField: "description",
                      value: description,
                      onChange: onDescChanged,
                      inputType: "number",
                      fieldType: "area",
                    })}
                    {formInput({
                      label: "List Price",
                      inputField: "listPrice",
                      value: listPrice,
                      onChange: onListPriceChanged,
                      inputType: "number",
                    })}
                    {formInput({
                      label: "Discounted Price",
                      inputField: "discPrice",
                      value: discPrice,
                      onChange: onDiscPriceChanged,
                      inputType: "number",
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={onAddPostClicked}
                  >
                    Add Product
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>

      {/* Right column */}
      <div className="grid grid-cols-1 gap-4">
        {/* Sizes */}
        <section aria-labelledby="announcements-title">
          <div className="rounded-lg bg-white overflow-hidden shadow">
            <div className="p-6">
              <h2
                className="text-base font-medium text-gray-900"
                id="announcements-title"
              >
                Sizes
              </h2>
              <div className="flow-root mt-6">
                <ul role="list" className="-my-5 divide-y divide-gray-200"></ul>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Add size
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section aria-labelledby="recent-hires-title">
          <div className="rounded-lg bg-white overflow-hidden shadow">
            <div className="p-6">
              <h2
                className="text-base font-medium text-gray-900"
                id="recent-hires-title"
              >
                Colors
              </h2>
              <div className="flow-root mt-6">
                <ul role="list" className="-my-5 divide-y divide-gray-200"></ul>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Add color
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export const AddProductForm = () => {
  const [prodCode, setProdCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [listPrice, setListPrice] = useState(0.0);
  const [discPrice, setDiscPrice] = useState(0.0);

  const dispatch = useDispatch();

  const onProdChanged = (e) => setProdCode(e.target.value);
  const onNameChanged = (e) => setName(e.target.value);
  const onDescChanged = (e) => setDescription(e.target.value);
  const onListPriceChanged = (e) => setListPrice(e.target.value);
  const onDiscPriceChanged = (e) => setDiscPrice(e.target.value);

  const onAddPostClicked = () => {
    name &&
      description &&
      dispatch(
        productAdded({
          id: prodCode ? prodCode : nanoid(),
          name,
          description,
        })
      );
    setProdCode("");
    setName("");
    setDescription("");
  };
  return (
    <>
      {/* {header} */}
      <AddProductFormBody
        prodCode={prodCode}
        onProdChanged={onProdChanged}
        name={name}
        onNameChanged={onNameChanged}
        description={description}
        onDescChanged={onDescChanged}
        listPrice={listPrice}
        onListPriceChanged={onListPriceChanged}
        discPrice={discPrice}
        onDiscPriceChanged={onDiscPriceChanged}
        onAddPostClicked={onAddPostClicked}
      />
    </>
  );
};

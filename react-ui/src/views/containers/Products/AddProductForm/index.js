import { nanoid } from "@reduxjs/toolkit";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { productAdded } from "../../../../stores/slices/productSlice";

const formInput = ({
  label,
  inputField,
  value,
  onChange,
  inputType = "text",
  placeholder = "",
  fieldType = "box",
  ...rest
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
            {...rest}
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

const checkboxes = ({ legend, options, inputField, onFieldsChanged }) => {
  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{legend}</legend>
      {options.map((option, index) => (
        <div key={index} className="relative flex items-start">
          <div className="flex items-center h-5">
            <input
              id={inputField}
              aria-describedby="comments-description"
              name={inputField}
              type="checkbox"
              className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded"
              onChange={() => onFieldsChanged(index)}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="comments" className="font-medium text-gray-700">
              {option.fieldValue}
            </label>
          </div>
        </div>
      ))}
    </fieldset>
  );
};
const rightColSection = ({ fieldName, fields, onFieldsChanged }) => (
  <section aria-labelledby={`${fieldName.toLowerCase()}-title`}>
    <div className="rounded-lg bg-white overflow-hidden shadow">
      <div className="p-6">
        <h2
          className="text-base font-medium text-gray-900"
          id="announcements-title"
        >
          {fieldName}
        </h2>
        <div className="flow-root mt-6">
          {fields.length
            ? checkboxes({
                legend: fieldName,
                options: fields,
                inputField: fieldName,
                onFieldsChanged: onFieldsChanged,
              })
            : `No ${fieldName.toLowerCase()} found.`}
        </div>
        <div className="mt-6">
          <a
            href="#"
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Add {fieldName.toLowerCase()}
          </a>
        </div>
      </div>
    </div>
  </section>
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
  onCancelClicked,
  colors,
  onColorsChanged,
  sizes,
  onSizesChanged,
  tags,
  onTagsChanged,
  categories,
  onCatsChanged,
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
            <form>
              <div className="p-8 space-y-8 divide-y divide-gray-200">
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
                        inputType: "text",
                      })}
                      {formInput({
                        label: "Name",
                        inputField: "name",
                        value: name,
                        onChange: onNameChanged,
                        inputType: "text",
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
                        step: "0.01",
                      })}
                      {formInput({
                        label: "Discounted Price",
                        inputField: "discPrice",
                        value: discPrice,
                        onChange: onDiscPriceChanged,
                        inputType: "number",
                        step: "0.01",
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={onCancelClicked}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={onAddPostClicked}
                    >
                      Add Product
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
        {/* Colors */}
        {rightColSection({
          fieldName: "Color",
          fields: colors,
          onFieldsChanged: onColorsChanged,
        })}
        {rightColSection({
          fieldName: "Size",
          fields: sizes,
          onFieldsChanged: onSizesChanged,
        })}
        {rightColSection({
          fieldName: "Category",
          fields: categories,
          onFieldsChanged: onCatsChanged,
        })}
        {rightColSection({
          fieldName: "Tag",
          fields: tags,
          onFieldsChanged: onTagsChanged,
        })}
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

  const fields = useSelector((state) => state.prodFields)
  const colors = fields.filter(
    (field) => field.fieldName === "Color"
  );
  const sizes = fields.filter(
    (field) => field.fieldName === "Size"
  );
  const tags = fields.filter(
    (field) => field.fieldName === "Tag"
  );
  const categories = fields.filter(
    (field) => field.fieldName === "Category"
  );

  const [colorCheckedState, setColorCheckedState] = useState(
    new Array(colors.length).fill(false)
  );
  const [sizeCheckedState, setSizeCheckedState] = useState(
    new Array(sizes.length).fill(false)
  );
  const [tagCheckedState, setTagCheckedState] = useState(
    new Array(tags.length).fill(false)
  );
  const [catCheckedState, setCatCheckedState] = useState(
    new Array(categories.length).fill(false)
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onProdChanged = (e) => setProdCode(e.target.value);
  const onNameChanged = (e) => setName(e.target.value);
  const onDescChanged = (e) => setDescription(e.target.value);
  const onListPriceChanged = (e) => setListPrice(e.target.value);
  const onDiscPriceChanged = (e) => setDiscPrice(e.target.value);
  const onColorsChanged = (pos) => {
    const updateCheckedState = colorCheckedState.map((item, index) =>
      index === pos ? !item : item
    );
    setColorCheckedState(updateCheckedState);
  };
  const onSizesChanged = (pos) => {
    const updateCheckedState = sizeCheckedState.map((item, index) =>
      index === pos ? !item : item
    );
    setSizeCheckedState(updateCheckedState);
  };
  const onTagsChanged = (pos) => {
    const updateCheckedState = tagCheckedState.map((item, index) =>
      index === pos ? !item : item
    );
    setTagCheckedState(updateCheckedState);
  };
  const onCatsChanged = (pos) => {
    const updateCheckedState = catCheckedState.map((item, index) =>
      index === pos ? !item : item
    );
    setCatCheckedState(updateCheckedState);
  };

  const onAddPostClicked = () => {
    const fields = [];
    colors.forEach(
      (color, index) => colorCheckedState[index] && fields.push(color)
    );
    sizes.forEach(
      (size, index) => sizeCheckedState[index] && fields.push(size)
    );
    name &&
      description &&
      dispatch(
        productAdded({
          id: nanoid(),
          name,
          description,
          listPrice,
          discPrice,
          fields: fields
        })
      );
    setProdCode("");
    setName("");
    setDescription("");
  };
  const onCancelClicked = () => navigate(-1);

  return (
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
      onCancelClicked={onCancelClicked}
      colors={colors}
      onColorsChanged={onColorsChanged}
      sizes={sizes}
      onSizesChanged={onSizesChanged}
      tags={tags}
      onTagsChanged={onTagsChanged}
      categories={categories}
      onCatChanged={onCatsChanged}
    />
  );
};

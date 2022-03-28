import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { addNewProductField } from "../../../../stores/slices/prodFieldSlice";

import {
  addNewProduct,
  updateExistingProduct,
} from "../../../../stores/slices/productSlice";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { SimpleTextArea } from "../../../components/Input/SimpleTextArea";
import { api } from "../../../../environments/Api";

import { SimpleModal } from "../../../components/Modals/SimpleModal";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import { classNames } from "../../../../utilities/Util";

const prepareFields = (fields, checkedState) => {
  const f = [];
  fields.forEach((field, index) => checkedState[index] && f.push(field));
  return f;
};

const SKUModal = ({
  open,
  closeModal,
  colors,
  skuColorSelected,
  setSkuColorSelected,
  sizes,
  skuSizeSelected,
  setSkuSizeSelected,
  sku,
  onSkuChanged,
  onSaveClicked,
}) => {
  return (
    <SimpleModal open={open} closeModal={closeModal}>
      <div className="inline-block align-bottom bg-gray-100 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
        <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="sr-only">Add SKU</h1>
          {/* Main 3 column grid */}
          <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
            {/* Left column */}
            <div className="grid grid-cols-1 gap-4 lg:col-span-3">
              {/* Form */}
              <section aria-labelledby="product-form">
                <div className="rounded-lg bg-white overflow-hidden shadow">
                  <form onSubmit={onSaveClicked}>
                    <div className="p-8 space-y-8 divide-y divide-gray-200">
                      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Add SKU
                          </h3>
                          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <SimpleInputGroup
                              label="SKU Code"
                              inputField="sku"
                              className="sm:mt-0 sm:col-span-2"
                            >
                              <SimpleInputBox
                                type="text"
                                name="sku"
                                id="sku"
                                autoComplete="sku"
                                value={sku}
                                onChange={onSkuChanged}
                                required
                                autoFocus
                              />
                            </SimpleInputGroup>
                            <SimpleInputGroup
                              label="Color"
                              inputField="color"
                              className="relative rounded-md sm:mt-0 sm:col-span-2"
                            >
                              <SimpleSelectMenu
                                options={colors}
                                selected={skuColorSelected}
                                setSelected={setSkuColorSelected}
                              />
                            </SimpleInputGroup>
                            <SimpleInputGroup
                              label="Size"
                              inputField="size"
                              className="relative rounded-md sm:mt-0 sm:col-span-2"
                            >
                              <SimpleSelectMenu
                                options={sizes}
                                selected={skuSizeSelected}
                                setSelected={setSkuSizeSelected}
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
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                          >
                            Add SKU
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
      </div>
    </SimpleModal>
  );
};

const SKUList = ({ products }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {products.map((product) => (
          <li key={product.sku}>
            <div className="px-4 py-4 flex items-center sm:px-6">
              <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="truncate">
                  <p className="text-base font-medium text-cyan-600 truncate">
                    {product.sku}
                  </p>
                </div>

                {/* <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                  <div>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <div className="relative flex items-stretch flex-grow focus-within:z-10">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">Qty:</span>
                        </div>
                        <input
                          type="number"
                          name="qty"
                          id="qty"
                          min="1"
                          className="pl-12 focus:ring-cyan-500 focus:border-cyan-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                          value={printQty}
                          onChange={onPrintQtyChanged}
                        />
                      </div>
                      <button
                        type="button"
                        className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        onClick={handlePrint}
                      >
                        <PrinterIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>Print</span>
                      </button>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FieldModal = ({
  open,
  closeModal,
  fieldNameSelected,
  isEditing,
  name,
  onNameChanged,
  onSaveClicked,
}) => {
  return (
    <SimpleModal open={open} closeModal={closeModal}>
      <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
        <form>
          <div className="p-4 space-y-8 divide-y divide-gray-200">
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {`${!isEditing ? "Add New" : "Edit"} ${fieldNameSelected}`}
                </h3>
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <SimpleInputGroup
                    label="Name"
                    inputField="name"
                    className="sm:mt-0 sm:col-span-2"
                  >
                    <SimpleInputBox
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={onNameChanged}
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
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  onClick={onSaveClicked}
                >
                  {!isEditing ? "Add" : "Save"} field
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </SimpleModal>
  );
};

export const FormCheckboxes = ({
  legend,
  options,
  inputField,
  onFieldsChanged,
  fieldValues = [],
  ...rest
}) => {
  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{legend}</legend>
      {options.map((option, index) => {
        return (
          <div key={index} className="ml-1 relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id={inputField}
                aria-describedby={inputField}
                name={inputField}
                type="checkbox"
                className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded"
                checked={
                  Boolean(fieldValues.length) ? fieldValues[index] : false
                }
                onChange={() => onFieldsChanged(index)}
                {...rest}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="comments" className="font-medium text-gray-700">
                {option.fieldValue}
              </label>
            </div>
          </div>
        );
      })}
    </fieldset>
  );
};

const RightColSection = ({
  fieldName,
  children,
  openModal,
  setFieldNameSelected,
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
            <div className="mt-6">
              <button
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => {
                  setFieldNameSelected(fieldName);
                  openModal();
                }}
              >
                Add {fieldName.toLowerCase()}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const AddProductFormBody = ({
  isEditing,
  prodCode,
  onProdChanged,
  name,
  onNameChanged,
  description,
  onDescChanged,
  listPrice,
  onListPriceChanged,
  discountPrice,
  onDiscountPriceChanged,
  onlineOnly,
  onOnlineOnlyChanged,
  colors,
  onColorsChanged,
  colorCheckedState,
  sizes,
  onSizesChanged,
  sizeCheckedState,
  tags,
  onTagsChanged,
  tagCheckedState,
  categories,
  onCatsChanged,
  catCheckedState,
  promotions,
  onPromosChanged,
  promoCheckedState,
  onSaveClicked,
  onCancelClicked,
  openModal,
  setFieldNameSelected,
  skus,
  openSkuModal,
}) => {
  const disableAddSku =
    !colorCheckedState.some(Boolean) || !sizeCheckedState.some(Boolean);

  return (
    <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="sr-only">{!isEditing ? "Add New" : "Edit"} Product</h1>
      {/* Main 3 column grid */}
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        {/* Left column */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          {/* Form */}
          <section aria-labelledby="product-form">
            <div className="rounded-lg bg-white overflow-hidden shadow">
              <form onSubmit={onSaveClicked}>
                <div className="p-8 space-y-8 divide-y divide-gray-200">
                  <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {!isEditing ? "Add New" : "Edit"} Product
                      </h3>
                      <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                        <SimpleInputGroup
                          label="Product Code"
                          inputField="prodCode"
                          className="sm:mt-0 sm:col-span-2"
                        >
                          <SimpleInputBox
                            type="text"
                            name="prodCode"
                            id="prodCode"
                            autoComplete="prodCode"
                            value={prodCode}
                            onChange={onProdChanged}
                            required
                            disabled={isEditing}
                            className={isEditing && "bg-gray-50 text-gray-400"}
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Name"
                          inputField="name"
                          className="sm:mt-0 sm:col-span-2"
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
                          label="Description"
                          inputField="description"
                          className="sm:mt-0 sm:col-span-2"
                        >
                          <SimpleTextArea
                            type="text"
                            id="description"
                            name="description"
                            rows={3}
                            value={description}
                            onChange={onDescChanged}
                            required
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="List Price"
                          inputField="listPrice"
                          className="relative rounded-md sm:mt-0 sm:col-span-2"
                        >
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            name="listPrice"
                            id="listPrice"
                            autoComplete="listPrice"
                            className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                            min="0"
                            value={listPrice}
                            onChange={onListPriceChanged}
                            required
                            step="0.01"
                            aria-describedby="listPrice-currency"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span
                              className="text-gray-500 sm:text-sm"
                              id="listPrice-currency"
                            >
                              SGD
                            </span>
                          </div>
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Discount Price"
                          inputField="discountPrice"
                          className="relative rounded-md sm:mt-0 sm:col-span-2"
                        >
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            name="discountPrice"
                            id="discountPrice"
                            autoComplete="discountPrice"
                            className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                            min="0"
                            value={discountPrice}
                            onChange={onDiscountPriceChanged}
                            required
                            step="0.01"
                            aria-describedby="discountPrice-currency"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span
                              className="text-gray-500 sm:text-sm"
                              id="discountPrice-currency"
                            >
                              SGD
                            </span>
                          </div>
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Online Only"
                          inputField="onlineOnly"
                          className="sm:mt-0 sm:col-span-2"
                        >
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              name="onlineOnly"
                              id="onlineOnly"
                              className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded"
                              checked={onlineOnly}
                              onChange={onOnlineOnlyChanged}
                              aria-describedby="onlineOnly"
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
                      >
                        {!isEditing ? "Add" : "Save"} product
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </section>
          <section aria-labelledby="sku-list">
            <div className="rounded-lg bg-white overflow-hidden shadow">
              <div className="p-8 space-y-8 divide-y divide-gray-200">
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                  <div className="md:flex md:items-center md:justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      SKUs
                    </h3>
                    <button
                      type="button"
                      className={classNames(
                        "ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500",
                        disableAddSku
                          ? "bg-cyan-700"
                          : "bg-cyan-600 hover:bg-cyan-700"
                      )}
                      onClick={openSkuModal}
                      disabled={disableAddSku}
                    >
                      <span>Add SKU</span>
                    </button>
                  </div>
                  {Boolean(skus.length) && (
                    <div className="pt-6">
                      <SKUList products={skus} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="grid grid-cols-1 gap-4">
          {/* Colors */}
          <RightColSection
            fieldName="Colour"
            openModal={openModal}
            setFieldNameSelected={setFieldNameSelected}
          >
            {colors.length ? (
              <FormCheckboxes
                legend="Colour"
                options={colors}
                inputField="Colour"
                onFieldsChanged={onColorsChanged}
                fieldValues={colorCheckedState}
              />
            ) : (
              "No colours found"
            )}
          </RightColSection>
          {/* Sizes */}
          <RightColSection
            fieldName="Size"
            openModal={openModal}
            setFieldNameSelected={setFieldNameSelected}
          >
            {sizes.length ? (
              <FormCheckboxes
                legend="Size"
                options={sizes}
                inputField="Size"
                onFieldsChanged={onSizesChanged}
                fieldValues={sizeCheckedState}
              />
            ) : (
              "No sizes found"
            )}
          </RightColSection>
          {/* Promotions */}
          <RightColSection
            fieldName="Promotion"
            openModal={openModal}
            setFieldNameSelected={setFieldNameSelected}
            disableButton={true}
          >
            {promotions.length ? (
              <FormCheckboxes
                legend="Promotion"
                options={promotions}
                inputField="Promotion"
                onFieldsChanged={onPromosChanged}
                fieldValues={promoCheckedState}
              />
            ) : (
              "No promotions found"
            )}
          </RightColSection>
          {/* Categories */}
          <RightColSection
            fieldName="Category"
            openModal={openModal}
            setFieldNameSelected={setFieldNameSelected}
          >
            {categories.length ? (
              <FormCheckboxes
                legend="Category"
                options={categories}
                inputField="Category"
                onFieldsChanged={onCatsChanged}
                fieldValues={catCheckedState}
              />
            ) : (
              "No categories found"
            )}
          </RightColSection>
          {/* Tags */}
          <RightColSection
            fieldName="Tag"
            openModal={openModal}
            setFieldNameSelected={setFieldNameSelected}
          >
            {tags.length ? (
              <FormCheckboxes
                legend="Tag"
                options={tags}
                inputField="Tag"
                onFieldsChanged={onTagsChanged}
                fieldValues={tagCheckedState}
              />
            ) : (
              "No tag found."
            )}
          </RightColSection>
          {/* Companies */}
          {/* <RightColSection
            fieldName="Company"
            openModal={openModal}
            setFieldNameSelected={setFieldNameSelected}
          >
            {companies.length ? (
              <RadioGroup
                options={companies}
                // defaultChecked={(option) => option.fieldValue === "IORA"}
                selected={companySelected}
                onSelectedChanged={onCompanyChanged}
              />
            ) : (
              `No company found.`
            )}
          </RightColSection> */}
        </div>
      </div>
    </div>
  );
};

export const ProductForm = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { prodId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [prodCode, setProdCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    api.getAll("sam/productField").then((response) => {
      const allFields = response.data;
      const colors = allFields.filter((field) => field.fieldName === "COLOUR");
      const sizes = allFields.filter((field) => field.fieldName === "SIZE");
      const tags = allFields.filter((field) => field.fieldName === "TAG");
      const categories = allFields.filter(
        (field) => field.fieldName === "CATEGORY"
      );
      setColors(colors);
      setSizes(sizes);
      setTags(tags);
      setCategories(categories);
      setColorCheckedState(new Array(colors.length).fill(false));
      setSizeCheckedState(new Array(sizes.length).fill(false));
      setTagCheckedState(new Array(tags.length).fill(false));
      setCatCheckedState(new Array(categories.length).fill(false));
      // setCompanySelected(companies[0]);
    });
  }, []);

  useEffect(() => {
    api.getAll("sam/promotionFields").then((response) => {
      setPromotions(response.data);
      setPromoCheckedState(new Array(response.data.length).fill(false));
    });
  }, []);

  const [colorCheckedState, setColorCheckedState] = useState([]);
  const [sizeCheckedState, setSizeCheckedState] = useState([]);
  const [tagCheckedState, setTagCheckedState] = useState([]);
  const [catCheckedState, setCatCheckedState] = useState([]);
  const [promoCheckedState, setPromoCheckedState] = useState([]);

  const onProdChanged = (e) => setProdCode(e.target.value);
  const onNameChanged = (e) => setName(e.target.value);
  const onDescChanged = (e) => setDescription(e.target.value);
  const onListPriceChanged = (e) => setListPrice(e.target.value);
  const onDiscountPriceChanged = (e) => setDiscountPrice(e.target.value);
  const onOnlineOnlyChanged = () => setOnlineOnly(!onlineOnly);
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
  const onPromosChanged = (pos) => {
    const updateCheckedState = promoCheckedState.map((item, index) =>
      index === pos ? !item : item
    );
    setPromoCheckedState(updateCheckedState);
  };

  const canAdd = [prodCode, name, description, listPrice].every(Boolean);

  const onSaveClicked = (evt) => {
    evt.preventDefault();
    var fields = [];
    fields = fields.concat(prepareFields(colors, colorCheckedState));
    fields = fields.concat(prepareFields(sizes, sizeCheckedState));
    fields = fields.concat(prepareFields(tags, tagCheckedState));
    fields = fields.concat(prepareFields(categories, catCheckedState));
    fields = fields.concat(prepareFields(promotions, promoCheckedState));
    
    if (canAdd) {
      if (!isEditing) {
        dispatch(
          addNewProduct({
            modelCode: prodCode,
            name,
            description,
            listPrice,
            discountPrice,
            onlineOnly,
            available: true,
            products: [],
            productFields: fields,
          })
        )
          .unwrap()
          .then(() => {
            addToast("Successfully added product", {
              appearance: "success",
              autoDismiss: true,
            });
            navigate("/sm/products");
          })
          .catch((err) =>
            addToast(`Error: ${err.message}`, {
              appearance: "error",
              autoDismiss: true,
            })
          );
      } else {
        dispatch(
          updateExistingProduct({
            modelCode: prodCode,
            name,
            description,
            listPrice,
            discountPrice,
            onlineOnly,
            available: true,
            products,
            productFields: fields,
          })
        )
          .unwrap()
          .then(() => {
            addToast("Successfully updated product", {
              appearance: "success",
              autoDismiss: true,
            });
            navigate(`/sm/products/${prodCode}`);
          })
          .catch((err) =>
            addToast(`Error: ${err.message}`, {
              appearance: "error",
              autoDismiss: true,
            })
          );
      }
    }
  };

  const onCancelClicked = () => navigate(-1);

  useEffect(() => {
    Boolean(prodId) &&
      api.get("sam/model", prodId).then((response) => {
        const {
          modelCode,
          name,
          description,
          listPrice,
          discountPrice,
          onlineOnly,
          productFields,
          products,
        } = response.data;
        setIsEditing(true);
        setProdCode(modelCode);
        setName(name);
        setDescription(description);
        setListPrice(listPrice);
        setDiscountPrice(discountPrice);
        setOnlineOnly(onlineOnly);
        setColorCheckedState(
          colors
            .map((field) => field.fieldValue)
            .map((color) =>
              productFields
                .filter((field) => field.fieldName === "COLOUR")
                .map((field) => field.fieldValue)
                .includes(color)
            )
        );
        setSizeCheckedState(
          sizes
            .map((field) => field.fieldValue)
            .map((size) =>
              productFields
                .filter((field) => field.fieldName === "SIZE")
                .map((field) => field.fieldValue)
                .includes(size)
            )
        );
        setTagCheckedState(
          tags
            .map((field) => field.fieldValue)
            .map((tag) =>
              productFields
                .filter((field) => field.fieldName === "TAG")
                .map((field) => field.fieldValue)
                .includes(tag)
            )
        );
        setCatCheckedState(
          categories
            .map((field) => field.fieldValue)
            .map((category) =>
              productFields
                .filter(
                  (field) =>
                    field.fieldName === "CATEGORY" &&
                    ![field.quota, field.coefficients, field.constants].some(
                      Boolean
                    )
                )
                .map((field) => field.fieldValue)
                .includes(category)
            )
        );
        setPromoCheckedState(
          promotions
            .map((field) => field.fieldValue)
            .map((promo) =>
              productFields
                .filter(
                  (field) =>
                    field.fieldName === "CATEGORY" &&
                    [field.quota, field.coefficients, field.constants].some(
                      Boolean
                    )
                )
                .map((field) => field.fieldValue)
                .includes(promo)
            )
        );
        setProducts(products);
        // setCompanySelected(companies[0]);
      });
  }, [prodId, colors, sizes, tags, categories, promotions]);

  const [fieldNameSelected, setFieldNameSelected] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [openAddField, setOpenAddField] = useState(false);

  const onFieldValueChanged = (e) => setFieldValue(e.target.value);

  const canAddField = fieldNameSelected && fieldValue;
  const onAddFieldClicked = (evt) => {
    evt.preventDefault();
    if (canAddField)
      dispatch(
        addNewProductField({
          fieldName: fieldNameSelected,
          fieldValue,
        })
      )
        .unwrap()
        .then(() => {
          addToast("Successfully created field", {
            appearance: "success",
            autoDismiss: true,
          });
          closeModal();
        })
        .catch((err) =>
          addToast(`Error: ${err.message}`, {
            appearance: "error",
            autoDismiss: true,
          })
        );
  };
  const openModal = () => setOpenAddField(true);
  const closeModal = () => setOpenAddField(false);

  const [skus, setSkus] = useState([]);
  const [sku, setSku] = useState("");
  const [skuColors, setSkuColors] = useState([]);
  const [skuColorSelected, setSkuColorSelected] = useState(null);
  const [skuSizes, setSkuSizes] = useState([]);
  const [skuSizeSelected, setSkuSizeSelected] = useState(null);
  const [openAddSku, setOpenAddSku] = useState(false);

  const onSkuChanged = (e) => setSku(e.target.value);
  const openSkuModal = () => {
    const c = [],
      s = [];
    colors.forEach(
      (color, index) =>
        colorCheckedState[index] && c.push({ ...color, name: color.fieldValue })
    );
    sizes.forEach(
      (size, index) =>
        sizeCheckedState[index] && s.push({ ...size, name: size.fieldValue })
    );
    setSkuColors(c);
    setSkuSizes(s);
    setSkuColorSelected(c[0]);
    setSkuSizeSelected(s[0]);
    setOpenAddSku(true);
  };
  const closeSkuModal = () => setOpenAddSku(false);

  return (
    <>
      <AddProductFormBody
        isEditing={isEditing}
        prodCode={prodCode}
        onProdChanged={onProdChanged}
        name={name}
        onNameChanged={onNameChanged}
        description={description}
        onDescChanged={onDescChanged}
        listPrice={listPrice}
        onListPriceChanged={onListPriceChanged}
        discountPrice={discountPrice}
        onDiscountPriceChanged={onDiscountPriceChanged}
        onlineOnly={onlineOnly}
        onOnlineOnlyChanged={onOnlineOnlyChanged}
        colors={colors}
        onColorsChanged={onColorsChanged}
        colorCheckedState={colorCheckedState}
        sizes={sizes}
        onSizesChanged={onSizesChanged}
        sizeCheckedState={sizeCheckedState}
        tags={tags}
        onTagsChanged={onTagsChanged}
        tagCheckedState={tagCheckedState}
        categories={categories}
        onCatsChanged={onCatsChanged}
        catCheckedState={catCheckedState}
        promotions={promotions}
        onPromosChanged={onPromosChanged}
        promoCheckedState={promoCheckedState}
        onSaveClicked={onSaveClicked}
        onCancelClicked={onCancelClicked}
        openModal={openModal}
        setFieldNameSelected={setFieldNameSelected}
        skus={skus}
        openSkuModal={openSkuModal}
      />
      <FieldModal
        open={openAddField}
        closeModal={closeModal}
        fieldNameSelected={fieldNameSelected}
        name={fieldValue}
        onNameChanged={onFieldValueChanged}
        onSaveClicked={onAddFieldClicked}
      />
      <SKUModal
        open={openAddSku}
        closeModal={closeSkuModal}
        colors={skuColors}
        skuColorSelected={skuColorSelected}
        setSkuColorSelected={setSkuColorSelected}
        sizes={skuSizes}
        skuSizeSelected={skuSizeSelected}
        setSkuSizeSelected={setSkuSizeSelected}
        isEditing={isEditing}
        sku={sku}
        onSkuChanged={onSkuChanged}
        onSaveClicked={onSaveClicked}
      />
    </>
  );
};

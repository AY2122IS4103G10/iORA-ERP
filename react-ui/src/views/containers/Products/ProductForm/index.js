import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProductFields,
  selectAllProdFields,
} from "../../../../stores/slices/prodFieldSlice";

import {
  addNewProduct,
  updateExistingProduct,
} from "../../../../stores/slices/productSlice";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { SimpleTextArea } from "../../../components/Input/SimpleTextArea";
import { api } from "../../../../environments/Api";
import { SimpleModal } from "../../../components/Modals/SimpleModal";

const checkboxState = (allFields, prodFields) => {
  const res = [];
  allFields.forEach((field) => res.push(prodFields.includes(field)));
  return res;
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
      {options.map((option, index) => (
        <div key={index} className="relative flex items-start">
          <div className="flex items-center h-5">
            <input
              id={inputField}
              aria-describedby={inputField}
              name={inputField}
              type="checkbox"
              className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded"
              defaultChecked={fieldValues.length ? fieldValues[index] : false}
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
      ))}
    </fieldset>
  );
};

const RadioGroup = ({ options, defaultChecked }) => {
  return (
    <fieldset className="mt-4">
      <legend className="sr-only">Option</legend>
      <div className="space-y-4">
        {options.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              id={option.id}
              name="option"
              type="radio"
              defaultChecked={defaultChecked(option)}
              className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300"
            />
            <label
              htmlFor={option.id}
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              {option.fieldValue}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

const RightColSection = ({
  fieldName,
  children,
  openModal,
  setFieldNameSelected,
}) => {
  return (
    <>
      <section aria-labelledby={`${fieldName.toLowerCase()}-title`}>
        <div className="rounded-lg bg-white overflow-hidden shadow">
          <div className="p-6">
            <h2
              className="text-base font-medium text-gray-900"
              id="announcements-title"
            >
              {fieldName}
            </h2>
            <div className="flow-root mt-6">{children}</div>
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
          </div>
        </div>
      </section>
    </>
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
  price,
  onListPriceChanged,
  available,
  onAvailableChanged,
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
  companies,
  onSaveClicked,
  onCancelClicked,
  openModal,
  setFieldNameSelected,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">Add Product</h1>
    {/* Main 3 column grid */}
    <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
      {/* Left column */}
      <div className="grid grid-cols-1 gap-4 lg:col-span-2">
        {/* Form */}
        <section aria-labelledby="product-form">
          <div className="rounded-lg bg-white overflow-hidden shadow">
            <form>
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
                        inputField="price"
                        className="relative rounded-md sm:mt-0 sm:col-span-2"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          autoComplete="price"
                          className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.00"
                          value={price}
                          onChange={onListPriceChanged}
                          required
                          step="0.01"
                          aria-describedby="price-currency"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span
                            className="text-gray-500 sm:text-sm"
                            id="price-currency"
                          >
                            SGD
                          </span>
                        </div>
                      </SimpleInputGroup>
                      <SimpleInputGroup
                        label="Available"
                        inputField="available"
                        className="sm:mt-0 sm:col-span-2"
                      >
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            name="available"
                            id="available"
                            autoComplete="available"
                            className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded"
                            value={available}
                            onChange={onAvailableChanged}
                            required
                            defaultChecked
                            aria-describedby="available"
                          />
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
                            value={onlineOnly}
                            onChange={onOnlineOnlyChanged}
                            required
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
                      onClick={onSaveClicked}
                    >
                      {!isEditing ? "Add" : "Save"} product
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
        <RightColSection
          fieldName="Colour"
          openModal={openModal}
          setFieldNameSelected={setFieldNameSelected}
        >
          <FormCheckboxes
            legend="Colour"
            options={colors}
            inputField="Colour"
            onFieldsChanged={onColorsChanged}
            fieldValues={colorCheckedState}
          />
        </RightColSection>
        <RightColSection
          fieldName="Size"
          openModal={openModal}
          setFieldNameSelected={setFieldNameSelected}
        >
          <FormCheckboxes
            legend="Size"
            options={sizes}
            inputField="Size"
            onFieldsChanged={onSizesChanged}
            fieldValues={sizeCheckedState}
          />
        </RightColSection>
        <RightColSection
          fieldName="Category"
          openModal={openModal}
          setFieldNameSelected={setFieldNameSelected}
        >
          <FormCheckboxes
            legend="Category"
            options={categories}
            inputField="Category"
            onFieldsChanged={onCatsChanged}
            fieldValues={catCheckedState}
          />
        </RightColSection>
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
            `No tag found.`
          )}
        </RightColSection>
        <RightColSection
          fieldName="Company"
          openModal={openModal}
          setFieldNameSelected={setFieldNameSelected}
        >
          {companies.length ? (
            <RadioGroup
              options={companies}
              defaultChecked={(option) => option.fieldValue === "IORA"}
            />
          ) : (
            `No company found.`
          )}
        </RightColSection>
      </div>
    </div>
  </div>
);

export const ProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { prodId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [prodCode, setProdCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [available, setAvailable] = useState(true);
  const [products, setProducts] = useState([]);

  const allFields = useSelector(selectAllProdFields);
  const prodFieldStatus = useSelector((state) => state.prodFields.status);
  useEffect(() => {
    prodFieldStatus === "idle" && dispatch(fetchProductFields());
  }, [prodFieldStatus, dispatch]);
  const colors = allFields.filter((field) => field.fieldName === "COLOUR");
  const sizes = allFields.filter((field) => field.fieldName === "SIZE");
  const tags = allFields.filter((field) => field.fieldName === "TAG");
  const companies = allFields.filter((field) => field.fieldName === "COMPANY");
  const categories = allFields.filter(
    (field) => field.fieldName === "category"
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
  // const [company, setCompany] = useState(!isEditing ? "" : product.company);

  const onProdChanged = (e) => setProdCode(e.target.value);
  const onNameChanged = (e) => setName(e.target.value);
  const onDescChanged = (e) => setDescription(e.target.value);
  const onListPriceChanged = (e) => setPrice(e.target.value);
  const onOnlineOnlyChanged = () => {
    setOnlineOnly(!onlineOnly);
  };
  const onAvailableChanged = () => setAvailable(!available);
  // const onCompanyChanged = (e) => setCompany(e.target.value);
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

  const [requestStatus, setRequestStatus] = useState("idle");

  const canAdd =
    [prodCode, name, description, price].every(Boolean) &&
    requestStatus === "idle";

  const onSaveClicked = (evt) => {
    evt.preventDefault();
    const fields = [];
    colors.forEach(
      (color, index) => colorCheckedState[index] && fields.push(color)
    );
    sizes.forEach(
      (SIZE, index) => sizeCheckedState[index] && fields.push(SIZE)
    );
    tags.forEach((tag, index) => tagCheckedState[index] && fields.push(tag));
    categories.forEach(
      (cat, index) => catCheckedState[index] && fields.push(cat)
    );
    if (canAdd) {
      try {
        setRequestStatus("pending");
        if (!isEditing) {
          dispatch(
            addNewProduct({
              modelCode: prodCode,
              name,
              description,
              price,
              onlineOnly,
              available,
              products: [],
              productFields: fields,
            })
          ).unwrap();
        } else {
          dispatch(
            updateExistingProduct({
              modelCode: prodCode,
              name,
              description,
              price,
              onlineOnly,
              available,
              products,
              productFields: fields,
            })
          ).unwrap();
        }
        alert(`Successfully ${!isEditing ? "added" : "updated"} product`);
        navigate(!isEditing ? "/sm/products" : `/sm/products/${prodCode}`);
      } catch (err) {
        console.error(
          `Failed to ${!isEditing ? "add" : "update"} product: `,
          err
        );
      } finally {
        setRequestStatus("idle");
      }
    }
  };

  const onCancelClicked = () =>
    navigate(!isEditing ? "/sm/products" : `/sm/products/${prodCode}`);

  useEffect(() => {
    Boolean(prodId) &&
      api.get("sam/model", prodId).then((response) => {
        const {
          modelCode,
          name,
          description,
          price,
          onlineOnly,
          available,
          productFields,
          products,
        } = response.data;
        setIsEditing(true);
        setProdCode(modelCode);
        setName(name);
        setDescription(description);
        setPrice(price);
        setOnlineOnly(onlineOnly);
        setAvailable(available);
        setColorCheckedState(
          checkboxState(
            colors.map((field) => field.fieldValue),
            productFields
              .filter((field) => field.fieldName === "COLOUR")
              .map((field) => field.fieldValue)
          )
        );
        setSizeCheckedState(
          checkboxState(
            sizes.map((field) => field.fieldValue),
            productFields
              .filter((field) => field.fieldName === "SIZE")
              .map((field) => field.fieldValue)
          )
        );
        setTagCheckedState(
          checkboxState(
            tags.map((field) => field.fieldValue),
            productFields
              .filter((field) => field.fieldName === "tag")
              .map((field) => field.fieldValue)
          )
        );
        setCatCheckedState(
          checkboxState(
            categories.map((field) => field.fieldValue),
            productFields
              .filter((field) => field.fieldName === "category")
              .map((field) => field.fieldValue)
          )
        );
        setProducts(products);
      });
  }, [prodId]);

  const [fieldNameSelected, setFieldNameSelected] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [openAddField, setOpenAddField] = useState(false);

  const onFieldValueChanged = (e) => setFieldValue(e.target.value);
  const openModal = () => setOpenAddField(true);
  const closeModal = () => setOpenAddField(false);
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
        price={price}
        onListPriceChanged={onListPriceChanged}
        available={available}
        onAvailableChanged={onAvailableChanged}
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
        onCatChanged={onCatsChanged}
        catCheckedState={catCheckedState}
        companies={companies}
        onSaveClicked={onSaveClicked}
        onCancelClicked={onCancelClicked}
        openModal={openModal}
        setFieldNameSelected={setFieldNameSelected}
      />
      <FieldModal
        open={openAddField}
        closeModal={closeModal}
        fieldNameSelected={fieldNameSelected}
        name={fieldValue}
        onNameChanged={onFieldValueChanged}
      />
    </>
  );
};

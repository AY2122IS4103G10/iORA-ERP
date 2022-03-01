import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
          <div key={index} className="relative flex items-start">
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

// const RadioGroup = ({ options, selected, onSelectedChanged }) => {
//   return (
//     <fieldset className="mt-4">
//       <legend className="sr-only">Option</legend>
//       <div className="space-y-4">
//         {options.map((option) => (
//           <div key={option.id} className="flex items-center">
//             <input
//               id={option.id}
//               name="option"
//               type="radio"
//               // defaultChecked={defaultChecked(option)}
//               checked={option.fieldValue === selected.fieldValue}
//               className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300"
//               value={selected}
//               onChange={onSelectedChanged}
//             />
//             <label
//               htmlFor={option.id}
//               className="ml-3 block text-sm font-medium text-gray-700"
//             >
//               {option.fieldValue}
//             </label>
//           </div>
//         ))}
//       </div>
//     </fieldset>
//   );
// };

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
  promotions,
  onPromosChanged,
  promoCheckedState,
  companies,
  companySelected,
  onCompanyChanged,
  onSaveClicked,
  onCancelClicked,
  openModal,
  setFieldNameSelected,
}) => {
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
                            min="0"
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
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    api.getAll("sam/productField").then((response) => {
      const allFields = response.data;
      const colors = allFields.filter((field) => field.fieldName === "COLOUR");
      const sizes = allFields.filter((field) => field.fieldName === "SIZE");
      const tags = allFields.filter((field) => field.fieldName === "TAG");
      const categories = allFields.filter(
        (field) => field.fieldName === "CATEGORY"
      );
      const companies = allFields.filter(
        (field) => field.fieldName === "COMPANY"
      );
      setColors(colors);
      setSizes(sizes);
      setTags(tags);
      setCategories(categories);
      setCompanies(companies);
      setColorCheckedState(new Array(colors.length).fill(false));
      setSizeCheckedState(new Array(sizes.length).fill(false));
      setTagCheckedState(new Array(tags.length).fill(false));
      setCatCheckedState(new Array(categories.length).fill(false));
      setCompanySelected(companies[0]);
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
  const [companySelected, setCompanySelected] = useState([]);
  const [promoCheckedState, setPromoCheckedState] = useState([]);

  const onProdChanged = (e) => setProdCode(e.target.value);
  const onNameChanged = (e) => setName(e.target.value);
  const onDescChanged = (e) => setDescription(e.target.value);
  const onListPriceChanged = (e) => setPrice(e.target.value);
  const onCompanyChanged = (e) => setCompanySelected(e.currentTarget.value);
  const onOnlineOnlyChanged = () => {
    setOnlineOnly(!onlineOnly);
  };
  const onAvailableChanged = () => setAvailable(!available);
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

  const canAdd = [prodCode, name, description, price].every(Boolean);

  const onSaveClicked = (evt) => {
    evt.preventDefault();
    const fields = [];
    colors.forEach(
      (color, index) => colorCheckedState[index] && fields.push(color)
    );
    sizes.forEach(
      (size, index) => sizeCheckedState[index] && fields.push(size)
    );
    tags.forEach((tag, index) => tagCheckedState[index] && fields.push(tag));
    categories.forEach(
      (cat, index) => catCheckedState[index] && fields.push(cat)
    );
    promotions.forEach(
      (promo, index) => promoCheckedState[index] && fields.push(promo)
    );
    if (canAdd) {
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
        )
          .unwrap()
          .then(() => {
            alert("Successfully added product");
            navigate("/sm/products");
          })
          .catch((err) => console.error("Failed to add product: ", err));
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
        )
          .unwrap()
          .then(() => {
            alert(`Successfully updated product`);
            navigate(`/sm/products/${prodCode}`);
          })
          .catch((err) => console.error(`Failed to update product: `, err));
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
                    !Boolean(field.discountedPrice)
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
                    Boolean(field.discountedPrice)
                )
                .map((field) => field.fieldValue)
                .includes(promo)
            )
        );
        setProducts(products);
        setCompanySelected(companies[0])
      });
  }, [prodId, colors, sizes, tags, categories, promotions, companies]);

  const [fieldNameSelected, setFieldNameSelected] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [openAddField, setOpenAddField] = useState(false);

  const onFieldValueChanged = (e) => setFieldValue(e.target.value);

  const [fieldRequestStatus, setFieldRequestStatus] = useState("idle");
  const canAddField =
    fieldNameSelected && fieldValue && fieldRequestStatus === "idle";
  const onAddFieldClicked = (evt) => {
    evt.preventDefault();
    if (canAddField)
      try {
        dispatch(
          addNewProductField({
            fieldName: fieldNameSelected,
            fieldValue,
          })
        );
        alert(`Successfully added ${fieldNameSelected}`);
        closeModal();
      } catch (err) {
        console.error("Failed to add promo: ", err);
      } finally {
        setFieldRequestStatus("idle");
      }
  };
  // console.log(companySelected)
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
        onCatsChanged={onCatsChanged}
        catCheckedState={catCheckedState}
        promotions={promotions}
        onPromosChanged={onPromosChanged}
        promoCheckedState={promoCheckedState}
        companies={companies}
        companySelected={companySelected}
        onCompanyChanged={onCompanyChanged}
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
        onSaveClicked={onAddFieldClicked}
      />
    </>
  );
};

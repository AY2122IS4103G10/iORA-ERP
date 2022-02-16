// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";

// import {
//   productUpdated,
//   selectProductByCode,
// } from "../../../../stores/slices/productSlice";
// import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
// import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
// import { SimpleTextArea } from "../../../components/Input/SimpleTextArea";
// import { FormCheckboxes } from "../AddProductForm";

// const checkboxState = (allFields, prodFields) => {
//   const res = [];
//   allFields.forEach((field) => res.push(prodFields.includes(field)));
//   return res;
// };

// const rightColSection = ({
//   fieldName,
//   fields,
//   fieldValues,
//   onFieldsChanged,
// }) => (
//   <section aria-labelledby={`${fieldName.toLowerCase()}-title`}>
//     <div className="rounded-lg bg-white overflow-hidden shadow">
//       <div className="p-6">
//         <h2
//           className="text-base font-medium text-gray-900"
//           id="announcements-title"
//         >
//           {fieldName}
//         </h2>
//         <div className="flow-root mt-6">
//           {fields.length ? (
//             <FormCheckboxes
//               legend={fieldName}
//               options={fields}
//               inputField={fieldName}
//               onFieldsChanged={onFieldsChanged}
//               fieldValues={fieldValues}
//             />
//           ) : (
//             `No ${fieldName.toLowerCase()} found.`
//           )}
//         </div>
//         <div className="mt-6">
//           <a
//             href="#"
//             className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//           >
//             Add {fieldName.toLowerCase()}
//           </a>
//         </div>
//       </div>
//     </div>
//   </section>
// );

// const EditProductFormBody = ({
//   prodCode,
//   onProdChanged,
//   name,
//   onNameChanged,
//   description,
//   onDescChanged,
//   listPrice,
//   onListPriceChanged,
//   discPrice,
//   onDiscPriceChanged,
//   onSaveProductClicked,
//   onCancelClicked,
//   colors,
//   colorValues,
//   onColorsChanged,
//   sizes,
//   sizeValues,
//   onSizesChanged,
//   tags,
//   tagValues,
//   onTagsChanged,
//   categories,
//   catValues,
//   onCatsChanged,
// }) => (
//   <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
//     <h1 className="sr-only">Edit Product</h1>
//     {/* Main 3 column grid */}
//     <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
//       {/* Left column */}
//       <div className="grid grid-cols-1 gap-4 lg:col-span-2">
//         {/* Form */}
//         <section aria-labelledby="profile-overview-title">
//           <div className="rounded-lg bg-white overflow-hidden shadow">
//             <form>
//               <div className="p-8 space-y-8 divide-y divide-gray-200">
//                 <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
//                   <div>
//                     <div>
//                       <h3 className="text-lg leading-6 font-medium text-gray-900">
//                         Edit Product
//                       </h3>
//                     </div>
//                     <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
//                     <SimpleInputGroup
//                         label="Product Code"
//                         inputField="prodCode"
//                         className="sm:mt-0 sm:col-span-2"
//                       >
//                         <SimpleInputBox
//                           type="text"
//                           name="prodCode"
//                           id="prodCode"
//                           autoComplete="prodCode"
//                           value={prodCode}
//                           onChange={onProdChanged}
//                           required
//                         />
//                       </SimpleInputGroup>
//                       <SimpleInputGroup
//                         label="Name"
//                         inputField="name"
//                         className="sm:mt-0 sm:col-span-2"
//                       >
//                         <SimpleInputBox
//                           type="text"
//                           name="name"
//                           id="name"
//                           autoComplete="name"
//                           value={name}
//                           onChange={onNameChanged}
//                           required
//                         />
//                       </SimpleInputGroup>
//                       <SimpleInputGroup
//                         label="Description"
//                         inputField="description"
//                         className="sm:mt-0 sm:col-span-2"
//                       >
//                         <SimpleTextArea
//                           type="text"
//                           id="description"
//                           name="description"
//                           rows={3}
//                           value={description}
//                           onChange={onDescChanged}
//                           required
//                         />
//                       </SimpleInputGroup>
//                       <SimpleInputGroup
//                         label="List Price"
//                         inputField="listPrice"
//                         className="relative rounded-md shadow-sm"
//                       >
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <span className="text-gray-500 sm:text-sm">$</span>
//                         </div>
//                         <input
//                           type="number"
//                           name="listPrice"
//                           id="listPrice"
//                           autoComplete="listPrice"
//                           className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
//                           placeholder="0.00"
//                           value={listPrice}
//                           onChange={onListPriceChanged}
//                           required
//                           step="0.01"
//                           aria-describedby="listPrice-currency"
//                         />
//                         <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                           <span
//                             className="text-gray-500 sm:text-sm"
//                             id="listPrice-currency"
//                           >
//                             SGD
//                           </span>
//                         </div>
//                       </SimpleInputGroup>
//                       <SimpleInputGroup
//                         label="Discount Price"
//                         inputField="discPrice"
//                         className="relative rounded-md shadow-sm"
//                       >
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <span className="text-gray-500 sm:text-sm">$</span>
//                         </div>
//                         <input
//                           type="number"
//                           name="discPrice"
//                           id="discPrice"
//                           autoComplete="discPrice"
//                           className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
//                           placeholder="0.00"
//                           value={discPrice}
//                           onChange={onDiscPriceChanged}
//                           required
//                           step="0.01"
//                           aria-describedby="discPrice-currency"
//                         />
//                         <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                           <span
//                             className="text-gray-500 sm:text-sm"
//                             id="discPrice-currency"
//                           >
//                             SGD
//                           </span>
//                         </div>
//                       </SimpleInputGroup>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="pt-5">
//                   <div className="flex justify-end">
//                     <button
//                       type="button"
//                       className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
//                       onClick={onCancelClicked}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
//                       onClick={onSaveProductClicked}
//                     >
//                       Save product
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </section>
//       </div>

//       {/* Right column */}
//       <div className="grid grid-cols-1 gap-4">
//         {/* Colors */}
//         {rightColSection({
//           fieldName: "Color",
//           fields: colors,
//           fieldValues: colorValues,
//           onFieldsChanged: onColorsChanged,
//         })}
//         {rightColSection({
//           fieldName: "Size",
//           fields: sizes,
//           fieldValues: sizeValues,
//           onFieldsChanged: onSizesChanged,
//         })}
//         {rightColSection({
//           fieldName: "Category",
//           fields: categories,
//           fieldValues: catValues,
//           onFieldsChanged: onCatsChanged,
//         })}
//         {rightColSection({
//           fieldName: "Tag",
//           fields: tags,
//           fieldValues: tagValues,
//           onFieldsChanged: onTagsChanged,
//         })}
//       </div>
//     </div>
//   </div>
// );

// export const EditProductForm = () => {
//   const { prodCode } = useParams();
//   const product = useSelector((state) => selectProductByCode(state, prodCode));
//   const [name, setName] = useState(product.name);
//   const [description, setDescription] = useState(product.description);
//   const [listPrice, setListPrice] = useState(product.listPrice);
//   const [discPrice, setDiscPrice] = useState(product.discPrice);

//   const fields = useSelector((state) => state.prodFields);
//   const colors = fields.filter((field) => field.fieldName === "Color");
//   const sizes = fields.filter((field) => field.fieldName === "Size");
//   const tags = fields.filter((field) => field.fieldName === "Tag");
//   const categories = fields.filter((field) => field.fieldName === "Category");

//   const [colorCheckedState, setColorCheckedState] = useState(
//     checkboxState(
//       colors.map((field) => field.fieldValue),
//       product.fields
//         .filter((field) => field.fieldName === "Color")
//         .map((field) => field.fieldValue)
//     )
//   );
//   const [sizeCheckedState, setSizeCheckedState] = useState(
//     checkboxState(
//       sizes.map((field) => field.fieldValue),
//       product.fields
//         .filter((field) => field.fieldName === "Size")
//         .map((field) => field.fieldValue)
//     )
//   );
//   const [tagCheckedState, setTagCheckedState] = useState(
//     checkboxState(
//       tags.map((field) => field.fieldValue),
//       product.fields
//         .filter((field) => field.fieldName === "Tag")
//         .map((field) => field.fieldValue)
//     )
//   );
//   const [catCheckedState, setCatCheckedState] = useState(
//     checkboxState(
//       categories.map((field) => field.fieldValue),
//       product.fields
//         .filter((field) => field.fieldName === "Category")
//         .map((field) => field.fieldValue)
//     )
//   );

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const onNameChanged = (e) => setName(e.target.value);
//   const onDescChanged = (e) => setDescription(e.target.value);
//   const onListPriceChanged = (e) => setListPrice(e.target.value);
//   const onDiscPriceChanged = (e) => setDiscPrice(e.target.value);
//   const onColorsChanged = (pos) => {
//     const updateCheckedState = colorCheckedState.map((item, index) =>
//       index === pos ? !item : item
//     );
//     setColorCheckedState(updateCheckedState);
//   };
//   const onSizesChanged = (pos) => {
//     const updateCheckedState = sizeCheckedState.map((item, index) =>
//       index === pos ? !item : item
//     );
//     setSizeCheckedState(updateCheckedState);
//   };
//   const onTagsChanged = (pos) => {
//     const updateCheckedState = tagCheckedState.map((item, index) =>
//       index === pos ? !item : item
//     );
//     setTagCheckedState(updateCheckedState);
//   };
//   const onCatsChanged = (pos) => {
//     const updateCheckedState = catCheckedState.map((item, index) =>
//       index === pos ? !item : item
//     );
//     setCatCheckedState(updateCheckedState);
//   };

//   const onSaveProductClicked = (evt) => {
//     evt.preventDefault();

//     const fields = [];
//     colors.forEach(
//       (color, index) => colorCheckedState[index] && fields.push(color)
//     );
//     sizes.forEach(
//       (size, index) => sizeCheckedState[index] && fields.push(size)
//     );
//     tags.forEach((tag, index) => tagCheckedState[index] && fields.push(tag));
//     categories.forEach(
//       (cat, index) => catCheckedState[index] && fields.push(cat)
//     );
//     canSave &&
//       dispatch(
//         productUpdated({
//           prodCode,
//           name,
//           description,
//           listPrice,
//           discPrice,
//           fields,
//         })
//       );
//     navigate(`/products/${prodCode}`);
//   };

//   const canSave = name && description && listPrice && discPrice;

//   const onCancelClicked = () => navigate(-1);

//   return (
//     <EditProductFormBody
//       prodCode={prodCode}
//       name={name}
//       onNameChanged={onNameChanged}
//       description={description}
//       onDescChanged={onDescChanged}
//       listPrice={listPrice}
//       onListPriceChanged={onListPriceChanged}
//       discPrice={discPrice}
//       onDiscPriceChanged={onDiscPriceChanged}
//       onSaveProductClicked={onSaveProductClicked}
//       onCancelClicked={onCancelClicked}
//       colors={colors}
//       colorValues={colorCheckedState}
//       onColorsChanged={onColorsChanged}
//       sizes={sizes}
//       sizeValues={sizeCheckedState}
//       onSizesChanged={onSizesChanged}
//       tags={tags}
//       tagValues={tagCheckedState}
//       onTagsChanged={onTagsChanged}
//       categories={categories}
//       catValues={catCheckedState}
//       onCatsChanged={onCatsChanged}
//     />
//   );
// };

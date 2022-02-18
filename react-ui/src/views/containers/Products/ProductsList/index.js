import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CogIcon } from "@heroicons/react/outline";

import {
  SimpleTable,
  SelectColumnFilter,
  OptionsCell,
} from "../../../components/Tables/SimpleTable";
import {
  fetchProducts,
  selectAllProducts,
} from "../../../../stores/slices/productSlice";

const processFields = (fields, selector) => {
  const fieldValues = [];
  Boolean(fields) &&
    fields
      .filter((field) => field.fieldName === selector)
      .forEach((field) => fieldValues.push(field.fieldValue));
  return fieldValues.length
    ? fieldValues.join(", ")
    : `No ${selector.toLowerCase()}s`;
};

export const ProductsTable = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Product Code",
        accessor: "modelCode",
        Cell: (e) => (
          <Link
            to={`/sm/products/${e.value}`}
            className="hover:text-gray-700 hover:underline"
          >
            {e.value}
          </Link>
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      // {
      //   Header: "Category",
      //   accessor: "",
      //   Cell: (e) => processFields(e.value, "Category"),
      // },
      {
        Header: "Color",
        accessor: "productFields",
        Cell: (e) => processFields(e.value, "COLOUR"),
      },
      {
        Header: "Size",
        accessor: "",
        // Cell: (e) => processFields(e.value, "Size"),
      },
      {
        Header: "List Price",
        accessor: "price",
        Cell: (e) => `$${e.value}`,
      },
      {
        Header: "Available",
        accessor: "available",
        Cell: (e) => (e.value ? "Yes" : "No"),
      },
      // {
      //   Header: CogIcon,
      //   accessor: "accessor",
      //   Cell: OptionsCell({
      //     options: [
      //       {
      //         name: "Delete",
      //         navigate: "/products",
      //       },
      //     ],
      //   }),
      // },
    ],
    []
  );
  const dispatch = useDispatch();
  const data = useSelector(selectAllProducts);
  const prodStatus = useSelector((state) => state.products.status);
  useEffect(() => {
    prodStatus === "idle" && dispatch(fetchProducts());
  }, [prodStatus, dispatch]);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export const ProductsList = () => {
  return <ProductsTable />;
};

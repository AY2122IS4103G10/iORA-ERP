import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CogIcon } from "@heroicons/react/outline";
import { TailSpin } from "react-loader-spinner";
import {
  SimpleTable,
  OptionsCell,
  SelectColumnFilter,
} from "../../../components/Tables/SimpleTable";
import {
  fetchProducts,
  selectAllProducts,
} from "../../../../stores/slices/productSlice";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export const ProductsTable = ({ data }) => {
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
        width: 300,
      },
      {
        Header: "Color",
        width: 208,
        accessor: (row) =>
          row.productFields
            .filter((field) => field.fieldName === "COLOUR")
            .map((field) => field.fieldValue)
            .join(", "),
        Cell: (e) => (
          <div className="text-ellipsis overflow-hidden">{e.value}</div>
        ),
      },
      {
        Header: "Size",
        width: 130,
        accessor: (row) =>
          row.productFields
            .filter((field) => field.fieldName === "SIZE")
            .map((field) => field.fieldValue)
            .join(", "),
        Cell: (e) => (
          <div className="text-ellipsis overflow-hidden">{e.value}</div>
        ),
      },
      {
        Header: "List Price",
        accessor: "price",
        width: 120,
        Cell: (e) => `$${e.value}`,
      },
      {
        Header: "Available",
        accessor: "available",
        width: 100,
        Cell: (e) => (e.value ? "Yes" : "No"),
      },
      {
        Header: (
          <div className="flex items-center">
            <CogIcon className="h-4 w-4" />
          </div>
        ),
        accessor: "accessor",
        width: 80,
        disableSortBy: true,
        Cell: OptionsCell({
          options: [
            {
              name: "Delete",
              navigate: "/products",
            },
          ],
        }),
      },
    ],
    []
  );
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable columns={columns} data={data} flex={true} />
      </div>
    </div>
  );
};

export const ProductsList = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectAllProducts);
  const prodStatus = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  useEffect(() => {
    prodStatus === "idle" && dispatch(fetchProducts());
  }, [prodStatus, dispatch]);

  let content;

  if (prodStatus === "loading") {
    content = (
      <div className="items-center">
        <TailSpin color="#00BFFF" height={50} width={50} />
      </div>
    );
  } else if (prodStatus === "succeeded") {
    content = <ProductsTable data={data} />;
  } else {
    content = <div>{error}</div>;
  }
  return content;
};

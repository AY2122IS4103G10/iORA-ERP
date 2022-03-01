import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { SimpleTable } from "../../../components/Tables/SimpleTable";
import {
  fetchProducts,
  selectAllProducts,
} from "../../../../stores/slices/productSlice";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export const ProductsTable = ({ data, handleOnClick }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Product Code",
        accessor: "modelCode",
      },
      {
        Header: "Name",
        accessor: "name",
        width: 300,
      },
      {
        Header: "Color",
        width: 278,
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
        width: 110,
        Cell: (e) => (e.value ? "Yes" : "No"),
      },
      // {
      //   Header: (
      //     <div className="flex items-center">
      //       <CogIcon className="h-4 w-4" />
      //     </div>
      //   ),
      //   accessor: "accessor",
      //   width: 80,
      //   disableSortBy: true,
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
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable
          columns={columns}
          data={data}
          flex={true}
          handleOnClick={handleOnClick}
        />
      </div>
    </div>
  );
};

export const ProductsList = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectAllProducts);
  const prodStatus = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  const handleOnClick = (row) => navigate(`${pathname}/${row.original.modelCode}`);

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
    content = <ProductsTable data={data} handleOnClick={handleOnClick} />;
  } else {
    content = <div>{error}</div>;
  }
  return content;
};

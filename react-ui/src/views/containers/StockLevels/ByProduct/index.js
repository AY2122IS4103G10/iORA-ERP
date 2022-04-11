import { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectAllProducts,
} from "../../../../stores/slices/productSlice";
import { SectionHeading } from "../../../components/HeadingWithTabs";
import { SelectableTable } from "../../../components/Tables/SelectableTable";

const columns = [
  {
    Header: "Product Code",
    accessor: "modelCode",
  },
  {
    Header: "SKU",
    accessor: "sku",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Color",
    accessor: (row) =>
      row.productFields.find((field) => field.fieldName === "COLOUR")
        .fieldValue,
  },
  {
    Header: "Size",
    accessor: (row) =>
      row.productFields.find((field) => field.fieldName === "SIZE").fieldValue,
  },
];

export const ProductTable = (subsys) => {
  const dispatch = useDispatch();
  const data = useSelector(selectAllProducts);
  const prodStatus = useSelector((state) => state.products.status);

  const products = data.flatMap((model) =>
    model.products.map((product) => ({
      ...product,
      name: model.name,
      modelCode: model.modelCode
    }))
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const path = "/" + subsys.subsys.subsys + "/stocklevels/products";
  return prodStatus === "loading" ? (
    <div className="flex mt-5 items-center justify-center">
      <TailSpin color="#00BFFF" height={20} width={20} />
    </div>
  ) : (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SelectableTable columns={columns} data={products} path={path} />
      </div>
    </div>
  );
};

export const ProductStocks = (subsys) => {
  let tabs = [
    {
      name: "My Site",
      href: `/${subsys.subsys}/stocklevels/my`,
      current: false,
    },
    {
      name: "By Sites",
      href: `/${subsys.subsys}/stocklevels/sites`,
      current: false,
    },
    {
      name: "By Products",
      href: `/${subsys.subsys}/stocklevels/products`,
      current: true,
    },
  ];

  if (subsys.subsys === "sm") {
    tabs = tabs.slice(1);
  }

  return (
    <>
      <SectionHeading header="Stock Levels" tabs={tabs} />
      <ProductTable subsys={subsys} />
    </>
  );
};

import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getASiteStock,
  selectCurrSiteStock,
} from "../../../../stores/slices/stocklevelSlice";
import {
  selectUserSite,
  updateCurrSite,
} from "../../../../stores/slices/userSlice";
import {
  SelectableTable,
  SelectColumnFilter,
} from "../../../components/Tables/SelectableTable";
import { SectionHeading } from "../../../components/HeadingWithTabs";
import { useState } from "react";
import { fetchAllModelsBySkus } from "../../StockTransfer/StockTransferForm";
import { TailSpin } from "react-loader-spinner";

export const MyStoreStock = (subsys) => {
  const id = useSelector(selectUserSite); //get current store/site user is in
  const dispatch = useDispatch();
  const siteStock = useSelector(selectCurrSiteStock);
  const stockStatus = useSelector((state) => state.stocklevel.status);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(updateCurrSite());
    dispatch(getASiteStock(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (siteStock?.products) {
      setLoading(true);
      fetchAllModelsBySkus(siteStock.products).then((data) => {
        setData(
          siteStock.products.map((item, index) => ({
            ...item,
            product: {
              ...item.product,
              modelCode: data[index].modelCode,
              name: data[index].name,
              description: data[index].description,
              imageLinks: data[index].imageLinks,
            },
          }))
        );
        setLoading(false);
      });
    }
  }, [siteStock?.products]);

  const tabs = [
    {
      name: "My Site",
      href: `/${subsys.subsys}/stocklevels/my`,
      current: true,
    },
    {
      name: "By Sites",
      href: `/${subsys.subsys}/stocklevels/sites`,
      current: false,
    },
    {
      name: "By Products",
      href: `/${subsys.subsys}/stocklevels/products`,
      current: false,
    },
  ];

  const EditStockButton = () => {
    return (
      <Link to={`/${subsys.subsys}/stocklevels/edit`}>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          Edit Stock
        </button>
      </Link>
    );
  };

  const path = `/${subsys.subsys}/stocklevels/my`;

  const columns = useMemo(
    () => [
      {
        Header: "SKU",
        accessor: "sku",
      },
      {
        Header: "Name",
        accessor: "product.name",
      },
      {
        Header: "Colour",
        accessor: (row) => {
          return row.product.productFields.find(
            (field) => field.fieldName === "COLOUR"
          ).fieldValue;
        },
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Size",
        accessor: (row) => {
          return row.product.productFields.find(
            (field) => field.fieldName === "SIZE"
          ).fieldValue;
        },
        Filter: SelectColumnFilter,
        filter: "includes",
      },

      {
        Header: "Qty",
        accessor: "qty",
      },
      // {
      //   Header: "",
      //   accessor: "accessor",
      //   disableSortBy: true,
      //   Cell: (e) => {
      //     return (
      //       <div>
      //         <button
      //           type="button"
      //           className="px-3 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
      //         >
      //           Edit Qty
      //         </button>
      //       </div>
      //     );
      //   }
      // }
    ],
    []
  );

  return (
    <>
      <SectionHeading
        header="Stock Levels"
        tabs={tabs}
        button={<EditStockButton />}
      />
      {stockStatus === "loading" || loading ? (
        <div className="flex mt-5 items-center justify-center">
          <TailSpin color="#00BFFF" height={20} width={20} />
        </div>
      ) : (
        Boolean(siteStock) && (
          <div className="min-h-full">
            <main className="py-8 ml-2">
              <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
                <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                  {/* Stock Levels*/}
                  <section aria-labelledby="stocks-level">
                    <div className="ml-2 mr-2">
                      <SelectableTable
                        columns={columns}
                        data={data}
                        path={path}
                      />
                    </div>
                  </section>
                </div>
              </div>
            </main>
          </div>
        )
      )}
    </>
  );
};

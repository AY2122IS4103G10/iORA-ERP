import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { api } from "../../../../environments/Api";

import { getProductStockLevel, selectAProduct, selectProductSL } from "../../../../stores/slices/productSlice";
import { getAProduct } from "../../../../stores/slices/productSlice";
import { getAllSites, selectAllSites } from "../../../../stores/slices/siteSlice";
import { SelectableTable } from "../../../components/Tables/SelectableTable";

const columns =[
  {
      Header: "Site Code", 
      accessor: "siteCode"
  }, 
  {
      Header: "Name", 
      accessor: "siteName"
  },
  {
      Header: "Quantity", 
      accessor: "qty",
  // },
  // {
  //     Header: "Reserved",
  //     accessor: "reserve"
  }
]

function convertData(data, sites) {
  return Object.entries(data).map((pair) => ({
    id: pair[0],
    siteCode: sites.filter(site => site.id == pair[0])[0].siteCode,
    siteName: sites.filter(site => site.id == pair[0])[0].name,
    qty: pair[1],
  }))
}


export const AProductStock = (subsys) => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const prod = useSelector(selectAProduct);
  const stockLevel = useSelector(selectProductSL);
  const sites = useSelector(selectAllSites);

  useEffect(() => {
      dispatch(getAProduct(id));
      dispatch(getProductStockLevel(id));
      dispatch(getAllSites());
  }, []);

  const path = "/" + subsys.subsys.subsys + "/stocklevels";
  
  return(
      <div className="min-h-full">
      <main className="py-10">
        {/* Page header */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="relative">
                <span className="absolute inset-0 shadow-inner rounded-full" aria-hidden="true" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{prod != null ? prod.sku : "loading"}</h1>
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            {/* Product information*/}
            <section aria-labelledby="applicant-information-title">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 id="applicant-information-title" className="text-lg leading-6 font-medium text-gray-900">
                    Product Information
                  </h2>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">SKU</dt>
                      <dd className="mt-1 text-sm text-gray-900">{prod != null ? prod.sku : "loading"}</dd>
                    </div>
                    {prod != null && prod.productFields != null ? (
                      prod.productFields.map((field) => {
                        return (
                          <div key={field.id}className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">{field.fieldName}</dt>
                            <dd className="mt-1 text-sm text-gray-900">{field.fieldValue}</dd>
                          </div>
                          );
                      })
                    ) : ""}
                  </dl>
                </div>
              </div>
            </section>

            {/* Stock Levels By Products*/}
            <section aria-labelledby="stocks-level">
                <div className="m-1">
                {sites.length == 0 || stockLevel == undefined ? <p>loading</p> : 
                  <SelectableTable columns={columns} data={convertData(stockLevel, sites)} path={path}/>
                }
                </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
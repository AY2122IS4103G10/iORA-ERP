import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { selectUserStore } from "../../../../stores/slices/userSlice";
import { selectCurrSiteStock } from "../../../../stores/slices/stocklevelSlice";
import { useParams } from "react-router-dom";
import { SimpleTable } from "../../../components/Tables/SimpleTable";
import { fetchModel, selectModel } from "../../../../stores/slices/productSlice";



export const getProductItem = (data, sku) => {
    return data.productItems.filter((item) => item.productSKU == sku.trim());
}

const columns = [
    {
        Header: "RFID Tag",
        accessor: "rfid",
    },
    {
        id: 'available',
        Header: "Available",
        accessor: row => row.available.toString().toUpperCase()
    },
]

export const EditStockLevelButton = () => {

    const handleAddStock = () => {

    }

    return (
        <button 
        type="button"
        className="inline-flex items-center mr-3 px-2.5 py-1.5 border border-transparent text-sm leading-4 
        font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        onClick={() => handleAddStock()}>
            Add Stock 
        </button>
    );
}



export const StockLevelForm = () => {
    const {id} = useParams(); //sku code
    const siteId = useSelector(selectUserStore); //get current store/site user is in
    const dispatch = useDispatch();
    const siteStock = useSelector(selectCurrSiteStock);
    
    //get product information
    const modelCode = id.slice(0,-2);
    const model = useSelector(selectModel);
    if (model != null) {
        // console.log(model.products.filter((prod) => prod.sku == id.trim())[0].productFields);
        model.products.filter((prod) => prod.sku == id)[0].productFields.map((field) => {
            // console.log(field);
            // console.log(field.fieldName);
            // console.log(field.fieldValue);
        })
    }

    //===UNCOMMENT WHEN STOCK LEVEL IS ADDED=====
    useEffect(() => {
    // dispatch(getASiteStock(id)); 
        dispatch(fetchModel(modelCode));
    }, [])

    return (
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
                <h1 className="text-2xl font-bold text-gray-900">SKU: {id}</h1>
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
                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{model == null ? "loading" : model.name}</dd>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Price</dt>
                        <dd className="mt-1 text-sm text-gray-900">{model == null ? "" : model.price}</dd>
                      </div>
                      {model != null && model.products != null ? (
                        model.products.filter((prod) => prod.sku == id.trim())[0].productFields.map((field) => {
                          return (
                            <div key={field.id}className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">{field.fieldName}</dt>
                              <dd className="mt-1 text-sm text-gray-900">{field.fieldValue}</dd>
                            </div>
                            );
                        })
                      ) : "" }

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Online Exclusive</dt>
                        <dd className="mt-1 text-sm text-gray-900">{model == null ? "" : model.onlineOnly.toString().toUpperCase()}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Available</dt>
                        <dd className="mt-1 text-sm text-gray-900">{model == null ? "" : model.available.toString().toUpperCase()}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Description</dt>
                        <dd className="mt-1 text-sm text-gray-900">{model == null ? "" : model.description}</dd>
                      </div>


                    </dl>
                  </div>
                </div>
              </section>
  
              {/* Stock Levels By Products*/}
              <section aria-labelledby="stocks-level">
                  <div className="m-1">
                  {siteStock.length == 0 || siteStock == undefined ? <p>loading</p> : 
                    <SimpleTable columns={columns} data={getProductItem(siteStock, id)} headerButton={<EditStockLevelButton/>}/>
                  }
                  </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    );
}
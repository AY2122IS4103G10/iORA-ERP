

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getASite, selectSite } from '../../../../stores/slices/siteSlice';
import { SimpleTable } from '../../../components/Tables/SimpleTable';
import { selectUserStore } from '../../../../stores/slices/userSlice';


const stocklevel = {
    id: 4,
    productItems: [],
    products: {
      "ASK0009968A-1": 1,
      "ASK0009968A-2": 2,
      "ASK0009968A-3": 3, 
    },
    models: {
      "ASK0009968A": 6,
    },
    reserveProducts: {
      "ASK0009968A-1": 1
    }
}

const convertData = (data) => 
  Object.entries(data.products).map((key) => ({
    sku: key[0],
    qty: key[1],
    reserve: data.reserveProducts[key[0]] == null ? 0 : stocklevel.reserveProducts[key[0]],
  }))

const columns = [
  {
    Header: "SKU Code",
    accessor: "sku"
  },
  {
    Header: "Qty",
    accessor: "qty"
  },
  {
    Header: "Reserved Qty",
    accessor: "reserve"
  }
]

const processAddress = (addressObj) => {
  const str = addressObj.city + ", " + addressObj.road + ", " + addressObj.unit + ", " + addressObj.postalCode;
  return str;
}


export const MyStoreStock = () => {
    const id = useSelector(selectUserStore);
    const dispatch = useDispatch();
    const site = useSelector(selectSite);

    useEffect(() => {
      dispatch(getASite(id));
    }, [])

    return(
      <>
      <div className="min-h-full">
          <main className="py-10 ml-2">
            {/* Page header */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
              <div className="flex items-center space-x-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{site != null ? site.name : "loading"}</h2>
                  </div>
              </div>
            </div>

            <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
              <div className="space-y-6 lg:col-start-1 lg:col-span-2">

                {/* Stock Levels*/}
                <section aria-labelledby="stocks-level">
                  <div className="ml-2 mr-2">
                    {stocklevel == undefined ? <p>loading</p> : 
                      <SimpleTable columns={columns} data={convertData(stocklevel)}/>
                    }
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </>
  )
}
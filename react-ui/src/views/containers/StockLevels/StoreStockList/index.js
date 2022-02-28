import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CogIcon } from "@heroicons/react/outline";

import { getASite, selectSite } from '../../../../stores/slices/siteSlice';
import { selectUserStore } from '../../../../stores/slices/userSlice';
import { SelectableTable } from '../../../components/Tables/SelectableTable';
import { selectCurrSiteStock, getASiteStock } from '../../../../stores/slices/stocklevelSlice';

const convertData = (data) => 
  Object.entries(data.products).map((key) => ({
    sku: key[0],
    qty: key[1],
    reserve: data.reserveProducts[key[0]] == null ? 0 : data.reserveProducts[key[0]],
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
  },
  // {
  //   Header: (
  //     <div className="flex items-center">
  //       <CogIcon className="h-4 w-4" />
  //     </div>
  //   ),
  //   id: "edit",
  //   disableSortBy: true,
  //   Cell: ({row}) => {
  //     return (
  //     <Link
  //       className="inline-flex items-center px-2.5 py-1.5 border border-transparent 
  //       text-xs font-medium rounded shadow-sm text-white 
  //       bg-cyan-600 hover:bg-cyan-700 focus:outline-none 
  //       focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
  //       to={`/str/stocklevels/`}
  //     >Edit</Link>
  //     );
  //   }
  // }
]


export const MyStoreStock = (subsys) => {
    const id = useSelector(selectUserStore); //get current store/site user is in
    const dispatch = useDispatch();
    const siteStock = useSelector(selectCurrSiteStock);

    //===UNCOMMENT WHEN STOCK LEVEL IS ADDED=====
    useEffect(() => {
      dispatch(getASiteStock(id)); 
    }, [])
    
    const path = `/${subsys.subsys.subsys}/stocklevels/my`;

    return(
      <>
      <div className="min-h-full">
          <main className="py-10 ml-2">
            {/* Page header */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
              <div className="flex items-center space-x-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Store</h2>
                  </div>
              </div>
            </div>

            <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
              <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                {/* Stock Levels*/}
                <section aria-labelledby="stocks-level">
                  <div className="ml-2 mr-2">
                    {siteStock == undefined ? <p>loading</p> : 
                      <SelectableTable columns={columns} data={convertData(siteStock)} path={path}/>
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
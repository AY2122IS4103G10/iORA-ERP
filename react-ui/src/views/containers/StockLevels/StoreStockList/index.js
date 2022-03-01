import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CogIcon } from "@heroicons/react/outline";

import { getASite, selectSite } from '../../../../stores/slices/siteSlice';
import { selectUserSite } from '../../../../stores/slices/userSlice';
import { SelectableTable } from '../../../components/Tables/SelectableTable';
import { selectCurrSiteStock, getASiteStock } from '../../../../stores/slices/stocklevelSlice';
import { SectionHeading } from '../../../components/HeadingWithTabs';

const convertData = (data) => {
  return Object.entries(data.products).map((key) => ({
    sku: key[0],
    qty: key[1],
    reserve: data.reserveProducts[key[0]] == null ? 0 : data.reserveProducts[key[0]],
  }))
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0
}

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
  const id = useSelector(selectUserSite); //get current store/site user is in
  const dispatch = useDispatch();
  const siteStock = useSelector(selectCurrSiteStock);

  useEffect(() => {
    dispatch(getASiteStock(id));
  }, [id])


  const tabs = [
    { name: 'My Site', href: `/${subsys.subsys}/stocklevels/my`, current: true },
    { name: 'By Sites', href: `/${subsys.subsys}/stocklevels/sites`, current: false },
    { name: 'By Products', href: `/${subsys.subsys}/stocklevels/products`, current: false },
  ]

  const path = `/${subsys.subsys}/stocklevels/my`;

  return (
    <>
      <SectionHeading header="Stock Levels" tabs={tabs} />
      {Boolean(siteStock) && (
        <div className="min-h-full">
          <main className="py-8 ml-2">
            <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
              <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                {/* Stock Levels*/}
                <section aria-labelledby="stocks-level">
                  <div className="ml-2 mr-2">
                    {isObjectEmpty(siteStock) ? <p>loading</p> :
                      <SelectableTable columns={columns} data={convertData(siteStock)} path={path} />
                    }
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  )
}
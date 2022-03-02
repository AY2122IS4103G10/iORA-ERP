import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getASiteStock, selectCurrSiteStock } from '../../../../stores/slices/stocklevelSlice';
import { selectUserSite } from '../../../../stores/slices/userSlice';
import { SelectableTable } from '../../../components/Tables/SelectableTable';


const convertData = (data) => {
  console.log(data);
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
]

export const MyStoreStock = (subsys) => {
  const id = useSelector(selectUserSite); //get current store/site user is in
  const dispatch = useDispatch();
  const siteStock = useSelector(selectCurrSiteStock);
  const status = useSelector((state) => state.stocklevel.status )


  useEffect(() => {
      dispatch(getASiteStock(id));
  }, [dispatch, id])

  const path = `/${subsys.subsys.subsys}/stocklevels/my`;

  return (
    Boolean(siteStock) && (
    <>
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
    </>)
  )
}
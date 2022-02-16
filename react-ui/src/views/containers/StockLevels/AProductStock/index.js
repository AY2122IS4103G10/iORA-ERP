import { useMemo } from "react";


export const getData = () => {
    
}








export const AProductStock = () => {

    const columns = useMemo(
        () => [
            {
                Header: "Site Code", 
                accessor: "siteCode"
            }, 
            {
                Header: "Country", 
                accessor: "country"
            },
            {
                Header: "Quantity", 
                accessor: "qty",
            },
            {
                Header: "Reserved",
                accessor: "reserve"
            }
        ]
    )

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
                <h1 className="text-2xl font-bold text-gray-900">Product Name</h1>
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
                        <dd className="mt-1 text-sm text-gray-900"></dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Price</dt>
                        <dd className="mt-1 text-sm text-gray-900"></dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Categories</dt>
                        <dd className="mt-1 text-sm text-gray-900"></dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Tags</dt>
                        <dd className="mt-1 text-sm text-gray-900"></dd>
                      </div>
                      
                    </dl>
                  </div>
                  
                </div>
              </section>

              {/* Stock Levels By Products*/}
              <section aria-labelledby="stocks-level">
                  <div className="m-1">
                  {/* <SimpleTable columns={columns} data={data}/> */}
                  </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    );
}
import { Fragment } from 'react'

import { Menu, Popover, Transition } from '@headlessui/react'
import {
  ArrowNarrowLeftIcon,
  CheckIcon,
  HomeIcon,
  PaperClipIcon,
  QuestionMarkCircleIcon,
  SearchIcon,
  ThumbUpIcon,
  UserIcon,
} from '@heroicons/react/solid'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

import { Header } from "../../../components/Header";

import { useMemo } from 'react';
import { SimpleTable } from '../../../components/Tables/SimpleTable';

const site = {
  name: 'iORA Compass One',
  address: '1 Sengkang Square #01-10, Compass One, 545078',
  siteCode: "IORA001",
  company: "IORA",
  phone: "+65 6242 0323"
}


    const data = [
        {
            id: 1,
            productCode: "SKU1231",
            name: "Sky Blue V-neck Top",
            qty: 100,
            reserved: 5,
            inTransit: 8,

        },
        {
            id: 2, 
            productCode: "SKU4321",
            name: "Black Blue V-neck Top",
            qty: 100,
            reserved: 5,
            inTransit: 8,
        }
    ];

    const columns = [
        {
            Header: "Product Code", 
            accessor: "productCode"
        }, 
        {
            Header: "Name", 
            accessor: "name"
        },
        {
            Header: "Quantity", 
            accessor: "qty",
        },
        {
            Header: "Reserved",
            accessor: "reserved",
        },
    ];

export const AsiteStock = () => {

    return(
    <>
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
                <h1 className="text-2xl font-bold text-gray-900">{site.name}</h1>
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
            <div className="space-y-6 lg:col-start-1 lg:col-span-2">
              {/* Description list*/}
              <section aria-labelledby="applicant-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2 id="applicant-information-title" className="text-lg leading-6 font-medium text-gray-900">
                      Site Information
                    </h2>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Site Code</dt>
                        <dd className="mt-1 text-sm text-gray-900">{site.siteCode}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Company</dt>
                        <dd className="mt-1 text-sm text-gray-900">{site.company}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                        <dd className="mt-1 text-sm text-gray-900">{site.address}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-sm text-gray-900">{site.phone}</dd>
                      </div>
                      
                    </dl>
                  </div>
                  
                </div>
              </section>

              {/* Stock Levels*/}
              <section aria-labelledby="stocks-level">
                <h2 className="m-2 text-lg leading-6 font-bold text-gray-900">
                      Stock Levels
                </h2>
                <div className="ml-2 mr-2">
                  <SimpleTable columns={columns} data={data}/>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
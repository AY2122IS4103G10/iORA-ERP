import { useMatch, Route, Routes, Link } from "react-router-dom";
import { useState } from "react";

import { SiteStocks } from "../BySite";
import { ProductStocks } from "../ByProduct";
import {SiteStock} from "../ASiteStock";

const tabs = [
    { name: 'By Site', href: '', current: true},
    { name: 'By Products', href: 'products', current: false},
  ]
  
function classNames(...classes) {
return classes.filter(Boolean).join(' ')
}


export const SectionHeading = () => {

    const [firstTab, setFirstTab] = useState(true);  

    function changeTab(e) {
        console.log("changetab");
        setFirstTab(!firstTab);
        if (firstTab) {
            tabs[0].current = true;
            tabs[1].current = false;
        } else {
            tabs[0].current = false;
            tabs[1].current = true;
        }

    }

    return (
        <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div className="pt-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
        <div className="pb-5 border-b border-gray-200 sm:pb-0">
            <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                Stock Levels
            </h1>
            <div className="mt-3 ml-3 sm:mt-4">
               
            <div className="sm:block">
                <nav className="-mb-px flex space-x-8">
                    <Link
                        key={tabs[0].name}
                        to={tabs[0].href}
                        className={classNames(
                        tabs[0].current
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm'
                        )}
                        aria-current={tabs[0].current ? 'page' : undefined}
                        onClick={changeTab}
                    >
                        {tabs[0].name}
                    </Link>

                    <Link
                        key={tabs[1].name}
                        to={tabs[1].href}
                        className={classNames(
                        tabs[1].current
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm'
                        )}
                        aria-current={tabs[1].current ? 'page' : undefined}
                        onClick={changeTab}
                    >
                        {tabs[1].name}
                    </Link>
                    
                </nav>
            </div>
        </div>
        </div>
        </div>
        </div>
        </div>
    );
}

export const ViewStockLevels = () => {

    return (
      <>
        <SectionHeading/>
        <Routes>
            <Route path="/" element={<SiteStocks/>}/>
            <Route path="products" element={<ProductStocks/>}/>
            <Route path=":id" element={<SiteStock/>} />
        </Routes>
      </>
    );
  }
import { useMatch, Route, Routes, Link } from "react-router-dom";
import { useState } from "react";

import { SiteStocks } from "../BySite";
import { ProductStocks } from "../ByProduct";
import { ASiteStock } from "../ASiteStock";
import { Tabs } from "../../../components/Tabs";
import { SectionHeading } from "../../../components/HeadingWithTabs";

const tabs = [
    { name: 'By Site', href: '', current: true},
    { name: 'By Products', href: 'products', current: false},
  ]
  
// function classNames(...classes) {
// return classes.filter(Boolean).join(' ')
// }


// export const SectionHeading = () => {

//     return (
//         <div className="bg-white shadow">
//         <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
//         <div className="pt-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
//         <div className="pb-5 border-b border-gray-200 sm:pb-0">
//             <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
//                 Stock Levels
//             </h1>
//             <div className="mt-3 ml-3 sm:mt-4">
//                 <Tabs tabs={tabs}/>
//             </div>
//         </div>
//         </div>
//         </div>
//         </div>
//     );
// }


export const ViewStockLevels = () => {

    return (
      <>
        <SectionHeading header="Stock Levels" tabs={tabs}/>
        <Routes>
            <Route path="/" element={<SiteStocks/>}/>
            <Route path="products" element={<ProductStocks/>}/>
            <Route exact path="stocklevels/:id" element={<ASiteStock/>} />
        </Routes>
      </>
    );
  }
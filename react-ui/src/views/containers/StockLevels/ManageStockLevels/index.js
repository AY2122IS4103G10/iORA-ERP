import { useMatch, Route, Routes, Link } from "react-router-dom";
import { useState } from "react";

import { SiteStocks } from "../BySite";
import { ProductStocks } from "../ByProduct";
import { AsiteStock } from "../ASiteStock";
import { AProductStock } from "../AProductStock";
import { SectionHeading } from "../../../components/HeadingWithTabs";

const tabs = [
    { name: 'By Site', href: 'sites', current: true},
    { name: 'By Products', href: 'products', current: false},
  ]


export const ViewStockLevels = (subsys) => {

    return (
      <>
        <SectionHeading header="Stock Levels" tabs={tabs}/>
        <Routes>
            <Route path="sites" element={<SiteStocks subsys={subsys}/>}/>
            <Route path="products" element={<ProductStocks subsys={subsys}/>}/>
            <Route path=":id" element={<AsiteStock/>} />
            <Route path="products/:id" element={<AProductStock subsys={subsys}/>}/>
        </Routes>
      </>
    );
  }
import { Route, Routes } from "react-router-dom";

import { SiteStocks } from "../BySite";
import { ProductStocks } from "../ByProduct";
import { AsiteStock } from "../ASiteStock";
import { AProductStock } from "../AProductStock";
import { MyStoreStock } from "../MyStoreStock";
import { SectionHeading } from "../../../components/HeadingWithTabs";

const tabs = [
    { name: 'My Store', href: 'my', current: true},
    { name: 'By Sites', href: 'sites', current: true},
    { name: 'By Products', href: 'products', current: false},
  ]

export const ViewStoreStock = () => {

    return (
      <>
        <SectionHeading header="Stock Levels" tabs={tabs}/>
        <Routes>
            <Route path="my" element={<MyStoreStock/>} />
            <Route path="sites" element={<SiteStocks subsys="str"/>}/>
            <Route path="products" element={<ProductStocks subsys="str"/>}/>
            <Route path=":id" element={<AsiteStock/>} />
            <Route path="products/:id" element={<AProductStock subsys="str"/>}/>
        </Routes>
      </>
    );
  }
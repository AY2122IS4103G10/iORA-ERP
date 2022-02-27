import { Route, Routes } from "react-router-dom";

import { SiteStocks } from "../BySite";
import { ProductStocks } from "../ByProduct";
import { AsiteStock } from "../ASiteStock";
import { AProductStock } from "../AProductStock";
import { MyStoreStock } from "../StoreStockList";
import { SectionHeading } from "../../../components/HeadingWithTabs";
import { StockLevelForm } from "../StockLevelForm";

const tabs = [
    { name: 'My Store', href: 'my', current: true},
    { name: 'By Sites', href: 'sites', current: true},
    { name: 'By Products', href: 'products', current: false},
  ]

export const ViewStoreStock = (subsys) => {

    return (
      <>
        <SectionHeading header="Stock Levels" tabs={tabs}/>
        <Routes>
            <Route path="my/:id" element={<StockLevelForm/>} />
            <Route path="my" element={<MyStoreStock subsys={subsys}/>} />
            <Route path="sites" element={<SiteStocks subsys={subsys}/>}/>
            <Route path="products" element={<ProductStocks subsys={subsys}/>}/>
            <Route path=":id" element={<AsiteStock/>} />
            <Route path="products/:id" element={<AProductStock subsys={subsys}/>}/>
        </Routes>
      </>
    );
  }
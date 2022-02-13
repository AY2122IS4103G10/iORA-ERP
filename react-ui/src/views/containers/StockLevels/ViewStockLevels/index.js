import { useMatch, Route, Routes } from "react-router-dom";
import { Header } from "../../../components/Header";
import { SiteStocks } from "../BySite";
import { ProductStocks } from "../ByProduct";

const tabs = [
    { name: 'By Site', href: '#', current: true },
    { name: 'By Products', href: 'stocklevels/products', current: false },
  ]
  
function classNames(...classes) {
return classes.filter(Boolean).join(' ')
}

//tabs are buggy
export const SectionHeading = () => {

    const changeTab = (e) => {
        console.log("changetab");
        tabs.map(tab => 
            tab.name == e.target.value ? {...tab, current: true} : {...tab, current: false
            });
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
                <div className="sm:hidden">
                <label htmlFor="current-tab" className="sr-only">
                    Select a tab
                </label>
                <select
                    id="current-tab"
                    name="current-tab"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={tabs.find((tab) => tab.current).name}
                    onChange={changeTab}
                >
                    {tabs.map((tab) => (
                    <option value={tab.name} key={tab.name}>{tab.name}</option>
                    ))}
                </select>
            </div>
            <div className="hidden sm:block">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                    <a
                        key={tab.name}
                        href={tab.href}
                        className={classNames(
                        tab.current
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm'
                        )}
                        aria-current={tab.current ? 'page' : undefined}
                    >
                        {tab.name}
                    </a>
                    ))}
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
        {/* <Header title={"Stock Levels"}/>
        <Tabs tabs={tabs}/> */}
        <SectionHeading/>
        <Routes>
            <Route path="/" element={<SiteStocks/>}/>
            <Route path="products" element={<ProductStocks/>}/>
        </Routes>
      </>
    );
  }
import { Tabs } from "../Tabs";


export const SectionHeading = ({header, tabs, button}) => {
    
    return (
        <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div className="pt-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
        <div className="pb-5 sm:pb-0">
            <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                {header}
            </h1>
            <div className="mt-6 ml-3 sm:mt-7">
                <Tabs tabs={tabs}/>
            </div>
        </div>
        <div className="flex justify-end">
                {button}
            </div>
        </div>
        </div>
        </div>
    )
}


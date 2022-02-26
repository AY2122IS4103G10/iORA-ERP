
export const Header = ({title}) => {
    return (
        <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
            <div className="flex-1 min-w-0">
                <div className="flex items-center">
                <div>
                    <div className="flex items-center">
                    <img
                        className="h-16 w-16 rounded-full sm:hidden"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
                        alt=""
                    />
                    <h1 className="ml-10 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                        {title}
                    </h1>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}
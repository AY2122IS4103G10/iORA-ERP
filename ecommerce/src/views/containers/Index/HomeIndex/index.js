import {Link} from "react-router-dom";


export const HomeIndex = () => {

    return (
        <div className="relative bg-gray-900">
        {/* Decorative image and overlay */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <img
            src="https://iora.online/sg/wp-content/uploads/iORA-Stories-2021-New-JPEG.jpg"
            alt=""
            className="w-full h-full object-center object-cover"
          />
        </div>
        <div className="relative max-w-3xl mx-auto py-32 px-6 flex flex-col items-center text-center sm:py-64 lg:px-0">
            <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">iORA</h1>
            <p className="mt-4 text-xl text-white">
                Quality basic wear with a tweak in updated styles that suits a modern woman's lifestyle
            </p>
            <Link
                to="#"
                className="mt-8 inline-block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-gray-900 hover:bg-gray-100"
            >
                Shop Now
            </Link>
        </div>
        </div>
    )

}
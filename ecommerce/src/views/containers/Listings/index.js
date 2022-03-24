import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings, selectListings } from "../../../stores/slices/listingSlice";

export const Listings = () => {
    const { tag } = useParams();
    const { line } = useParams();
    const dispatch = useDispatch();
    const listings = useSelector(selectListings);
    console.log(tag);
    console.log(line);

    useEffect(() => {
        dispatch(fetchListings({ line: line, tag: tag }));
    }, [dispatch, line, tag]);

    return (
        <main>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="py-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{line.toUpperCase() + ' ' + (tag === undefined ? '' : tag?.toUpperCase())}</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-base text-gray-500">
                        Thoughtfully designed outfits for the workspace, home, and travel.
                    </p>
                </div>
                {/* Product grid */}
                {listings === null ? <p>loading</p> :
                    <section aria-labelledby="products-heading" className="mt-8">
                        <h2 id="products-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                            {listings.map((model) => (
                                <Link key={model.modelCode} to={`/products/view/${model.modelCode}`} className="group">
                                    <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-3">
                                        <img
                                            src="https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-02.jpg"
                                            alt="image"
                                            className="w-full h-full object-center object-cover group-hover:opacity-75"
                                        />
                                    </div>
                                    <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                                        <h3>{model.name}</h3>
                                        <p>${model.listPrice}</p>
                                    </div>
                                    <p className="mt-1 text-sm italic text-gray-500">{model.description}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                }
            </div>
        </main>
    )
}
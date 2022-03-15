import { useParams } from "react-router-dom";

export const Listings = () => {
    const { category } = useParams();
    const { line } = useParams();
    console.log(category);
    console.log(line);
    return (
        <main>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="py-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{line.toUpperCase() + ' ' + (category === undefined ? '' : category?.toUpperCase())}</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-base text-gray-500">
                        Thoughtfully designed outfits for the workspace, home, and travel.
                    </p>
                </div>
                {/* Product grid */}
                <section aria-labelledby="products-heading" className="mt-8">
                    <h2 id="products-heading" className="sr-only">
                        Products
                    </h2>

                    {/* <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
                        {products1.map((product) => (
                            <Link key={product.id} href={product.href} className="group">
                                <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-3">
                                    <img
                                        src={product.imageSrc}
                                        alt={product.imageAlt}
                                        className="w-full h-full object-center object-cover group-hover:opacity-75"
                                    />
                                </div>
                                <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                                    <h3>{product.name}</h3>
                                    <p>{product.price}</p>
                                </div>
                                <p className="mt-1 text-sm italic text-gray-500">{product.description}</p>
                            </Link>
                        ))}
                    </div> */}
                </section>
            </div>
        </main>
    )
}
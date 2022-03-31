import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchListings,
  selectListings,
} from "../../../stores/slices/listingSlice";
import { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { SimplePaginator } from "../../components/Pagination/SimplePaginator";

export const Listings = () => {
  const { tag } = useParams();
  const { line } = useParams();
  const dispatch = useDispatch();
  const listings = useSelector(selectListings);
  const listingStatus = useSelector((state) => state.listing.status);
  //   console.log(tag);
  //   console.log(line);

  useEffect(() => {
    dispatch(fetchListings({ line: line, tag: tag }));
  }, [dispatch, line, tag]);

  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage] = useState(40);

  const indexOfLastPost = currentPage * listingsPerPage;
  const indexOfFirstPost = indexOfLastPost - listingsPerPage;
  const currentListings =
    Boolean(listings) && listings.slice(indexOfFirstPost, indexOfLastPost);

  const paginateFront = () => setCurrentPage(currentPage - 1);
  const paginateBack = () => setCurrentPage(currentPage + 1);
  const paginate = (page) => setCurrentPage(page);

  return (
    <main>
      <div>
        <div className="max-w-3xl mx-auto mb-10 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="py-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              {line.toUpperCase() +
                " " +
                (tag === undefined ? "" : tag?.toUpperCase())}
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-base text-gray-500">
              Thoughtfully designed outfits for the workspace, home, and travel.
            </p>
          </div>
          {/* Product grid */}
          {listingStatus === "loading" ? (
            <div className="flex mt-5 items-center justify-center">
              <TailSpin color="#111827" height={20} width={20} />
            </div>
          ) : (
            listingStatus === "succeeded" && (
              <div>
                <section aria-labelledby="products-heading" className="mt-8">
                  <h2 id="products-heading" className="sr-only">
                    Products
                  </h2>

                  <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                    {currentListings.length ? (
                      currentListings.map((model) => (
                        <Link
                          key={model.modelCode}
                          to={`/products/view/${model.modelCode}`}
                          className="group"
                        >
                          <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-3">
                            <img
                              src={model.imageLinks[0]}
                              alt="image"
                              className="w-full h-full object-center object-cover group-hover:opacity-75"
                            />
                          </div>
                          <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                            <h3>{model.name}</h3>
                            <div>
                              {model.listPrice !== model.discountPrice ? (
                                <>
                                  <span className="line-through text-sm mr-2 text-gray-500">
                                    ${model.listPrice}
                                  </span>
                                  <span>${model.discountPrice}</span>
                                </>
                              ) : (
                                <span>${model.listPrice}</span>
                              )}
                            </div>
                          </div>
                          <p className="mt-1 text-sm italic text-gray-500">
                            {model.description}
                          </p>
                        </Link>
                      ))
                    ) : (
                      <div className="flex justify-between text-center">
                        {/* <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400"/> */}
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No listings.
                        </h3>
                      </div>
                    )}
                  </div>
                </section>
                <SimplePaginator
                  itemsPerPage={listingsPerPage}
                  totalItems={listings?.length}
                  paginateBack={paginateBack}
                  paginateFront={paginateFront}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
};

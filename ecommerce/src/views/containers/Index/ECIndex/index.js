import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Outlet, useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import {
  logout,
  selectUserLoggedIn,
} from "../../../../stores/slices/userSlice";
import { NavBar } from "../../../components/NavBar";

const navigation = {
  categories: [
    {
      id: "Sale",
      name: "Sale",
      items: [{ name: "Sales", href: "" }],
    },
    {
      id: "iORA",
      name: "iORA",
      items: [
        { name: "New Arrivals", href: "" },
        { name: "Tops", href: "products/iora/tops" },
        { name: "Bottoms", href: "products/iora/bottoms" },
        { name: "Skirts", href: "products/iora/skirts" },
        { name: "Dresses / One Piece", href: "products/iora/dress" },
        { name: "Knits & Sweaters", href: "products/iora/knits" },
        { name: "Outerwear", href: "products/iora/outerwear" },
        { name: "Office Wear", href: "products/iora/officewear" }, //cat
        { name: "Browse All", href: "products/iora" },
      ],
    },
    {
      id: "LALU",
      name: "LALU",
      items: [
        { name: "New Arrivals", href: "" },
        { name: "Tops", href: "products/lalu/tops" },
        { name: "Bottoms", href: "products/lalu/bottoms" },
        { name: "Skirts", href: "products/lalu/skirts" },
        { name: "Dresses / One Piece", href: "products/lalu/dress" },
        { name: "Knits & Sweaters", href: "products/lalu/knits" },
        { name: "Outerwear", href: "products/lalu/outerwear" },
        { name: "Denim", href: "products/lalu/denim" }, //cat
        { name: "Browse All", href: "products/lalu" },
      ],
    },
    {
      id: "SORA",
      name: "SORA",
      items: [
        { name: "Bags", href: "products/sora/bags" }, //cat
        { name: "Shoes", href: "products/sora/shoes" }, //cat
      ],
    },
  ],
  pages: [
    // { name: "Company", href: "#" },
    // { name: "Stores", href: "#" },
  ],
};

const footerNavigation = {
  products: [
    { name: "Tops", href: "products/iora/tops" },
    { name: "Bottoms", href: "products/iora/bottoms" },
    { name: "Skirts", href: "products/iora/skirts" },
    { name: "Dresses / One Piece", href: "products/iora/dress" },
    { name: "Knits & Sweaters", href: "products/iora/knits" },
    { name: "Browse All", href: "products/iora" },
  ],

  customerService: [{ name: "Support", href: "/support" }],
};

export const ECIndex = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedIn = useSelector(selectUserLoggedIn);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    addToast("Logout Successful", {
      appearance: "success",
      autoDismiss: true,
    });
    navigate("/");
  };

  return (
    <div className="bg-white">
      <header className="relative bg-white">
        <NavBar
          navigation={navigation}
          loggedIn={loggedIn}
          handleLogout={handleLogout}
        />
      </header>
      <main>
        <Outlet />
      </main>
      <footer aria-labelledby="footer-heading" className="bg-white">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 py-20">
            <div className="grid grid-cols-1 md:grid-cols-12 md:grid-flow-col md:gap-x-8 md:gap-y-16 md:auto-rows-min">
              {/* Image section */}
              {/* <div className="col-span-1 md:col-span-2 lg:row-start-1 lg:col-start-1">
                <img
                  src="#"
                  alt=""
                  className="h-8 w-auto"
                />
              </div> */}

              {/* Sitemap sections */}
              <div className="mt-10 col-span-6 grid grid-cols-2 gap-8 sm:grid-cols-3 md:mt-0 md:row-start-1 md:col-start-3 md:col-span-8 lg:col-start-2 lg:col-span-6">
                <div className="grid grid-cols-1 gap-y-12 sm:col-span-2 sm:grid-cols-2 sm:gap-x-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Products
                    </h3>
                    <ul className="mt-6 space-y-6">
                      {footerNavigation.products.map((item) => (
                        <li key={item.name} className="text-sm">
                          <Link
                            to={item.href}
                            className="text-gray-500 hover:text-gray-600"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Customer Service
                    </h3>
                    <ul className="mt-6 space-y-6">
                      {footerNavigation.customerService.map((item) => (
                        <li key={item.name} className="text-sm">
                          <Link
                            to={item.href}
                            className="text-gray-500 hover:text-gray-600"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 py-10 text-center">
            <p className="text-sm text-gray-500">
              &copy; 2022 iORA SINGAPORE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

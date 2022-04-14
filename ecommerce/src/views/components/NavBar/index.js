import { Dialog, Menu, Popover, Tab, Transition } from "@headlessui/react";
import {
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
  SupportIcon,
  UserIcon,
  XIcon as XIconOutline,
} from "@heroicons/react/outline";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { classNames } from "../../../../../ecommerce/src/utilities/Util";
import { selectCartQty } from "../../../stores/slices/cartSlice";
import { api } from "../../../environments/Api";

const ProfileDropdown = ({ handleLogout }) => {
  return (
    <Menu as="div" className="z-10 ml-3 relative">
      <div>
        <Menu.Button className="hidden lg:flow-root p-2 text-gray-400 hover:text-gray-500 lg:ml-4">
          <span className="sr-only">Account</span>
          <UserIcon className="w-6 h-6" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/settings/profile"
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700"
                )}
              >
                Your Profile
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/orders"
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700"
                )}
              >
                Order History
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/membership"
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700"
                )}
              >
                Membership
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/"
                onClick={handleLogout}
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700"
                )}
              >
                Logout
              </Link>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const SearchPopover = () => {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");

  const onSearchChanged = async (e) => {
    setSearch(e.target.value);
    const { data } = await api.getAll(
      `online/public/modelSearch?name=${e.target.value}`
    );
    setResults(data.filter(product => product.available));
  };

  return (
    <Popover.Group className="z-10 absolute bottom-0 inset-x-0 sm:static sm:flex-1 sm:self-stretch">
      <div className="border-t h-14 px-4 flex space-x-8 overflow-x-auto pb-px sm:h-full sm:border-t-0 sm:justify-center sm:overflow-visible sm:pb-0">
        <Popover className="flex justify-between">
          <>
            <div className="items-center justify-end relative flex">
              <Popover.Button className="ml-4 flow-root lg:ml-6">
                <div className=" text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Search</span>
                  <SearchIcon className="w-6 h-6" aria-hidden="true" />
                </div>
              </Popover.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Popover.Panel className="absolute top-full inset-x-0 text-gray-500 sm:text-sm">
                {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                <div
                  className="absolute inset-0 bg-white shadow"
                  aria-hidden="true"
                />
                <div className="p-4 flex items-center justify-evenly">
                  <div className="max-w-3xl mx-auto px-4 sm:px-6 md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
                    <div className="py-4 px-8 flex-1 flex">
                      <form className="w-full flex md:ml-0">
                        <label htmlFor="search-field" className="sr-only">
                          Search
                        </label>
                        <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                          <div
                            className="absolute inset-y-0 left-0 flex items-center pointer-events-none"
                            aria-hidden="true"
                          >
                            <SearchIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            id="search-field"
                            name="search-field"
                            className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                            placeholder="Search products"
                            type="search"
                            value={search}
                            onChange={onSearchChanged}
                            autoFocus
                          />
                        </div>
                      </form>
                    </div>
                    <ul className="max-h-80 overflow-y-auto overflow-x- divide-y divide-gray-200">
                      {results.map((result, index) => (
                        <li
                          key={index}
                          className="relative overflow-hidden bg-white py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-600"
                        >
                          <div className="flex justify-between space-x-3">
                            <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
                              <img
                                src={result.imageLinks[0]}
                                alt={result.name}
                                className="object-center object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <Link
                                to={`/products/view/${result.modelCode}`}
                                className="block focus:outline-none"
                              >
                                <span
                                  className="absolute inset-0"
                                  aria-hidden="true"
                                />
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {result.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  {result.description}
                                </p>
                              </Link>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    )
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        </Popover>
      </div>
    </Popover.Group>
  );
};

export const NavBar = ({ navigation, loggedIn, handleLogout }) => {
  const [open, setOpen] = useState(false);
  const cartCount = useSelector(selectCartQty);

  return (
    <>
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 lg:hidden"
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto">
              <div className="px-4 pt-5 pb-2 flex">
                <button
                  type="button"
                  className="-m-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XIconOutline className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Links */}
              <Tab.Group as="div" className="mt-2">
                <div className="border-b border-gray-200">
                  <Tab.List className="-mb-px flex px-4 space-x-8">
                    {navigation.categories.map((result) => (
                      <Tab
                        key={result.name}
                        className={({ selected }) =>
                          classNames(
                            selected
                              ? "text-gray-600 border-gray-600"
                              : "text-gray-900 border-transparent",
                            "flex-1 whitespace-nowrap py-4 px-1 border-b-2 text-base font-medium"
                          )
                        }
                      >
                        {result.name}
                      </Tab>
                    ))}
                  </Tab.List>
                </div>
                <Tab.Panels as={Fragment}>
                  {navigation.categories.map((result) => (
                    <Tab.Panel
                      key={result.name}
                      className="pt-10 pb-8 px-4 space-y-10"
                    >
                      {result.items.map((item) => (
                        <div key={item.name}>
                          <p
                            id={`${result.id}-${item.id}-heading-mobile`}
                            className="font-medium text-gray-900"
                          >
                            {item.name}
                          </p>
                          <ul
                            aria-labelledby={`${result.id}-${item.id}-heading-mobile`}
                            className="mt-6 flex flex-col space-y-6"
                          >
                            <li key={item.name} className="flow-root">
                              <a
                                href={item.href}
                                className="-m-2 p-2 block text-gray-500"
                              >
                                {item.name}
                              </a>
                            </li>
                          </ul>
                        </div>
                      ))}
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>

              {!loggedIn ? (
                <div className="border-t border-gray-200 py-6 px-4 space-y-6">
                  <div className="flow-root">
                    <Link
                      to="/login"
                      className="-m-2 p-2 block font-medium text-gray-900"
                    >
                      Sign in
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link
                      to="/register"
                      className="-m-2 p-2 block font-medium text-gray-900"
                    >
                      Create account
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 py-6 px-4 space-y-6">
                  <div className="flow-root">
                    <Link
                      to="/settings/profile"
                      className="-m-2 p-2 block font-medium text-gray-900"
                    >
                      Your profile
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link
                      to="/orders"
                      className="-m-2 p-2 block font-medium text-gray-900"
                    >
                      Order history
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link
                      to="/membership"
                      className="-m-2 p-2 block font-medium text-gray-900"
                    >
                      Membership
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link
                      to="/support"
                      className="-m-2 p-2 block font-medium text-gray-900"
                    >
                      Support centre
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link
                      to="/"
                      onClick={handleLogout}
                      className="-m-2 p-2 block font-medium text-gray-900"
                    >
                      Logout
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
      <nav aria-label="Top" className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <div className="h-16 flex items-center">
            <button
              type="button"
              className="bg-white p-2 rounded-md text-gray-400 lg:hidden"
              onClick={() => setOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Logo */}
            <div className="ml-4 flex lg:ml-0">
              <Link to="/">
                <span className="sr-only">iORA</span>
                <img
                  className="mx-auto h-14 w-14"
                  src="/logo192.png"
                  alt="iORA"
                />
              </Link>
            </div>

            {/* Flyout menus */}
            {navigation.categories.map((result) => (
              <Popover key={result.name} className="flex relative px-4 ">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={classNames(
                        open
                          ? "border-gray-600 text-gray-600"
                          : "border-transparent text-gray-700 hover:text-gray-800",
                        "relative z-10 flex items-center transition-colors ease-out duration-200 text-sm font-medium border-b-2 -mb-px pt-px"
                      )}
                    >
                      {result.name}
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Popover.Panel className="absolute z-20 left-1/4 transform translate-y-8 mt-3 px-2 w-screen max-w-xs sm:px-0">
                        <div className="shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                          <div className="text-sm bg-white p-6 pl-12">
                            <div className="justify-center">
                              {result.items.map((item) => (
                                <p
                                  key={item.name}
                                  className=" text-gray-800 mb-1"
                                >
                                  <Link
                                    to={item.href}
                                    className="hover:text-gray-500"
                                  >
                                    {item.name}
                                  </Link>
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            ))}
            <div className="ml-auto flex items-center">
              {!loggedIn && (
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Sign in
                  </Link>
                  <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  <Link
                    to="/register"
                    className="text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Create account
                  </Link>
                </div>
              )}
              <SearchPopover />
              {/* Account */}
              {loggedIn && <ProfileDropdown handleLogout={handleLogout} />}
              {/* Support */}
              {loggedIn && (
                <div className="hidden ml-4 lg:flow-root lg:ml-6">
                  <Link
                    to="/support"
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Support</span>
                    <SupportIcon className="w-6 h-6" aria-hidden="true" />
                  </Link>
                </div>
              )}
              {/* Cart */}
              <div className="ml-4 flow-root lg:ml-6">
                <Link to="cart" className="group -m-2 p-2 flex items-center">
                  <ShoppingBagIcon
                    className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                    {cartCount}
                  </span>
                  <span className="sr-only">items in cart, view bag</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

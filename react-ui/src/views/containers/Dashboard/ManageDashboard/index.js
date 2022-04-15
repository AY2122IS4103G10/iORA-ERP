import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import moment from "moment";
import { useEffect, useLayoutEffect, useState } from "react";
import { Bar, Chart, Doughnut } from "react-chartjs-2";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { productApi } from "../../../../environments/Api";
import {
  getCustomerOrders,
  getCustomerOrdersOfSite,
  getProcurementOrdersOfSite,
  getStockLevelSites,
  getStockTransferOrdersOfSite,
  getVoucherStats,
  setSiteId,
} from "../../../../stores/slices/dashboardSlice";
import { SectionHeading } from "../../../components/HeadingWithTabs";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import { ToggleLeftLabel } from "../../../components/Toggles/LeftLabel";
import SharedStats from "../components/Stats";
import {
  colourPicker,
  cyans,
  delta,
  deltaType,
  getOrder,
  getProduct,
  getRevenue,
  getRevenuePerOrder,
  multi,
  rangeLabels,
  topfew,
} from "../utils";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const tabs = [
  { name: "Dashboard", href: "", current: true },
  { name: "Reports", href: "reports", current: false },
];

export const ManageDashboard = () => {
  const dispatch = useDispatch();
  const siteId = Number(localStorage.getItem("siteId"));
  const [showTopStock, setShowTopStock] = useState(topfew[0]);
  const [siteData, setSiteData] = useState([]);
  const [siteChosen, setSiteChosen] = useState({ id: 0, name: "Choose One" });
  const options = [
    { id: 0, name: "Daily", unit: "day" },
    { id: 1, name: "Weekly", unit: "week" },
    { id: 2, name: "Monthly", unit: "month" },
    { id: 3, name: "Annually", unit: "year" },
  ];
  const [range, setRange] = useState(options[0]);

  const status = useSelector(({ dashboard }) => dashboard.status);
  const voucherStats = useSelector(({ dashboard }) => dashboard.voucherStats);
  const stockLevelSites = useSelector(
    ({ dashboard }) => dashboard.stockLevelSites
  );
  const stats = useSelector(({ dashboard }) =>
    [...dashboard.customerOrdersByDate].reverse()
  );
  const currStats = stats[0];
  const prevStats = stats[1];
  const siteCustomerOrders = useSelector(
    (state) => state.dashboard.customerOrders
  );
  const siteProcurementOrders = useSelector(
    (state) => state.dashboard.procurementOrders
  );
  const siteStockTransferOrders = useSelector(
    (state) => state.dashboard.stockTransferOrders
  );

  useEffect(() => {
    status === "idle" && dispatch(getStockLevelSites());
    dispatch(getVoucherStats());
    status === "succeeded-1" &&
      stockLevelSites.length > 0 &&
      setSiteData(
        stockLevelSites.map((site) => {
          return {
            ...site,
            productLevel: site.stockLevel.products.reduce(
              (sum, newProduct) => sum + newProduct.qty,
              0
            ),
          };
        })
      );
    if (status === "succeeded-1" && siteId && stockLevelSites.length > 0) {
      const chosenSite = stockLevelSites.find((site) => site.id === siteId);
      setSiteChosen({ id: siteId, name: chosenSite.name });
    }
  }, [status, dispatch, stockLevelSites, siteId]);

  useLayoutEffect(() => {
    if (range) {
      for (let i = 6; i >= 0; i--) {
        dispatch(
          getCustomerOrders({
            startDate: moment()
              .add(1, "day")
              .subtract(i + 1, range.unit)
              .format("DDMMyyyy")
              .toString(),
            endDate: moment()
              .subtract(i, range.unit)
              .format("DDMMyyyy")
              .toString(),
          })
        );
      }
    }
  }, [dispatch, range]);

  useEffect(() => {
    if (siteChosen.id === 0) return;
    dispatch(setSiteId(siteChosen.id));
    dispatch(getCustomerOrdersOfSite({ siteId: siteChosen.id }));
    dispatch(getProcurementOrdersOfSite({ siteId: siteChosen.id }));
    dispatch(getStockTransferOrdersOfSite({ siteId: siteChosen.id }));
  }, [siteChosen, dispatch]);

  return (
    <>
      <SectionHeading header="Dashboard" tabs={tabs} />
      <div className="flex justify-center min-w-fit">
        <div className="flex grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 w-screen lg:w-full 2xl:max-w-7xl items-start justify-start">
          <div className="rounded-lg bg-white overflow-visible shadow m-4 p-6 col-span-1 md:col-span-2 2xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <SimpleSelectMenu
                label="Select Date Range"
                options={options}
                selected={range}
                setSelected={setRange}
              />
            </div>
            <div>
              <SimpleSelectMenu
                label="Select Site"
                options={siteData.map((x) => {
                  return { id: x.id, name: x.name };
                })}
                selected={siteChosen}
                setSelected={setSiteChosen}
              />
            </div>
          </div>
          {siteChosen.id < 3 && (
            <>
              <div className="rounded-lg bg-white overflow-visible shadow m-4 p-6">
                <h3 className="text-lg font-medium">Finances</h3>
                <SharedStats
                  stats={[
                    {
                      name: "Revenue",
                      stat: getRevenue(currStats),
                      previousStat: getRevenue(prevStats),
                      prefix: "$",
                      change: delta(
                        getRevenue(currStats),
                        getRevenue(prevStats)
                      ),
                      changeType: deltaType(
                        getRevenue(currStats),
                        getRevenue(prevStats)
                      ),
                    },
                    {
                      name: "Total Customer Orders",
                      stat: getOrder(currStats),
                      previousStat: getOrder(prevStats),
                      change: delta(getOrder(currStats), getOrder(prevStats)),
                      changeType: deltaType(
                        getOrder(currStats),
                        getOrder(prevStats)
                      ),
                    },
                    {
                      name: "Products Sold",
                      stat: getProduct(currStats),
                      previousStat: getProduct(prevStats),
                      suffix: " items",
                      change: delta(
                        getProduct(currStats),
                        getProduct(prevStats)
                      ),
                      changeType: deltaType(
                        getProduct(currStats),
                        getProduct(prevStats)
                      ),
                    },
                  ]}
                />
              </div>
              <div className="rounded-lg bg-white overflow-hidden shadow m-4 p-6 md:col-span-2">
                <h3 className="text-lg font-medium">Product Levels</h3>
                <Bar
                  data={{
                    labels: siteData.map((x) => x.name),
                    datasets: [
                      {
                        label: "Total Stock Level of Sites",
                        data: siteData.map((x) => x.productLevel),
                        backgroundColor: colourPicker(
                          multi,
                          siteData.length,
                          0.6
                        ),
                        borderColor: colourPicker(multi, siteData.length, 1),
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
              <div className="rounded-lg bg-white overflow-hidden shadow m-4 p-6 md:col-span-2">
                <h3 className="text-lg font-medium">Voucher Details</h3>
                <Chart
                  type="bar"
                  data={{
                    labels: voucherStats.slice(0, 10).map((v) => v.campaign),
                    datasets: [
                      {
                        label: `Percentage of issued vouchers redeemed`,
                        data: voucherStats
                          .slice(0, 10)
                          .map((v) => v.redeemed / v.issued),
                        borderColor: colourPicker(cyans, 4, 1)[3],
                        backgroundColor: colourPicker(cyans, 4, 0.5)[3],
                        borderWidth: 2,
                        fill: false,
                        type: "line",
                      },
                      {
                        label: `Vouchers issued`,
                        data: voucherStats.slice(0, 10).map((v) => v.issued),
                        borderColor: colourPicker(multi, 5, 1)[4],
                        backgroundColor: colourPicker(multi, 5, 0.5)[4],
                        borderWidth: 2,
                        fill: true,
                        type: "bar",
                      },
                      {
                        label: `Vouchers redeemed`,
                        data: voucherStats.slice(0, 10).map((v) => v.redeemed),
                        borderColor: colourPicker(multi, 3, 1)[2],
                        backgroundColor: colourPicker(multi, 3, 0.5)[2],
                        borderWidth: 2,
                        fill: true,
                        type: "bar",
                      },
                    ],
                  }}
                />
              </div>
            </>
          )}
          {siteChosen.id !== 0 && (
            <>
              <div className="rounded-lg bg-white overflow-visible shadow m-4 p-6">
                <h3 className="text-lg font-medium">
                  Orders processed by {siteChosen.name}
                </h3>
                <SharedStats
                  stats={[
                    {
                      name: "Total Revenue",
                      prefix: "$",
                      stat: siteCustomerOrders
                        ?.find((x) => x.id === siteChosen.id)
                        ?.orders?.reduce(
                          (sum, order) => sum + order.totalAmount,
                          0
                        ),
                    },
                    {
                      name: "Total Customer Orders",
                      stat: siteCustomerOrders?.find(
                        (x) => x.id === siteChosen.id
                      )?.orders?.length,
                    },
                    {
                      name: "Total Procurement Orders",
                      stat: siteProcurementOrders?.find(
                        (x) => x.id === siteChosen.id
                      )?.orders?.length,
                    },
                    {
                      name: "Total Stock Transfer Orders",
                      stat: siteStockTransferOrders?.find(
                        (x) => x.id === siteChosen.id
                      )?.orders?.length,
                    },
                  ]}
                />
              </div>
              <div className="rounded-lg bg-white overflow-visible shadow m-4 p-6">
                <h3 className="text-lg font-medium">
                  Overall Finances of {siteChosen.name}
                </h3>
                <SharedStats
                  stats={[
                    {
                      name: "Revenue",
                      stat: getRevenue(currStats, siteChosen?.id),
                      previousStat: getRevenue(prevStats, siteChosen?.id),
                      prefix: "$",
                      change: delta(
                        getRevenue(currStats, siteChosen?.id),
                        getRevenue(prevStats, siteChosen?.id)
                      ),
                      changeType: deltaType(
                        getRevenue(currStats, siteChosen?.id),
                        getRevenue(prevStats, siteChosen?.id)
                      ),
                    },
                    {
                      name: "Total Customer Orders",
                      stat: getOrder(currStats, siteChosen?.id),
                      previousStat: getOrder(prevStats, siteChosen?.id),
                      change: delta(
                        getOrder(currStats),
                        getOrder(prevStats, siteChosen?.id)
                      ),
                      changeType: deltaType(
                        getOrder(currStats, siteChosen?.id),
                        getOrder(prevStats, siteChosen?.id)
                      ),
                    },
                    {
                      name: "Products Sold",
                      stat: getProduct(currStats, siteChosen?.id),
                      previousStat: getProduct(prevStats, siteChosen?.id),
                      suffix: " items",
                      change: delta(
                        getProduct(currStats, siteChosen?.id),
                        getProduct(prevStats, siteChosen?.id)
                      ),
                      changeType: deltaType(
                        getProduct(currStats, siteChosen?.id),
                        getProduct(prevStats, siteChosen?.id)
                      ),
                    },
                    {
                      name: "Average Order Revenue",
                      stat: getRevenuePerOrder(currStats, siteChosen?.id),
                      previousStat: getRevenuePerOrder(
                        prevStats,
                        siteChosen?.id
                      ),
                      prefix: "$",
                      change: delta(
                        getRevenuePerOrder(currStats, siteChosen?.id),
                        getRevenuePerOrder(prevStats, siteChosen?.id)
                      ),
                      changeType: deltaType(
                        getRevenuePerOrder(currStats, siteChosen?.id),
                        getRevenuePerOrder(prevStats, siteChosen?.id)
                      ),
                    },
                  ]}
                />
              </div>
              {siteChosen.id !== 0 && (
                <Bestsellers
                  name={siteChosen.name}
                  orders={
                    siteCustomerOrders?.find((x) => x.id === siteChosen.id)
                      ?.orders || []
                  }
                />
              )}
              <div className="rounded-lg bg-white overflow-hidden shadow m-4 p-6 md:col-span-2">
                <h3 className="text-lg font-medium">Sales</h3>
                {stats.length > 2 && (
                  <Chart
                    type="bar"
                    data={{
                      labels: rangeLabels(range.unit),
                      datasets: [
                        {
                          label: `Revenue over past 7 ${range.unit}s in $`,
                          data: stats
                            .slice(0, 7)
                            .reverse()
                            .map((x) => getRevenue(x, siteChosen?.id)),
                          borderColor: colourPicker(cyans, 3, 1)[2],
                          backgroundColor: colourPicker(cyans, 3, 0.5)[2],
                          borderWidth: 2,
                          fill: false,
                          type: "line",
                        },
                        {
                          label: `Products sold over past 7 ${range.unit}s`,
                          data: stats
                            .slice(0, 7)
                            .reverse()
                            .map((x) => getProduct(x, siteChosen?.id)),
                          borderColor: colourPicker(multi, 5, 1)[4],
                          backgroundColor: colourPicker(multi, 5, 0.5)[4],
                          borderWidth: 2,
                          fill: true,
                          type: "bar",
                        },
                        {
                          label: `Orders made over past 7 ${range.unit}s`,
                          data: stats
                            .slice(0, 7)
                            .reverse()
                            .map((x) => getOrder(x, siteChosen?.id)),
                          borderColor: colourPicker(multi, 3, 1)[2],
                          backgroundColor: colourPicker(multi, 3, 0.5)[2],
                          borderWidth: 2,
                          fill: true,
                          type: "bar",
                        },
                      ],
                    }}
                  />
                )}
              </div>
              <div className="rounded-lg bg-white overflow-hidden shadow m-4 p-6">
                <h3 className="text-lg font-medium">
                  Stock Level of {siteChosen?.name}
                </h3>
                {siteChosen.id !== 0 && (
                  <>
                    <SimpleSelectMenu
                      label="Show top"
                      options={topfew}
                      selected={showTopStock}
                      setSelected={setShowTopStock}
                    />
                    <Doughnut
                      className="mt-3"
                      data={{
                        labels: stockLevelSites
                          ?.find((x) => x.id === siteChosen.id)
                          ?.stockLevel.products.slice(0, showTopStock.name)
                          .map((y) => y.sku),
                        datasets: [
                          {
                            label: "Stock Level of Selected Site",
                            data: stockLevelSites
                              ?.find((x) => x.id === siteChosen.id)
                              ?.stockLevel.products.slice(0, showTopStock.name)
                              .map((y) => y.qty),
                            backgroundColor: colourPicker(
                              cyans,
                              siteData.length,
                              0.6
                            ),
                            borderColor: colourPicker(
                              cyans,
                              siteData.length,
                              1
                            ),
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: {
                            display: showTopStock.name <= 10,
                          },
                        },
                      }}
                    />
                  </>
                )}
              </div>
            </>
          )}
          {/* <div className="rounded-lg bg-white overflow-hidden shadow m-4 p-6">
            <h3 className="text-lg font-medium">iORA</h3>
            <Doughnut data={data} />
          </div>
          <div className="rounded-lg bg-white overflow-hidden shadow m-4 p-6">
            <h3 className="text-lg font-medium">LALU</h3>
            <Doughnut data={data2} />
          </div> */}
        </div>
      </div>
    </>
  );
};

const Bestsellers = ({ name, orders }) => {
  const [loading, setLoading] = useState(false);
  const [showModels, setShowModels] = useState(true);
  // const [selectedModelCode, setSelectedModelCode] = useState(null);
  const prodQtys = [
    ...orders
      .flatMap((order) => order?.lineItems)
      .map((li) => {
        return { sku: li.product.sku, qty: li.qty };
      })
      .reduce(
        (map, prod) => map.set(prod.sku, map.get(prod.sku) || 0 + prod.qty),
        new Map()
      ),
  ];
  const modelBestsellers =
    prodQtys.length > 0
      ? [
          ...prodQtys.reduce(
            (map, prod) =>
              map.set(
                prod[0].split("-")[0],
                map.get(prod[0].split("-")[0]) || 0 + prod[1]
              ),
            new Map()
          ),
        ].sort((m1, m2) => m2[1] - m1[1])
      : [];
  const prodBestsellers = prodQtys.sort((p1, p2) => p2[1] - p1[1]);
  const compact = showModels
    ? modelBestsellers.length < 3
    : prodBestsellers.length < 3;

  const changeShowModels = async () => {
    setLoading(true);
    setShowModels(!showModels);
    setTimeout(() => setLoading(false), 700);
  };

  return (
    <div
      className={`rounded-lg bg-white overflow-visible shadow m-4 p-6 row-span-${
        compact ? 1 : 2
      }`}
    >
      <h3 className="text-lg font-medium mb-4">Bestsellers in {name}</h3>
      <ToggleLeftLabel
        enabled={!showModels}
        onEnabledChanged={changeShowModels}
        label="Filtered by Colour and Size"
      />
      <dl className="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200">
        {loading ? (
          <div className="flex py-12 items-center justify-center">
            <TailSpin color="#00BFFF" height={30} width={30} />
          </div>
        ) : showModels ? (
          modelBestsellers
            .slice(0, 5)
            ?.map((model, index) => <ModelCard key={index} model={model} index={index} />)
        ) : (
          // ) : selectedModelCode ? (
          //   <></>
          prodBestsellers
            .slice(0, 5)
            ?.map((prod, index) => <ProductCard key={index} prod={prod} index={index} />)
        )}
      </dl>
    </div>
  );
};

const ModelCard = ({ model, index }) => {
  const [modelFull, setModel] = useState();

  useEffect(() => {
    model &&
      productApi.getModelByModelCode(model[0]).then(({ data }) => {
        setModel(data);
      });
  }, [model]);

  return (
    <div key={index} className="flex px-4 py-5 sm:p-6">
      <div className="flex-grow">
        <dt className="text-base font-medium text-gray-900">
          {index + 1}. {modelFull?.name}
        </dt>
        <dt className="ml-4 text-base font-medium text-gray-600">
          Sold: {model[1]}
        </dt>
        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
          <div className="grid grid-cols-1">
            <p className="ml-4 text-sm font-semibold text-gray-500">
              <strong className="font-medium text-cyan-700">
                Product Code:
              </strong>{" "}
              {modelFull?.modelCode}
            </p>
            <p className="ml-4 text-sm font-semibold text-gray-500">
              <strong className="font-medium text-cyan-700">Price:</strong> $
              {Number.parseFloat(modelFull?.discountPrice).toFixed(2)}
            </p>
            <p className="ml-4 text-sm font-semibold text-gray-500">
              <strong className="font-medium text-cyan-700">
                Available Colour(s):
              </strong>{" "}
              {modelFull?.productFields
                .filter((f) => f.fieldName === "COLOUR")
                .map((f) => f.fieldValue)
                .join(", ")}
            </p>
            <p className="ml-4 text-sm font-semibold text-gray-500">
              <strong className="font-medium text-cyan-700">
                Available Size(s):
              </strong>{" "}
              {modelFull?.productFields
                .filter((f) => f.fieldName === "SIZE")
                .map((f) => f.fieldValue)
                .join(", ")}
            </p>
          </div>
        </dd>
        {/* <button
              type="button"
              className="inline-flex items-center ml-4 mt-2 py-1.5 px-3 border-2 border-gray-400 rounded-full shadow-sm text-gray-400 bg-white-300 hover:bg-white-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
            >
              <FilterIcon className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium text-md">Filter for this product</span>
            </button> */}
      </div>
      <div className="ml-4 flex-shrink-0">
        <img
          width="90"
          src={modelFull?.imageLinks[0]}
          alt={modelFull?.description}
        />
      </div>
    </div>
  );
};

const ProductCard = ({ prod, index }) => {
  const [product, setProduct] = useState();
  const [model, setModel] = useState();

  useEffect(() => {
    productApi.getProductBySku(prod[0]).then(({ data }) => {
      setProduct(data);
    });
    productApi.getModelBySku(prod[0]).then(({ data }) => {
      setModel(data);
    });
  }, [prod]);

  return (
    <div key={index} className="flex px-4 py-5 sm:p-6">
      <div className="flex-grow">
        <dt className="text-base font-medium text-gray-900">
          {index + 1}. {model?.name}
        </dt>
        <dt className="ml-4 text-sm font-medium text-gray-500">
          Colour:{" "}
          {
            product?.productFields?.find((f) => f.fieldName === "COLOUR")
              ?.fieldValue
          }{" "}
          Size:{" "}
          {
            product?.productFields?.find((f) => f.fieldName === "SIZE")
              ?.fieldValue
          }
        </dt>
        <dt className="ml-4 text-base font-medium text-gray-600">
          Sold: {prod[1]}
        </dt>
        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
          <div className="grid grid-cols-1">
            <p className="ml-4 text-sm font-semibold text-gray-500">
              <strong className="font-medium text-cyan-700">SKU Code:</strong>{" "}
              {product?.sku}
            </p>
            <p className="ml-4 text-sm font-semibold text-gray-500">
              <strong className="font-medium text-cyan-700">Price:</strong> $
              {Number.parseFloat(model?.discountPrice).toFixed(2)}
            </p>
          </div>
        </dd>
      </div>
      <div className="ml-4 flex-shrink-0">
        <img width="90" src={model?.imageLinks[0]} alt={model?.description} />
      </div>
    </div>
  );
};

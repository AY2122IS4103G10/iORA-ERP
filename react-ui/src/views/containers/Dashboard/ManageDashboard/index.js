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
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomerOrders,
  getCustomerOrdersOfSite,
  getProcurementOrdersOfSite,
  getStockLevelSites,
  getStockTransferOrdersOfSite,
  setSiteId,
} from "../../../../stores/slices/dashboardSlice";
import { Header } from "../../../components/Header";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import SharedStats from "../components/Stats";

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

const cyans = [
  "rgba(22, 78, 99, alpha)",
  "rgba(21, 94, 117, alpha)",
  "rgba(14, 116, 144, alpha)",
  "rgba(8, 145, 178, alpha)",
  "rgba(6, 182, 212, alpha)",
  "rgba(103, 232, 249, alpha)",
  "rgba(34, 211, 238, alpha)",
  "rgba(165, 243, 252, alpha)",
  "rgba(207, 250, 254, alpha)",
  "rgba(236, 254, 255, alpha)",
  "rgba(22, 78, 99, alpha)",
  "rgba(21, 94, 117, alpha)",
  "rgba(14, 116, 144, alpha)",
  "rgba(8, 145, 178, alpha)",
  "rgba(6, 182, 212, alpha)",
  "rgba(103, 232, 249, alpha)",
  "rgba(34, 211, 238, alpha)",
  "rgba(165, 243, 252, alpha)",
  "rgba(207, 250, 254, alpha)",
  "rgba(236, 254, 255, alpha)",
  "rgba(22, 78, 99, alpha)",
  "rgba(21, 94, 117, alpha)",
  "rgba(14, 116, 144, alpha)",
  "rgba(8, 145, 178, alpha)",
  "rgba(6, 182, 212, alpha)",
  "rgba(103, 232, 249, alpha)",
  "rgba(34, 211, 238, alpha)",
  "rgba(165, 243, 252, alpha)",
  "rgba(207, 250, 254, alpha)",
  "rgba(236, 254, 255, alpha)",
];

const multi = [
  "rgba(14, 116, 144, alpha)",
  "rgba(190, 24, 93, alpha)",
  "rgba(161, 98, 7, alpha)",
  "rgba(15, 118, 110, alpha)",
  "rgba(67, 56, 202, alpha)",
  "rgba(185, 28, 28, alpha)",
  "rgba(14, 116, 144, alpha)",
  "rgba(190, 24, 93, alpha)",
  "rgba(161, 98, 7, alpha)",
  "rgba(15, 118, 110, alpha)",
  "rgba(67, 56, 202, alpha)",
  "rgba(185, 28, 28, alpha)",
  "rgba(14, 116, 144, alpha)",
  "rgba(190, 24, 93, alpha)",
  "rgba(161, 98, 7, alpha)",
  "rgba(15, 118, 110, alpha)",
  "rgba(67, 56, 202, alpha)",
  "rgba(185, 28, 28, alpha)",
];

export const colourPicker = (palette, number, alpha) =>
  palette.slice(0, number).map((rgba) => rgba.replace("alpha", `${alpha}`));

export const data3 = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Dataset 1",
      data: [256, 476, 611, 624, 785, 346, 567],
      borderColor: colourPicker(cyans, 3, 1)[2],
      backgroundColor: colourPicker(cyans, 3, 0.5)[2],
    },
    {
      label: "Dataset 2",
      data: [70, 672, 123, 142, 564, 726, 345],
      borderColor: colourPicker(multi, 3, 1)[2],
      backgroundColor: colourPicker(multi, 3, 0.5)[2],
    },
  ],
};

const data = {
  labels: ["900", "800", "700", "600", "500", "400"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: colourPicker(cyans, 6, 0.6),
      borderColor: colourPicker(cyans, 6, 1),
      borderWidth: 0,
    },
  ],
};

const data2 = {
  labels: ["Cyan", "Pink", "Yellow", "Teal", "Indigo", "Red"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: colourPicker(multi, 6, 0.8),
      borderColor: colourPicker(multi, 6, 1),
      borderWidth: 3,
    },
  ],
};

export const ManageDashboard = () => {
  const dispatch = useDispatch();
  const siteId = Number(localStorage.getItem("siteId"));
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
  const stockLevelSites = useSelector(
    ({ dashboard }) => dashboard.stockLevelSites
  );
  const currStats = useSelector(
    ({ dashboard }) => dashboard.customerOrdersByDate.slice(-1)[0]
  );
  const prevStats = useSelector(
    ({ dashboard }) => dashboard.customerOrdersByDate.slice(-2)[0]
  );
  const getStats = (obj, type, coeff, total) =>
    total
      ? Object.values(obj).reduce((sum, site) => sum + site[type] * coeff, 0)
      : obj[siteChosen?.id][type] * coeff;
  const getRevenue = (obj, total = false) =>
    getStats(obj, "revenue", 0.01, total);
  const getOrder = (obj, total = false) => getStats(obj, "orders", 1, total);
  const getProduct = (obj, total = false) =>
    getStats(obj, "products", 1, total);
  const delta = (curr, prev) =>
    Number.parseFloat(Math.abs(curr - prev) / prev).toFixed(2);
  const deltaType = (curr, prev) => (curr > prev ? "increase" : "decrease");
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
    range &&
      dispatch(
        getCustomerOrders({
          startDate: moment()
            .add(1, "day")
            .subtract(2, range.unit)
            .format("DDMMyyyy")
            .toString(),
          endDate: moment()
            .subtract(1, range.unit)
            .format("DDMMyyyy")
            .toString(),
        })
      );
    range &&
      dispatch(
        getCustomerOrders({
          startDate: moment()
            .add(1, "day")
            .subtract(1, range.unit)
            .format("DDMMyyyy")
            .toString(),
          endDate: moment().format("DDMMyyyy").toString(),
        })
      );
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
      <Header title={"Dashboard"} />
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
                      stat: getRevenue(currStats, true),
                      previousStat: getRevenue(prevStats, true),
                      prefix: "$",
                      change: delta(
                        getRevenue(currStats, true),
                        getRevenue(prevStats, true)
                      ),
                      changeType: deltaType(
                        getRevenue(currStats, true),
                        getRevenue(prevStats, true)
                      ),
                    },
                    {
                      name: "Total Customer Orders",
                      stat: getOrder(currStats, true),
                      previousStat: getOrder(prevStats, true),
                      change: delta(
                        getOrder(currStats, true),
                        getOrder(prevStats, true)
                      ),
                      changeType: deltaType(
                        getOrder(currStats, true),
                        getOrder(prevStats, true)
                      ),
                    },
                    {
                      name: "Products Sold",
                      stat: getProduct(currStats, true),
                      previousStat: getProduct(prevStats, true),
                      suffix: " items",
                      change: delta(
                        getProduct(currStats, true),
                        getProduct(prevStats, true)
                      ),
                      changeType: deltaType(
                        getProduct(currStats, true),
                        getProduct(prevStats, true)
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
              <div className="rounded-lg bg-white overflow-hidden shadow m-4 p-6">
                <h3 className="text-lg font-medium">
                  Stock Level of {siteChosen?.name}
                </h3>
                {siteChosen.id !== 0 && (
                  <Doughnut
                    className="mt-3"
                    data={{
                      labels: stockLevelSites
                        ?.find((x) => x.id === siteChosen.id)
                        ?.stockLevel.products.map((y) => y.sku),
                      datasets: [
                        {
                          label: "Stock Level of Selected Site",
                          data: stockLevelSites
                            ?.find((x) => x.id === siteChosen.id)
                            ?.stockLevel.products.map((y) => y.qty),
                          backgroundColor: colourPicker(
                            cyans,
                            siteData.length,
                            0.6
                          ),
                          borderColor: colourPicker(cyans, siteData.length, 1),
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
                )}
              </div>
              <div className="rounded-lg bg-white overflow-visible shadow m-4 p-6">
                <h3 className="text-lg font-medium">
                  Bestsellers in {siteChosen.name}
                </h3>
                {siteChosen.id !== 0 && (
                  <Bestsellers
                    orders={
                      siteCustomerOrders?.find((x) => x.id === siteChosen.id)
                        ?.orders || []
                    }
                  />
                )}
              </div>
              <div className="rounded-lg bg-white overflow-visible shadow m-4 p-6">
                <h3 className="text-lg font-medium">
                  Overall Finances of {siteChosen.name}
                </h3>
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
            </>
          )}
          <div className="rounded-lg bg-white overflow-hidden shadow m-4 p-6">
            <h3 className="text-lg font-medium">iORA</h3>
            <Doughnut data={data} />
          </div>
          <div className="rounded-lg bg-white overflow-hidden shadow m-4 p-6">
            <h3 className="text-lg font-medium">LALU</h3>
            <Doughnut data={data2} />
          </div>
          <div className="rounded-lg bg-white overflow-hidden shadow m-4 p-6 md:col-span-2">
            <h3 className="text-lg font-medium">Sales</h3>
            <Line data={data3} />
          </div>
        </div>
      </div>
    </>
  );
};

const Bestsellers = ({ orders }) => {
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
  return (
    <ul>
      {modelBestsellers.slice(0,5).map((x, index) => (
        <li key={index}>{index + 1}. {x[0]}</li>
      ))}
    </ul>
  );
};

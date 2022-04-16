import moment from "moment";

export const topfew = [
  {id : 0, name: 5},
  {id : 1, name: 10},
  {id : 2, name: 20},
  {id : 3, name: 50},
]

export const cyans = [
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

export const multi = [
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

export const data = {
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

export const data2 = {
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

export const getStats = (obj, type, coeff, id) =>
  id
    ? obj[id][type] * coeff
    : Object.values(obj).reduce((sum, site) => sum + site[type] * coeff, 0);

export const getRevenue = (obj, id = null) =>
  getStats(obj, "revenue", 0.01, id);

export const getOrder = (obj, id = null) => getStats(obj, "orders", 1, id);

export const getProduct = (obj, id = null) =>
  getStats(obj, "products", 1, id);

export const getRevenuePerOrder = (obj, id = null) => {
  let revs = getRevenue(obj, id);
  let ords = getOrder(obj, id);
  return [...Array(revs.length).keys()].map(num => revs[num] / ords[num]);
}

export const delta = (curr, prev) =>
  Number.parseFloat(100 * Math.abs(curr - prev) / prev).toFixed(2);

export const deltaType = (curr, prev) => (curr > prev ? "increase" : "decrease");

export const rangeLabels = (unit) => {
  if (unit === "day") {
    return [...Array(7).keys()].reverse().map(num => moment()
      .add(1, "day")
      .subtract(num + 1, unit)
      .format("DD MMM")
      .toString());
  } else if (unit === "week" || unit === "month") {
    return [...Array(7).keys()].reverse().map(num => [moment()
      .add(1, "day")
      .subtract(num + 1, unit)
      .format("DD MMM")
      .toString(), moment()
        .subtract(num, unit)
        .format("DD MMM")
        .toString()].join(" to "))
  } else {
    return [...Array(7).keys()].reverse().map(num => [moment()
      .add(1, "day")
      .subtract(num + 1, unit)
      .format("DD/MM/yyyy")
      .toString(), moment()
        .subtract(num, unit)
        .format("DD/MM/yyyy")
        .toString()].join("\nto\n"))
  }
}
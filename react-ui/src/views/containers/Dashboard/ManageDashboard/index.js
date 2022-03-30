import { Header } from "../../../components/Header";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

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
];

const multi = [
  "rgba(14, 116, 144, alpha)",
  "rgba(190, 24, 93, alpha)",
  "rgba(161, 98, 7, alpha)",
  "rgba(15, 118, 110, alpha)",
  "rgba(67, 56, 202, alpha)",
  "rgba(185, 28, 28, alpha)",
]

export const colourPicker = (palette, number, alpha) =>
  palette.slice(0, number).map((rgba) => rgba.replace("alpha", `${alpha}`));

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
  return (
    <>
      <Header title={"Dashboard"} />
      <div className="flex justify-center min-w-fit">
        <div className="flex grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 w-screen lg:w-full 2xl:max-w-7xl items-start justify-start">
          <div className="rounded-lg bg-white overflow-hidden shadow m-4 p-6">
            <h3 className="text-lg font-medium">iORA</h3>
            <Doughnut data={data} />
          </div>
          <div className="rounded-lg bg-white overflow-hidden shadow m-4 p-6">
            <h3 className="text-lg font-medium">LALU</h3>
            <Doughnut data={data2} />
          </div>
          <div className="rounded-lg bg-white overflow-hidden shadow m-4 p-6">
            <h3 className="text-lg font-medium">SORA</h3>
            <Doughnut data={data} />
          </div>
        </div>
      </div>
    </>
  );
};

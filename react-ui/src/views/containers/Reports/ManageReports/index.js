import { DownloadIcon } from "@heroicons/react/solid";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserSite, updateCurrSite } from "../../../../stores/slices/userSlice";

import { reportApi } from "../../../../environments/Api";
import { SectionHeading } from "../../../components/HeadingWithTabs";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { SimpleTable } from "../../../components/Tables/SimpleTable";


const tabs = [
  { name: "Dashboard", href: "/sm/analytics", current: false },
  { name: "Reports", href: "", current: true },
];

const options = [
  {
    id: 1,
    report: "Sales Report",
  },
  {
    id: 2,
    report: "Procurement Report",
  },
  {
    id: 3,
    report: "Transaction Report",
  },
];

export const ManageReports = () => {
  const dispatch = useDispatch();
  let todayDate = moment(new Date()).format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(todayDate);
  const [endDate, setEndDate] = useState(todayDate);
  const siteId = useSelector(selectUserSite);

  useEffect(() => {
    dispatch(updateCurrSite());
  },[])

  const columns = useMemo(() => {
    return [
      {
        Header: "Report",
        accessor: "report",
      },
      {
        Header: "Download",
        disableSortBy: true,
        Cell: (e) => {
          return (
            <button
              type="button"
              className="bg-white rounded-md font-medium text-cyan-600 hover:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={(click) =>
                onDownloadClicked(click, e.row.original.id, startDate, endDate)
              }
            >
              <DownloadIcon
                className="flex-shrink-0 h-4 w-4"
                aria-hidden="true"
              />
            </button>
          );
        },
      },
    ];
  }, [startDate, endDate]);

  const onDownloadClicked = (e, id, startDate, endDate) => {
    e.preventDefault();
    const start = moment(startDate).format("DDMMYYYY");
    const end = moment(endDate).format("DDMMYYYY");
    if (id === 1) {
      handleDownloadSalesReport(start, end);
    } else if (id === 2) {
      handleDownloadProcurementReport(siteId, start, end);
    } else if (id === 3) {
    }
  };

  const handleDownloadSalesReport = (startDate, endDate) => {
    reportApi.getSalesReport(startDate, endDate).then((response) => {
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Sales Report" + startDate + "-" + endDate + ".csv";
      link.click();
    });
  };

  const handleDownloadProcurementReport = (siteId, startDate, endDate) => {
    reportApi.getProcurementReport(siteId, startDate, endDate).then((response) => {
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Procurement Report_" + startDate + "_" + endDate + ".csv";
      link.click();
    });
  }

  const onStartDateChanged = (e) => {
    e.preventDefault();
    setStartDate(e.target.value);
  };
  const onEndDateChanged = (e) => {
    e.preventDefault();
    setEndDate(e.target.value);
    console.log("End", endDate);
  };
  return (
    <>
      <SectionHeading header="Reports" tabs={tabs} />
      <div className="mx-12">
        <div className="my-6 grid grid-cols-2 gap-16">
          <div className="col-span-1 ">
            <label className="pl-1 text-sm font-medium text-gray-900">
              Start Date
            </label>
            <SimpleInputBox
              type="date"
              name="startDate"
              id="startDate"
              value={startDate}
              onChange={onStartDateChanged}
              required
            />
          </div>
          <div className="col-span-1 ">
            <label className="pl-1 text-sm font-medium text-gray-900">
              End Date
            </label>
            <SimpleInputBox
              type="date"
              name="endDate"
              id="endDate"
              value={endDate}
              onChange={onEndDateChanged}
              required
            />
          </div>
        </div>

        <SimpleTable data={options} columns={columns} />
      </div>
    </>
  );
};

import { useMemo, useState } from "react";
import { DownloadIcon } from "@heroicons/react/solid";
import moment from "moment";

import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { reportApi } from "../../../../environments/Api";
import { SectionHeading } from "../../../components/HeadingWithTabs";
import { SimpleTable } from "../../../components/Tables/SimpleTable";


const tabs = [
    { name: "Dashboard", href: "/sm/analytics", current: false },
    { name: "Reports", href: "", current: true },
]

const options = [
    {
        id: 1,
        report: "Sales Report"
    },
    {
        id: 2,
        report: "Procurement Report"
    },
    {
        id: 3,
        report: "Transaction Report"
    }
]

function formatDate(date) {
    const dateArr = date.split("-");
    let day = parseInt(dateArr[2])
    const formatted = day + dateArr[1] + dateArr[0];
    return formatted;
}

export const ManageReports = () => {
    let todayDate = moment(new Date()).format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(todayDate);
    const [endDate, setEndDate] = useState(todayDate);

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
                            onClick={(click) => onDownloadClicked(click, e.row.original.id)}
                        >
                            <DownloadIcon
                                className="flex-shrink-0 h-4 w-4"
                                aria-hidden="true"
                            />
                        </button>
                    )
                }
            }

        ]
    }, [])

    const onDownloadClicked = (e, id) => {
        e.preventDefault()
        if (id === 1) {
            console.log(startDate + "|" + endDate)
            const start = formatDate(startDate);
            const end = formatDate(endDate);
            console.log("Formated: " + start + "|" + end);
            handleDownloadSalesReport(start, end)
                
        } else if (id === 2) {

        } else if (id === 3) {

        }
    }


    const handleDownloadSalesReport = (startDate, endDate) => {

        reportApi.getSalesReport(startDate, endDate).then((response) => {
            const blob = new Blob([response.data]);
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = "Sales" + startDate + "-" + endDate + ".csv"
            link.click();
        })
    }

    const onStartDateChanged = (e) => {
        e.preventDefault();
        setStartDate(e.target.value); 
    }        
    const onEndDateChanged = (e) => {
        e.preventDefault();
        setEndDate(e.target.value);
        console.log("End", endDate); 
    }
    return (
        <>
            <SectionHeading header="Reports" tabs={tabs} />
            <div className="mx-12">
                <div className="my-6 grid grid-cols-2 gap-16">
                    <div className="col-span-1 ">
                        <label
                            className="pl-1 text-sm font-medium text-gray-900"
                        >
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
                        <label
                            className="pl-1 text-sm font-medium text-gray-900"
                        >
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
}
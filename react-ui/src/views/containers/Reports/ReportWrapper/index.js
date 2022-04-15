import { Header } from "../../../components/Header";
import { SectionHeading } from "../../../components/HeadingWithTabs";
import { ManageReports } from "../ManageReports";

const tabs = [
    { name: "Dashboard", href: "/sm/analytics", current: false },
    { name: "Reports", href: "", current: true },
];

export const ReportWrapper = ({ subsys }) => {
    console.log(subsys);

    const options = [

    ];

    if (subsys === "sm" || subsys === "str") {
        options.push({
            id: 1,
            report: "Sales Report",
        })
    }

    if (subsys === "sm" || subsys === "wh") {
        options.push({
            id: 2,
            report: "Procurement Report",
        })
    }

    const tabs = [
        { name: "Dashboard", href: `/${subsys}/analytics`, current: false },
        { name: "Reports", href: "", current: true },
    ];

    return (
        <>
            {subsys === "sm" || subsys === "str" ?
                <SectionHeading header="Reports" tabs={tabs} />
                : null}
            {subsys === "wh" ?
                <Header title="Reports" />
                : null}
            <ManageReports options={options} />
        </>
    )

}
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
    SimpleTable,
    SelectColumnFilter,
} from "../../../components/Tables/SimpleTable";

import {
    fetchVendors,
    selectAllVendors,
} from "../../../../stores/slices/vendorSlice";

export const VendorsTable = ({ data }) => {
    const columns = useMemo(
        () => [
            {
                Header: "#",
                accessor: "id",
                Cell: (e) => (
                    <Link
                        to={`/ad/vendors/${e.value}`}
                        className="hover:text-gray-700 hover:underline"
                    >
                        {e.value}
                    </Link>
                ),
            },
            {
                Header: "Company Name",
                accessor: "companyName",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Telephone",
                accessor: "telephone",
            },
            {
                Header: "Country",
                accessor: (row) => row.address[0].country,
                Filter: SelectColumnFilter,
                filter: "includes",
            }
        ],
        []
    );

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="mt-4">
                <SimpleTable columns={columns} data={data} />
            </div>
        </div>
    );
};

export const VendorList = () => {
    const dispatch = useDispatch();
    const data = useSelector(selectAllVendors);
    const vendorStatus = useSelector((state) => state.vendors.status);
    useEffect(() => {
        vendorStatus === "idle" && dispatch(fetchVendors());
    }, [vendorStatus, dispatch]);
    return <VendorsTable data={data} />;
};
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CogIcon } from "@heroicons/react/outline";

import {
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import { 
  fetchJobTitles,
  selectAllJobTitle, 
} from "../../../../stores/slices/jobTitleSlice";

export const JobTitleTable = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        // Cell: (e) => (
        //   <Link
        //     to={`/admin/employee/${e.value}`}
        //     className="hover:text-gray-700 hover:underline"
        //   >
        //     {e.value}
        //   </Link>
        // ),name, department, companyCode, status, email
      },
      {
        Header: "Job Title",
        accessor: "title",
        
      },
      {
        Header: "Description",
        accessor: "description",
        //Cell: (e) => `$${e.value}`,
      },
      {
        Header: "Responsibility",
        accessor: "responsibility",
        //Cell: (e) => moment(e.value).format("lll"),
      },
      // {
      //   Header: CogIcon,
      //   accessor: "accessor",
      //   Cell: OptionsCell({
      //     options: [
      //       {
      //         name: "Delete",
      //         navigate: "/jobTitle",
      //       },
      //     ],
      //   }),
      // },
    ],
    []
  );
  const dispatch = useDispatch();
  const data = useSelector(selectAllJobTitle);
  const jobTitleStatus = useSelector((state) => state.jobTitle.status);
  useEffect(() => {
    jobTitleStatus === "idle" && dispatch(fetchJobTitles());
  }, [jobTitleStatus, dispatch]);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export const JobTitleList = () => {
  return <JobTitleTable />;
};
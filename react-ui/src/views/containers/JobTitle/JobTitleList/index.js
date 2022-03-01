import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CogIcon } from "@heroicons/react/outline";

import {
  SelectColumnFilter,
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
        Header: "#",
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
        accessor: (row) => row.Responsibility.responsibility,
        Filter: SelectColumnFilter,
        filter: "includes",
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
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable
          columns={columns}
          data={data}
          handleOnClick={handleOnClick}
        />
      </div>
    </div>
  );
};

export const JobTitleList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectAllJobTitle);
  const jobTitleStatus = useSelector((state) => state.jobTitle.status);
  useEffect(() => {
    jobTitleStatus === "idle" && dispatch(fetchJobTitles());
  }, [jobTitleStatus, dispatch]);
  
  const handleOnClick = (row) => navigate(`/ad/jobTitle/${row.original.id}`);

  return <JobTitleTable data={data} handleOnClick={handleOnClick} />;
};
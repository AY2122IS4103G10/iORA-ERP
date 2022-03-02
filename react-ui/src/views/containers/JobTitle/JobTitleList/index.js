import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import {
  fetchJobTitles,
  selectAllJobTitle,
} from "../../../../stores/slices/jobTitleSlice";

export const JobTitleTable = ({ data, handleOnClick }) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
        width: 80,
        Cell: (e) => (
          <div className="text-ellipsis overflow-hidden">{e.value}</div>
        ),
      },
      {
        Header: "Job Title",
        accessor: "title",
        width: 250,
        Cell: (e) => (
          <div className="text-ellipsis overflow-hidden">{e.value}</div>
        ),
      },
      {
        Header: "Description",
        accessor: "description",
        width: 350,
        Cell: (e) => (
          <div className="text-ellipsis overflow-hidden">{e.value}</div>
        ),
      },
      {
        Header: "Responsibilities",
        accessor: (row) => row.responsibility.join(", "),
        width: 408,
        Cell: (e) => (
          <div className="text-ellipsis overflow-hidden">{e.value}</div>
        ),
      },
    ],
    []
  );
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable columns={columns} data={data} flex={true} handleOnClick={handleOnClick} />
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
  const handleOnClick = (row) => navigate(`/ad/jobTitles/${row.original.id}`);

  return <JobTitleTable data={data} handleOnClick={handleOnClick} />;
};

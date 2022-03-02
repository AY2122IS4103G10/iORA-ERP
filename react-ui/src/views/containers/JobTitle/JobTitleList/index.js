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
      },
      {
        Header: "Job Title",
        accessor: "title",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Responsibility",
        accessor: (row) => row.responsibility.join(", "),
      },
    ],
    []
  );
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable columns={columns} data={data} handleOnClick={handleOnClick} />
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

import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../../environments/Api";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import { DashedBorderES } from "../../../components/EmptyStates/DashedBorder";
import {
  SelectColumnFilter,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";

export const ProcurementTable = ({ data, handleOnClick }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Status",
        accessor: (row) =>
          row.statusHistory[row.statusHistory.length - 1].status,
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "HQ",
        accessor: (row) => row.headquarters,
      },
      {
        Header: "Manufacturing",
        accessor: (row) =>
          Boolean(row.manufacturing) ? row.manufacturing : "-",
      },
      {
        Header: "Warehouse",
        accessor: (row) => row.warehouse,
      },
      {
        Header: "Updated",
        accessor: (row) =>
          moment
            .unix(
              row.statusHistory[row.statusHistory.length - 1].timeStamp / 1000
            )
            .format("DD/MM/YY, HH:mm:ss"),
      },
    ],
    []
  );
  return (
    <SimpleTable columns={columns} data={data} handleOnClick={handleOnClick} />
  );
};

export const ProcurementList = ({ pathname }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const currSiteId = parseInt(useSelector(selectUserSite));
  useEffect(() => {
    api
      .getAll(
        pathname.includes("sm")
          ? "sam/procurementOrder/all"
          : `sam/procurementOrder/site/${currSiteId}`
      )
      .then((response) => {
        setData(response.data);
      });
  }, [pathname, currSiteId]);
  
  const handleOnClick = (row) => navigate(`${pathname}/${row.original.id}`);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        {Boolean(data.length) ? (
          <ProcurementTable data={data} handleOnClick={handleOnClick} />
        ) : (
          pathname.includes("sm") && (
            <Link to="/sm/procurements/create">
              <DashedBorderES item="procurement order" />
            </Link>
          )
        )}
      </div>
    </div>
  );
};

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import {
  SimpleTable,
  SelectColumnFilter,
  OptionsCell,
} from "../../../components/Tables/SimpleTable";
import { DashedBorderES } from "../../../components/EmptyStates/DashedBorder";
import { api } from "../../../../environments/Api";

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
            .unix(row.statusHistory[row.statusHistory.length - 1].timeStamp / 1000)
            .format("DD/MM/YY, h:mm:ss a"),
      },
      // {
      //   Header: CogIcon,
      //   accessor: "accessor",
      //   Cell: OptionsCell({
      //     options: [
      //       {
      //         name: "Delete",
      //         navigate: "/procurements",
      //       },
      //     ],
      //   }),
      // },
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

  useEffect(() => {
    api.getAll(`sam/procurementOrder/all`).then((response) => {
      setData(response.data);
    });
  }, []);
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

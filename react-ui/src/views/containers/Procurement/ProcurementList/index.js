import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CogIcon } from "@heroicons/react/outline";
import { TailSpin } from "react-loader-spinner";
import {
  SimpleTable,
  SelectColumnFilter,
  OptionsCell,
} from "../../../components/Tables/SimpleTable";
import {
  fetchProcurements,
  selectAllProcurements,
} from "../../../../stores/slices/procurementSlice";
import { DashedBorderES } from "../../../components/EmptyStates/DashedBorder";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectAllProcurements);
  const procurementStatus = useSelector((state) => state.procurements.status);
  const error = useSelector((state) => state.products.error);

  useEffect(() => {
    procurementStatus === "idle" && dispatch(fetchProcurements());
  }, [procurementStatus, dispatch]);

  const handleOnClick = (row) => navigate(`${pathname}/${row.original.id}`);
  
  let content;

  if (procurementStatus === "loading") {
    content = (
      <div className="items-center">
        <TailSpin color="#00BFFF" height={50} width={50} />
      </div>
    );
  } else if (procurementStatus === "succeeded") {
    content = (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mt-4">
          {Boolean(data.length) ? (
            <ProcurementTable data={data} handleOnClick={handleOnClick} />
          ) : (
            <Link to="/sm/procurements/create">
              <DashedBorderES item="procurement order" />
            </Link>
          )}
        </div>
      </div>
    );
  } else {
    content = <div>{error}</div>;
  }

  return content;
};

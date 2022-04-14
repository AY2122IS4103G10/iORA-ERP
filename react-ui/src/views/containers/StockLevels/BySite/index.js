import { useEffect, useMemo } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSites,
  selectAllSites,
} from "../../../../stores/slices/siteSlice";

import { SectionHeading } from "../../../components/HeadingWithTabs";
import { SelectableTable } from "../../../components/Tables/SelectableTable";
import { SelectColumnFilter } from "../../../components/Tables/SelectableTable";

export const SiteTables = (subsys) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Company",
        accessor: "company.name",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
    ],
    []
  );
  const dispatch = useDispatch();
  const data = useSelector(selectAllSites);
  const siteStatus = useSelector((state) => state.sites.status);
  useEffect(() => {
    dispatch(getAllSites());
  }, [dispatch]);

  const path = "/" + subsys.subsys.subsys + "/stocklevels";
  return siteStatus === "loading" ? (
    <div className="flex mt-5 items-center justify-center">
      <TailSpin color="#00BFFF" height={20} width={20} />
    </div>
  ) : (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SelectableTable columns={columns} data={data} path={path} />
      </div>
    </div>
  );
};

export const SiteStocks = (subsys) => {
  let tabs = [
    {
      name: "My Site",
      href: `/${subsys.subsys}/stocklevels/my`,
      current: false,
    },
    {
      name: "By Sites",
      href: `/${subsys.subsys}/stocklevels/sites`,
      current: true,
    },
    {
      name: "By Products",
      href: `/${subsys.subsys}/stocklevels/products`,
      current: false,
    },
  ];

  if (subsys.subsys === "sm") {
    tabs = tabs.slice(1);
  }

  return (
    <>
      <SectionHeading header="Stock Levels" tabs={tabs} />
      <SiteTables subsys={subsys} />
    </>
  );
};

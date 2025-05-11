import React, { useState, useEffect } from "react";
import { fetchReportsByParts } from "../api/testReportApi";
import ReportList from "./ReportList";
import LoadMoreButton from "./LoadMoreButton";
import { useNavigate } from "react-router-dom";

export default function PartReports({ customer, partName, material }) {
  const [page, setPage] = useState(0);
  const [reports, setReports] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [totalReports, setTotalReports] = useState(0)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchReportsByParts(customer, partName, material, page).then((data) => {
      setReports((prev) => (page === 0 ? data.reports : [...prev, ...data.reports]));
      setHasMore(data.hasMore);
      setTotalReports(data.totalReports)
      setLoading(false);
    });
  }, [customer, partName, material, page]);

  function handleLoadMore() {
    setPage((prev) => prev + 1);
  }

  const navigate = useNavigate();

  const handleCreateReportClick = () => {
    navigate("/testreports/create", {
      state: { customer, partName, material }
    });
  }

  return (
    <div className="part-reports">
      <ReportList reports={reports} totalReports={totalReports} loading={loading} handleClick={handleCreateReportClick}/>
      <LoadMoreButton hasMore={hasMore} onClick={handleLoadMore} loading={loading} />
    </div>
  );
}

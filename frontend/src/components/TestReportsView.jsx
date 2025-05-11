import React, { useEffect, useState } from 'react'
import { fetchTestReports } from '../api/testReportApi'
import Filters from './Filters'
import ReportList from './ReportList'
import LoadMoreButton from './LoadMoreButton'
import { useNavigate } from 'react-router-dom'

const TestReportsView = () => {
  const [filters, setFilters] = useState({
    customer: "",
    partName: "",
    material: "",
    startDate: "",
    endDate: "",
  });
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [totalReports, setTotalReports] = useState(0)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    fetchTestReports({ ...filters, page })
      .then((data) => {
        if (page === 1) {
          setReports(data.reports)
        } else {
          setReports((prev) => [...prev, ...data.reports])
        }
        setHasMore(data.hasMore)
        setTotalReports(data.totalReports)
        setLoading(false)
      })
  }, [filters, page])

  function handleFilterChange(newFilters) {
    setFilters(newFilters)
    setPage(1)
  }

  function handleLoadMore() {
    setPage((prev) => prev + 1)
  }

  const navigate = useNavigate();
  const handleCreateReportClick = () => {
    navigate("/testreports/create", {
      state: { customer:"", partName:"", material:"" }
    });
  }

  return (
    <div>
      <Filters filters={filters} onChange={handleFilterChange} />
      <ReportList reports={reports} totalReports={totalReports} loading={loading} handleClick={handleCreateReportClick}/>
      <LoadMoreButton hasMore={hasMore} onClick={handleLoadMore} loading={loading} />
    </div>
  )
}

export default TestReportsView
import React, { useEffect, useState } from 'react'
import { fetchCustomers } from '../api/testReportApi'
import CustomerParts from './CustomerParts'
import LoadMoreButton from './LoadMoreButton'

const CustomersView = () => {
  const [page, setPage] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0); // NEW
  const [hasMore, setHasMore] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    fetchCustomers(page)
      .then((data) => {
        setCustomers((prev) => (page === 0 ? data.customers : [...prev, ...data.customers]))
        setHasMore(data.hasMore)
        setTotalCustomers(data.totalCustomers || 0) // NEW: set total
        setLoading(false)
      })
  }, [page])

  function handleExpand(customer) {
    setExpanded((prev) => ({
      ...prev,
      [customer]: !prev[customer]
    }))
  }

  function handleLoadMore() {
    setPage((prev) => prev + 1)
  }

  return (
    <div>
      <div className="customer-list-header" style={{ marginBottom: '1rem', fontWeight: 500 }}>
        Total Customers: {totalCustomers}
      </div>
      <ul className="customer-list">
        {customers.map((customer) => (
          <li key={customer} className="customer-list-item">
            <div className="customer-row">
              <span className="customer-name">{customer}</span>
              <button
                className={`expand-btn ${expanded[customer] ? "expanded" : ""}`}
                onClick={() => handleExpand(customer)}
                aria-label={expanded[customer] ? "Collapse" : "Expand"}
              >
                {expanded[customer] ? "-" : "+"}
              </button>
            </div>
            <div
              className={`expandable-content ${expanded[customer] ? "open" : ""}`}
              style={{
                maxHeight: expanded[customer] ? "500px" : "0",
                transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
              }}
            >
              {expanded[customer] && <CustomerParts customer={customer} />}
            </div>
          </li>
        ))}
      </ul>
      <LoadMoreButton hasMore={hasMore} onClick={handleLoadMore} loading={loading} />
    </div>
  )
}

export default CustomersView

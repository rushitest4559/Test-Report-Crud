import React, { useEffect, useState } from 'react'
import { fetchParts } from '../api/testReportApi';
import LoadMoreButton from './LoadMoreButton';
import PartReports from './PartReports';

const CustomerParts = ({ customer }) => {
  const [page, setPage] = useState(0);
  const [pairs, setPairs] = useState([]);
  const [totalParts, setTotalParts] = useState(0); // NEW
  const [hasMore, setHasMore] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchParts(customer, page).then((data) => {
      setPairs((prev) => (page === 0 ? data.pairs : [...prev, ...data.pairs]));
      setHasMore(data.hasMore);
      setTotalParts(data.totalParts || 0); // NEW: set totalParts from API
      setLoading(false);
    });
  }, [customer, page]);

  function handleExpand(idx) {
    setExpanded((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  }

  function handleLoadMore() {
    setPage((prev) => prev + 1);
  }

  return (
    <div>
      <div className="parts-list-header" style={{ marginBottom: '0.7rem', fontWeight: 500, marginTop: '10px' }}>
        Total Parts: {totalParts}
      </div>
      <div className="parts-list">
        {pairs.map((pair, idx) => (
          <div key={pair.partName + pair.material} className="parts-list-item">
            <div className="parts-row">
              <span className="parts-label">
                <span className="part-name">{pair.partName}</span>
                <span className="material-name">| {pair.material}</span>
              </span>
              <button
                className={`expand-btn ${expanded[idx] ? "expanded" : ""}`}
                onClick={() => handleExpand(idx)}
                aria-label={expanded[idx] ? "Collapse" : "Expand"}
              >
                {expanded[idx] ? "-" : "+"}
              </button>
            </div>
            <div
              className={`expandable-content ${expanded[idx] ? "open" : ""}`}
              style={{
                maxHeight: expanded[idx] ? "500px" : "0",
                transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
              }}
            >
              {expanded[idx] && (
                <PartReports
                  customer={customer}
                  partName={pair.partName}
                  material={pair.material}
                />
              )}
            </div>
          </div>
        ))}
        <LoadMoreButton hasMore={hasMore} onClick={handleLoadMore} loading={loading} />
      </div>
    </div>
  )
}

export default CustomerParts

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ReportList = ({ reports, loading, totalReports, handleClick }) => {

    return (
    <div className="report-list-container">
      <div className="report-list-header">
        <span>
          <strong>Total Results:</strong> {totalReports}
        </span>
        <button className="create-report-btn" onClick={handleClick}>
          + Create New Test Report
        </button>
      </div>
      {loading && reports.length === 0 ? (
        <div>Loading...</div>
      ) : reports.length === 0 ? (
        <div>No reports found.</div>
      ) : (
        <ul className="report-list">
          {reports.map((r) => (
            <li key={r._id} className="report-list-item">
              <div className="report-main">
                <div className="report-cert">{r.testCertNo}</div>
                <div className="report-details">
                  {r.customer} | {r.partName} | {r.material}
                </div>
                <div className="report-date">
                  Date: {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="report-actions">
                <Link to={`/testreports/edit/${r._id}`}><button
                  className="edit-btn"
                  onClick={() => {/* Add your edit handler here */ }}
                  aria-label="Edit"
                >
                  Edit
                </button></Link>
                <button
                  className="delete-btn"
                  onClick={() => {/* Add your delete handler here */ }}
                  aria-label="Delete"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportList;

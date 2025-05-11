import React, { useState } from 'react'
import TestReportsView from './TestReportsView'
import CustomersView from './CustomersView'

const Dashboard = () => {

  const [view, setView] = useState("reports")

  return (
    <div className="dashboard">
      <div className="dashboard-tabs">
        <button
        className={view === "reports" ? "active" : ""}
        onClick={()=>setView("reports")}
        >
          Test Reports
        </button>
        <button
        className={view === "customers" ? "active" : ""}
        onClick={()=>setView("customers")}
        >
          Customers
        </button>
      </div>
      <div className="dashboard-content">
        {view == "reports" ? <TestReportsView /> : <CustomersView />}
      </div>
    </div>
  )
}

export default Dashboard
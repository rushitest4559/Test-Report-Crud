import React, { useEffect, useState } from "react";
import TestReportForm from "../components/TestReportForm/TestReportForm";
import { getReportById, editTestReport } from "../api/testReportApi";
import { useNavigate } from "react-router-dom";

export default function EditTestReportPage({ reportId }) {
  const [initialData, setInitialData] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    getReportById(reportId).then(res => setInitialData(res.report));
  }, [reportId]);

  if (!initialData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Test Report</h2>
      <TestReportForm
        initialData={initialData}
        mode="edit"
        onSubmit={async data => {
          const res = await editTestReport(reportId, data, navigate);
          // alert(res.message || "Test report updated!");
        }}
      />
    </div>
  );
}

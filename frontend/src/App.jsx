import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./components/Dashboard";
import CreateTestReportPage from "./pages/CreateTestReportPage";
import EditTestReportPage from "./pages/EditTestReportPage";

import './styles/Dashboard.css'
import './styles/formStyles.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/testreports/create" element={<CreateTestReportPage />} />
        <Route path="/testreports/edit/:id" element={<EditTestReportPageWrapper />} />
        <Route path="/view-report/:id" element={<ReportPDFPageWrapper />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

// Wrapper to extract :id param for Edit page
import { useParams } from "react-router-dom";
import ReportPDF from "./PDF/PDFReport";
function EditTestReportPageWrapper() {
  const { id } = useParams();
  return <EditTestReportPage reportId={id} />;
}
function ReportPDFPageWrapper() {
  const { id } = useParams();
  return <ReportPDF reportId={id} />;
}

export default App;

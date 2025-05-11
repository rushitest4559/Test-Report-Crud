import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CreateTestReportPage from "./pages/CreateTestReportPage";
import EditTestReportPage from "./pages/EditTestReportPage";

import './styles/Dashboard.css'
import './styles/testReportForm.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/testreports/create" element={<CreateTestReportPage />} />
        <Route path="/testreports/edit/:id" element={<EditTestReportPageWrapper />} />
      </Routes>
    </Router>
  );
}

// Wrapper to extract :id param for Edit page
import { useParams } from "react-router-dom";
function EditTestReportPageWrapper() {
  const { id } = useParams();
  return <EditTestReportPage reportId={id} />;
}

export default App;

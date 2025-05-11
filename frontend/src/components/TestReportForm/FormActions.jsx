import React from "react";

export default function FormActions({ mode }) {
  return (
    <div className="form-actions">
      <button type="submit">{mode === "edit" ? "Update" : "Create"} Test Report</button>
      <button type="button" onClick={() => window.history.back()}>Cancel</button>
    </div>
  );
}

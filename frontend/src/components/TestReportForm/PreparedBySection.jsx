import React from "react";

export default function PreparedBySection({ form, setForm }) {
  return (
    <section className="preparedby-section">
      <h3>Prepared By</h3>
      <select
        value={form.preparedBy || ""}
        onChange={e => setForm(f => ({ ...f, preparedBy: e.target.value }))}
        required
      >
        <option value="Mahesh Pawar">Mahesh Pawar</option>
        <option value="Narendra Modi">Narendra Modi</option>
      </select>
    </section>
  );
}

import React from "react";

export default function ParametersSection({ form, setForm }) {
  function handleChange(idx, field, value) {
    const updated = form.parameters.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    );
    setForm(f => ({ ...f, parameters: updated }));
  }
  function handleAdd() {
    setForm(f => ({
      ...f,
      parameters: [...(f.parameters || []), { name: "", specified: "", actual: "" }]
    }));
  }
  function handleDelete(idx) {
    setForm(f => ({
      ...f,
      parameters: f.parameters.filter((_, i) => i !== idx)
    }));
  }

  return (
    <section className="parameters-section">
      <h3>Parameters</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specified</th>
              <th>Actual</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(form.parameters || []).map((param, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    value={param.name}
                    onChange={e => handleChange(idx, "name", e.target.value)}
                    required
                  />
                </td>
                <td>
                  <input
                    value={param.specified}
                    onChange={e => handleChange(idx, "specified", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={param.actual}
                    onChange={e => handleChange(idx, "actual", e.target.value)}
                  />
                </td>
                <td>
                  <button type="button" onClick={() => handleDelete(idx)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={handleAdd}>
        + Add Parameter
      </button>
    </section>

  );
}

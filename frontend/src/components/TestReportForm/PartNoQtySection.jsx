import React, { useEffect } from "react";

export default function PartNoQtySection({ form, setForm }) {
  // On mount, add 1 row if empty
  useEffect(() => {
    if (!form.partNoQty || form.partNoQty.length === 0) {
      setForm(f => ({
        ...f,
        partNoQty: [{ partNo: "", qty: "" }]
      }));
    }
    // Only run on mount or when form changes (not on every re-render)
    // eslint-disable-next-line
  }, []);

  function handleChange(idx, field, value) {
    const updated = form.partNoQty.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    );
    setForm(f => ({ ...f, partNoQty: updated }));
  }
  function handleAdd() {
    setForm(f => ({
      ...f,
      partNoQty: [...(f.partNoQty || []), { partNo: "", qty: "" }]
    }));
  }
  function handleDelete(idx) {
    setForm(f => ({
      ...f,
      partNoQty: f.partNoQty.filter((_, i) => i !== idx)
    }));
  }

  return (
    <section className="partnoqty-section">
      <h3>Part No / Qty</h3>
      <table>
        <thead>
          <tr>
            <th>Part No</th>
            <th>Qty</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(form.partNoQty || []).map((p, idx) => (
            <tr key={idx}>
              <td>
                <input
                  value={p.partNo}
                  onChange={e => handleChange(idx, "partNo", e.target.value)}
                  required
                />
              </td>
              <td>
                <input
                  type="number"
                  value={p.qty}
                  onChange={e => handleChange(idx, "qty", e.target.value)}
                  required
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
      <button type="button" onClick={handleAdd}>
        + Add Part
      </button>
    </section>
  );
}

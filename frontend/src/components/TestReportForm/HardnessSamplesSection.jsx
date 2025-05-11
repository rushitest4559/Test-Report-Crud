import React, { useEffect } from "react";

export default function HardnessSamplesSection({ form, setForm }) {
  // Add 5 rows by default with sampleNo 1 to 5
  useEffect(() => {
    if (!form.hardnessSamples || form.hardnessSamples.length === 0) {
      setForm(f => ({
        ...f,
        hardnessSamples: Array.from({ length: 5 }, (_, i) => ({
          sampleNo: i + 1,
          surfaceHardness: ""
        }))
      }));
    }
    // eslint-disable-next-line
  }, []);

  function handleChange(idx, field, value) {
    const updated = form.hardnessSamples.map((s, i) =>
      i === idx ? { ...s, [field]: value } : s
    );
    setForm(f => ({ ...f, hardnessSamples: updated }));
  }
  function handleAdd() {
    setForm(f => ({
      ...f,
      hardnessSamples: [
        ...(f.hardnessSamples || []),
        { sampleNo: (f.hardnessSamples?.length || 0) + 1, surfaceHardness: "" }
      ]
    }));
  }
  function handleDelete(idx) {
    setForm(f => ({
      ...f,
      hardnessSamples: f.hardnessSamples.filter((_, i) => i !== idx)
    }));
  }

  return (
    <section className="hardness-samples-section">
      <h3>Hardness Samples</h3>
      <table>
        <thead>
          <tr>
            <th>Sample No</th>
            <th>Surface Hardness</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(form.hardnessSamples || []).map((s, idx) => (
            <tr key={idx}>
              <td>
                <input
                  value={s.sampleNo}
                  onChange={e => handleChange(idx, "sampleNo", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={s.surfaceHardness}
                  onChange={e => handleChange(idx, "surfaceHardness", e.target.value)}
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
        + Add Sample
      </button>
    </section>
  );
}

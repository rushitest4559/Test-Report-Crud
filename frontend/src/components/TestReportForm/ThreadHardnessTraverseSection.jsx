import React, { useEffect } from "react";

const DISTANCES = [0.10, 0.20, 0.30, 0.40, 0.50];

export default function ThreadHardnessTraverseSection({ form, setForm }) {
  // Initialize 5 rows in form state if not present or wrong length
  useEffect(() => {
    if (!form.threadHardnessTraverse || form.threadHardnessTraverse.length !== 5) {
      setForm(f => ({
        ...f,
        threadHardnessTraverse: DISTANCES.map(d => ({
          distance: d,
          hardnessHV1: "",
          hardnessHRC: ""
        }))
      }));
    }
    // Only run on mount or when form changes
    // eslint-disable-next-line
  }, []);

  // Always use form.threadHardnessTraverse for rendering
  const traverse = form.threadHardnessTraverse || DISTANCES.map(d => ({
    distance: d,
    hardnessHV1: "",
    hardnessHRC: ""
  }));

  function handleChange(rowIdx, field, value) {
    const updated = traverse.map((row, i) =>
      i === rowIdx ? { ...row, [field]: value } : row
    );
    setForm(f => ({ ...f, threadHardnessTraverse: updated }));
  }

  return (
    <section className="thread-hardness-section">
      <h3>Thread Hardness Traverse</h3>
      <table>
        <thead>
          <tr>
            <th>Distance (mm)</th>
            <th>HardnessHV1</th>
            <th>HardnessHRC</th>
          </tr>
        </thead>
        <tbody>
          {traverse.map((row, rowIdx) => (
            <tr key={rowIdx}>
              <td>{row.distance.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  value={row.hardnessHV1}
                  onChange={e => handleChange(rowIdx, "hardnessHV1", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.hardnessHRC}
                  onChange={e => handleChange(rowIdx, "hardnessHRC", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

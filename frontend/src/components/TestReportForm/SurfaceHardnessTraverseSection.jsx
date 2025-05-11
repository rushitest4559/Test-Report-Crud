import React, { useEffect } from "react";

const DISTANCES = [
  0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00
];

export default function SurfaceHardnessTraverseSection({ form, setForm, caseDepthNames }) {
  // Prepare columns: distance + each caseDepthName
  const columns = ["Distance (mm)", ...(caseDepthNames || [])];

  // Initialize 10 rows in form state if not present or empty
  useEffect(() => {
    if (!form.surfaceHardnessTraverse || form.surfaceHardnessTraverse.length !== 10) {
      setForm(f => ({
        ...f,
        surfaceHardnessTraverse: DISTANCES.map(d => ({
          distance: d,
          hardness: {}
        }))
      }));
    }
    // Only run when form.surfaceHardnessTraverse or setForm changes
    // eslint-disable-next-line
  }, []);

  // Always use form.surfaceHardnessTraverse for rendering
  const traverse = form.surfaceHardnessTraverse || DISTANCES.map(d => ({
    distance: d,
    hardness: {}
  }));

  function handleChange(rowIdx, colName, value) {
    const updated = traverse.map((row, i) =>
      i === rowIdx
        ? {
            ...row,
            hardness: { ...row.hardness, [colName]: value }
          }
        : row
    );
    setForm(f => ({ ...f, surfaceHardnessTraverse: updated }));
  }

  return (
    <section className="surface-hardness-section">
      <h3>Surface Hardness Traverse</h3>
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col}>{col === "Distance (mm)" ? col : `Hardness HV1 (${col})`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {traverse.map((row, rowIdx) => (
            <tr key={rowIdx}>
              <td>{row.distance.toFixed(2)}</td>
              {caseDepthNames.map(colName => (
                <td key={colName}>
                  <input
                    type="number"
                    value={row.hardness[colName] ?? ""}
                    onChange={e => handleChange(rowIdx, colName, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

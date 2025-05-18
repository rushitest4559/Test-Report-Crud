import React from "react";

const styles = {
    container: {
        fontFamily: "'Segoe UI', Arial, sans-serif",
        color: "#222",
        background: "#fff",
        padding: "32px",
        width: "700px",
        margin: "0 auto",
        borderRadius: "8px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)"
    },
    header: {
        borderBottom: "2px solid #2a3f54",
        paddingBottom: "16px",
        marginBottom: "24px"
    },
    title: {
        color: "#2a3f54",
        fontSize: "2rem",
        fontWeight: 700,
        letterSpacing: "2px"
    },
    // sectionTitle: {
    //     color: "#183153",
    //     fontSize: "1.1rem",
    //     margin: "24px 0 8px 0",
    //     fontWeight: 600,
    //     borderBottom: "1px solid #eee",
    //     paddingBottom: "4px"
    // },
    // table: {
    //     width: "100%",
    //     borderCollapse: "collapse",
    //     marginBottom: "16px"
    // },
    // th: {
    //     background: "#2a3f54",
    //     color: "#fff",
    //     padding: "8px 12px",
    //     fontWeight: 600,
    //     border: "1px solid #ddd",
    // },
    // td: {
    //     padding: "8px 12px",
    //     border: "1px solid #ddd",
    // },
    sectionTitle: { fontWeight: "bold", margin: "10px 0" },
    table: { borderCollapse: "collapse", width: "100%" },
    th: { border: "1px solid #ccc", padding: "8px", backgroundColor: "#eee" },
    td: { border: "1px solid #ccc", padding: "8px", textAlign: "center" },
    remarks: {
        background: "#f6f8fa",
        borderLeft: "4px solid #2a3f54",
        padding: "12px",
        fontStyle: "italic",
        marginTop: "16px"
    }
};

function SurfaceHardnessTable({ report }) {
    if (!report?.surfaceHardnessTraverse?.length) return null;

    const data = report.surfaceHardnessTraverse;

    // Gather all unique hardness keys from entire data
    const hardnessKeys = new Set();
    data.forEach(({ hardness }) => {
        if (hardness) {
            Object.keys(hardness).forEach((key) => {
                if (hardness[key] !== undefined) hardnessKeys.add(key);
            });
        }
    });
    const hardnessColumns = Array.from(hardnessKeys);

    // Check if there's at least one valid hardness value anywhere (non-empty, non-zero)
    const hasValidValue = data.some(({ hardness }) =>
        hardnessColumns.some((key) => {
            const val = hardness?.[key];
            return val !== undefined && val !== "" && val !== 0;
        })
    );
    if (!hasValidValue) return null; // Don't show table if all empty/zero

    // Trim trailing rows where all hardness values are empty/0/undefined
    let lastValidIndex = -1;
    for (let i = data.length - 1; i >= 0; i--) {
        const row = data[i];
        const hasValidInRow = hardnessColumns.some((key) => {
            const val = row.hardness?.[key];
            return val !== undefined && val !== "" && val !== 0;
        });
        if (hasValidInRow) {
            lastValidIndex = i;
            break;
        }
    }
    const trimmedData = data.slice(0, lastValidIndex + 1);

    // Render table
    return (
        <>
            <div style={styles.sectionTitle}>Surface Hardness Traverse</div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Distance (mm)</th>
                        {hardnessColumns.map((key) => (
                            <th key={key} style={styles.th}>
                                Hardness HV1 ({key})
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {trimmedData.map(({ distance, hardness }, idx) => (
                        <tr key={idx}>
                            <td style={styles.td}>{distance}</td>
                            {hardnessColumns.map((key) => {
                                const val = hardness?.[key];
                                return (
                                    <td key={key} style={styles.td}>
                                        {val !== undefined && val !== "" && val !== 0 ? val : "-"}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

const PDFContent = React.forwardRef((props, ref) => {
    const { report } = props;
    return (
        <div ref={ref} style={styles.container}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "2px solid #1f3a5f",
                paddingBottom: "16px",
                marginBottom: "24px",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: "#1f3a5f"
            }}>
                <div style={{ flex: "1" }}>
                    <img
                        src="/logo.jpg"
                        alt="Company Logo"
                        style={{ maxHeight: "60px", objectFit: "contain" }}
                    />
                </div>

                <div style={{ flex: "2", textAlign: "center", lineHeight: "1.3" }}>
                    <h2 style={{ margin: 0, fontWeight: "700", fontSize: "1.37rem" }}>
                        JYOTI HEAT TREATMENT PVT LTD.
                    </h2>
                    <p style={{ margin: "4px 0", fontSize: "0.9rem", color: "#3a4a6f" }}>
                        J-199, M.I.D.C, Bhosari, Pune-26
                    </p>
                    <p style={{ margin: "2px 0", fontSize: "0.85rem", color: "#3a4a6f" }}>
                        Web: www.sales@jyotiht.com
                    </p>
                    <p style={{ margin: "2px 0", fontSize: "0.85rem", color: "#3a4a6f" }}>
                        Mob. No.: 8888240351 / 8888140351
                    </p>
                </div>

                <div style={{ flex: "1", textAlign: "right", fontSize: "0.85rem", color: "#555" }}>
                    <p style={{ margin: "2px 0" }}>Doc No: JHTPL/QA/F-04</p>
                    <p style={{ margin: "2px 0" }}>Rev No: 00</p>
                    <p style={{ margin: "2px 0" }}>Rev Date: 01.01.2023</p>
                </div>
            </div>

            <div style={styles.header}>
                <div style={styles.title}>Heat Treatment Report</div>
                <div style={{ marginTop: "8px" }}>
                    <strong>Test Cert No:</strong> {report.testCertNo}<br />
                    <strong>Customer:</strong> {report.customer}<br />
                    <strong>Part Name:</strong> {report.partName}<br />
                    <strong>Material:</strong> {report.material}
                </div>
            </div>

            <div style={styles.sectionTitle}>Part Numbers & Quantities</div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Part No</th>
                        <th style={styles.th}>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {report.partNoQty?.length > 0 && report.partNoQty?.map((item, idx) => (
                        <tr key={idx}>
                            <td style={styles.td}>{item.partNo}</td>
                            <td style={styles.td}>{item.qty}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={styles.sectionTitle}>Parameters</div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Parameter</th>
                        <th style={styles.th}>Specified</th>
                        <th style={styles.th}>Actual</th>
                    </tr>
                </thead>
                <tbody>
                    {report.parameters?.length > 0 && report.parameters?.map((param, idx) => (
                        <tr key={idx}>
                            <td style={styles.td}>{param.name}</td>
                            <td style={styles.td}>{param.specified}</td>
                            <td style={styles.td}>{param.actual}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <SurfaceHardnessTable report={report} />

            <div style={styles.sectionTitle}>Hardness Samples</div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Sample No</th>
                        <th style={styles.th}>Surface Hardness (HRC)</th>
                    </tr>
                </thead>
                <tbody>
                    {report.hardnessSamples?.length > 0 && report.hardnessSamples?.map((sample, idx) => (
                        <tr key={idx}>
                            <td style={styles.td}>{sample.sampleNo}</td>
                            <td style={styles.td}>{sample.surfaceHardness}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={styles.sectionTitle}>Remarks</div>
            <div style={styles.remarks} dangerouslySetInnerHTML={{ __html: report.remarks }} />

            <div style={{ marginTop: "40px", color: "#666", fontSize: "0.9rem" }}>
                <strong>Prepared By:</strong> {report.preparedBy || "________________"}
            </div>
        </div>
    )
});

export default PDFContent;
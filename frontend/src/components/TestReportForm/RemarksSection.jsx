import React, { useState } from "react";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function RemarksSection({ form, setForm }) {
  console.log(form)
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleGenerateRemarks() {
    setGenerating(true);
    setStatus(null);
    try {
      const prompt = `Generate remarks based on the following data:
${JSON.stringify({ ...form, remarks: "" })}. Indicate if the data generally meets specifications and provide reasons for any deviations. Give concise answer (accepted or not), if not accepted then give reason in one line.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setStatus({ type: "error", text: `Failed to fetch remarks: ${response.statusText}` });
      } else {
        const data = await response.json();
        if (
          data.candidates &&
          data.candidates.length > 0 &&
          data.candidates[0].content &&
          data.candidates[0].content.parts &&
          data.candidates[0].content.parts.length > 0
        ) {
          setForm(f => ({ ...f, remarks: data.candidates[0].content.parts[0].text }));
          setStatus({ type: "success", text: "Remarks generated successfully." });
        } else {
          setStatus({ type: "error", text: "Could not extract remarks from the response." });
        }
      }
    } catch (err) {
      setStatus({ type: "error", text: `An unexpected error occurred: ${err.message}` });
    } finally {
      setGenerating(false);
    }
  }

  return (
    <section className="remarks-section">
      <h3>Remarks</h3>
      <textarea
        value={form.remarks || ""}
        onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
        rows={3}
      />
      <button type="button" onClick={handleGenerateRemarks} disabled={generating}>
        {generating ? "Generating..." : "Generate Remarks"}
      </button>
      {status && (
        <div className={status.type === "error" ? "error-msg" : "success-msg"}>
          {status.text}
        </div>
      )}
    </section>
  );
}

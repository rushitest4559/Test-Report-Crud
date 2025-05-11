import React, { useState } from "react";
import BasicInfoSection from "./BasicInfoSection";
import PartNoQtySection from "./PartNoQtySection";
import ParametersSection from "./ParametersSection";
import SurfaceHardnessTraverseSection from "./SurfaceHardnessTraverseSection";
import ThreadHardnessTraverseSection from "./ThreadHardnessTraverseSection";
import HardnessSamplesSection from "./HardnessSamplesSection";
import RemarksSection from "./RemarksSection";
import PreparedBySection from "./PreparedBySection";
import FormActions from "./FormActions";

export default function TestReportForm({ initialData, mode, onSubmit }) {
  const [form, setForm] = useState(initialData);

  // Helper: check if any parameter is case depth
  const hasCaseDepth = form.parameters?.some(p =>
    p.name?.toLowerCase().includes("case depth")
  );

  // Helper: get all case depth parameter names (e.g. "@OD", "@PCD")
  const caseDepthNames = form.parameters
    ?.filter(p => p.name?.toLowerCase().includes("case depth"))
    .map(p => p.name.match(/@.+/g)?.[0] || p.name);

  // Helper: check if any parameter is thread hardness
  const hasThreadHardness = form.parameters?.some(
    p => p.name?.toLowerCase().includes("thread hardness")
  );

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="test-report-form"
    >
      <BasicInfoSection form={form} setForm={setForm} mode={mode} />
      <PartNoQtySection form={form} setForm={setForm} />
      <ParametersSection form={form} setForm={setForm} />
      {hasCaseDepth && (
        <SurfaceHardnessTraverseSection
          form={form}
          setForm={setForm}
          caseDepthNames={caseDepthNames}
        />
      )}
      {hasThreadHardness && (
        <ThreadHardnessTraverseSection form={form} setForm={setForm} />
      )}
      <HardnessSamplesSection form={form} setForm={setForm} />
      <RemarksSection form={form} setForm={setForm} />
      <PreparedBySection form={form} setForm={setForm} />
      <FormActions mode={mode} />
    </form>
  );
}

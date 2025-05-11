import React, { useState } from "react";
import { fetchParameters } from "../../api/testReportApi";
import AutocompleteInput from "./AutocompleteInput";
import {
  fetchCustomerSuggestions,
  fetchPartNameSuggestions,
  fetchMaterialSuggestions
} from "../../api/testReportApi";

export default function BasicInfoSection({ form, setForm, mode }) {
  const [fetching, setFetching] = useState(false);
  const [fetchMsg, setFetchMsg] = useState("");

  const DEFAULT_PARAMETERS = [
    { name: "Heat Treatment", specified: "CHT", actual: "CHT" },
    { name: "Surface Hardness", specified: "58-62 HRC", actual: "37 HRC" },
    { name: "Surface Hardness(After Grinding) ", specified: "58-61 HRC / 80 HRA MIN", actual: "37 HRC" },
    { name: "Core Hardness", specified: "30-39 HRC", actual: "" },
    { name: "Case Depth @OD", specified: "0.50 mm @ 550 HV1", actual: "" },
    { name: "Case Depth @PCD", specified: "0.70-1.00 mm @513Hv1", actual: "0.83mm" },

    { name: "Microstructure-Case", specified: "Tempered Martensite, RA<10%,Carbides in any form are not acceptable.", actual: "Fine Tempered martensite. RA <05%." },
    { name: "Microstructure-Core", specified: "Low Carbon Tempered Martensite", actual: "ow carbon tempered Martensite." },
    { name: "Grain Size 100X ", specified: ">=6", actual: "7" },
    { name: "Thread Hardness ", specified: "450 HV1 Max at CREAST", actual: "381 – 450 HV1" },
    { name: "Carbon Surface Content ", specified: "0.8 – 1.1%", actual: "0.83mm" },
  ];

  async function handleFetchParams() {
    setFetching(true);
    setFetchMsg("");
    const { customer, partName, material } = form;
    const res = await fetchParameters(customer, partName, material);
    setFetching(false);
    setFetchMsg(res.message || "");

    // If no parameters found, use default parameters
    const parameters = (res.parameters && res.parameters.length > 0)
      ? res.parameters
      : DEFAULT_PARAMETERS;

    setForm(f => ({ ...f, parameters }));
  }

  return (
    <section className="basic-info-section">
      <h3>Basic Info</h3>
      <input
        placeholder="Test Cert No"
        value={form.testCertNo || ""}
        onChange={e => setForm(f => ({ ...f, testCertNo: e.target.value }))}
        required
      />
      <AutocompleteInput
        placeholder="Customer"
        value={form.customer || ""}
        onChange={val => setForm(f => ({ ...f, customer: val }))}
        fetchSuggestions={fetchCustomerSuggestions}
        name="customer"
        getSuggestionValue={sug => sug.customer}
      />
      <AutocompleteInput
        placeholder="Part Name"
        value={form.partName || ""}
        onChange={val => setForm(f => ({ ...f, partName: val }))}
        fetchSuggestions={fetchPartNameSuggestions}
        name="partName"
        getSuggestionValue={sug => sug.partName}
      />
      <AutocompleteInput
        placeholder="Material"
        value={form.material || ""}
        onChange={val => setForm(f => ({ ...f, material: val }))}
        fetchSuggestions={fetchMaterialSuggestions}
        name="material"
        getSuggestionValue={sug => sug.material}
      />
      <button
        type="button"
        onClick={handleFetchParams}
        disabled={fetching || !form.customer || !form.partName || !form.material}
      >
        {fetching ? "Fetching..." : "Fetch Parameters"}
      </button>
      {fetchMsg && <div className="fetch-msg">{fetchMsg}</div>}
    </section>
  );
}
